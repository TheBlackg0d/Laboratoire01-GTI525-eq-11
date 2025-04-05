import mongoose from "mongoose";
import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import { config } from "../src/config/db";
import PisteCyclable from "../src/Models/PisteCyclable";
import PistePopularite from "../src/Models/PistePopularite";

// Interface for comptage CSV row
interface ComptageRow {
  compteurId: string;
  passage: string;
  date: string;
}

// Interface for compteur CSV row
interface CompteurRow {
  ID: string;
  Ancien_ID: string;
  Nom: string;
  Statut: string;
  Latitude: string;
  Longitude: string;
  Annee_implante: string;
}

// Function to read and parse CSV files
async function readCSVFile<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true
        })
      )
      .on("data", (data: T) => {
        results.push(data);
      })
      .on("end", () => {
        console.log(`Finished reading ${filePath}, found ${results.length} records`);
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Function to process data and create monthly aggregates
function aggregateMonthlyData(comptageData: ComptageRow[]): Map<string, Map<string, number>> {
  // Map structure: compteurId -> (yearMonth -> totalPassages)
  const monthlyAggregates = new Map<string, Map<string, number>>();

  for (const row of comptageData) {
    const compteurId = row.compteurId;
    const passage = parseInt(row.passage, 10) || 0;
    const date = new Date(row.date);
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!monthlyAggregates.has(compteurId)) {
      monthlyAggregates.set(compteurId, new Map<string, number>());
    }

    const compteurMonthly = monthlyAggregates.get(compteurId)!;
    const currentTotal = compteurMonthly.get(yearMonth) || 0;
    compteurMonthly.set(yearMonth, currentTotal + passage);
  }

  return monthlyAggregates;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Find nearby pistes for a compteur
function findNearbyPistes(
  compteurLat: number,
  compteurLon: number,
  pistes: any[],
  maxDistance: number = 0.5, // 500 meters in km
  maxResults: number = 3
): string[] {
  // Calculate distance to each piste
  const pistesWithDistance = pistes.map(piste => {
    const pisteCoords = piste.geometry.coordinates[0];

    let pisteLat: number, pisteLon: number;

    const midIndex = Math.floor(pisteCoords.length / 2);
    pisteLon = pisteCoords[midIndex][0];
    pisteLat = pisteCoords[midIndex][1];

    const distance = calculateDistance(compteurLat, compteurLon, pisteLat, pisteLon);

    return {
      pisteId: piste.properties.ID_CYCL,
      distance
    };
  });

  // Sort by distance and filter within maxDistance
  const nearbyPistes = pistesWithDistance
    .filter(p => p.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults)
    .map(p => p.pisteId);

  return nearbyPistes;
}

async function generatePopularityData() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: "majority" });
    console.log("Connected to MongoDB");

    // Read compteurs.csv file
    console.log("Reading compteurs.csv...");
    const compteursFilePath = path.join(__dirname, "../public/data/compteurs.csv");
    const compteurs: CompteurRow[] = await readCSVFile<CompteurRow>(compteursFilePath);
    console.log(`Loaded ${compteurs.length} compteurs with location data`);

    // Create a map of compteur IDs to their coordinates
    const compteurCoordinates = new Map<string, { lat: number, lon: number }>();
    for (const compteur of compteurs) {
      // Skip compteurs with invalid coordinates
      if (!compteur.Latitude || !compteur.Longitude ||
        isNaN(parseFloat(compteur.Latitude)) || isNaN(parseFloat(compteur.Longitude))) {
        continue;
      }

      compteurCoordinates.set(compteur.ID, {
        lat: parseFloat(compteur.Latitude),
        lon: parseFloat(compteur.Longitude)
      });
    }
    console.log(`Created coordinate map for ${compteurCoordinates.size} compteurs`);

    // Read all comptage CSV files
    const comptageFiles = [
      "../public/data/comptage_velo_2019-v2.csv",
      "../public/data/comptage_velo_2020-v2.csv",
      "../public/data/comptage_velo_2021-v2.csv",
      "../public/data/comptage_velo_2022-v2.csv"
    ];

    let allComptageData: ComptageRow[] = [];

    for (const file of comptageFiles) {
      console.log(`Reading file: ${file}...`);
      const filePath = path.join(__dirname, file);
      const data = await readCSVFile<ComptageRow>(filePath);
      allComptageData = [...allComptageData, ...data];
    }

    console.log(`Total comptage records read: ${allComptageData.length}`);

    // Aggregate data by month for each compteur
    console.log("Aggregating data by month...");
    const monthlyAggregates = aggregateMonthlyData(allComptageData);

    // Get all pistes
    const pistes = await PisteCyclable.find();
    console.log(`Found ${pistes.length} bike paths`);

    // Create a map of compteur to nearby pistes based on geographical proximity
    const compteurToPistesMap = new Map<string, string[]>();

    for (const [compteurId, coords] of compteurCoordinates.entries()) {
      // Find pistes near this compteur based on geographical proximity
      const nearbyPistes = findNearbyPistes(coords.lat, coords.lon, pistes);

      // If no nearby pistes found, assign a random piste to ensure we have data
      if (nearbyPistes.length === 0 && pistes.length > 0) {
        const randomIndex = Math.floor(Math.random() * pistes.length);
        const randomPisteId = pistes[randomIndex].properties.ID_CYCL;
        compteurToPistesMap.set(compteurId, [randomPisteId.toString()]);
        console.log(`No nearby pistes found for compteur ${compteurId}, assigned random piste`);
      } else {
        compteurToPistesMap.set(compteurId, nearbyPistes);
      }
    }

    // Delete existing popularity data
    await PistePopularite.deleteMany({});
    console.log("Cleared existing popularity data");

    // Generate popularity data from the aggregated counts
    const popularityData: {
      pisteId: string;
      compteurId: number;
      totalPassages: number;
      dateDebut: Date;
      dateFin: Date;
    }[] = [];

    for (const [compteurId, monthlyData] of monthlyAggregates.entries()) {
      // Skip compteurs not in our compteurToPistesMap
      if (!compteurToPistesMap.has(compteurId)) continue;

      const pistesForCompteur = compteurToPistesMap.get(compteurId) || [];

      for (const pisteId of pistesForCompteur) {
        for (const [yearMonth, totalPassages] of monthlyData.entries()) {
          const [year, month] = yearMonth.split('-').map(num => parseInt(num, 10));

          const dateDebut = new Date(year, month - 1, 1);
          const dateFin = new Date(year, month, 0); // Last day of the month

          popularityData.push({
            pisteId,
            compteurId: parseInt(compteurId, 10),
            totalPassages,
            dateDebut,
            dateFin
          });
        }
      }
    }

    // Insert the popularity data in batches to avoid memory issues
    const batchSize = 1000;
    for (let i = 0; i < popularityData.length; i += batchSize) {
      const batch = popularityData.slice(i, i + batchSize);
      await PistePopularite.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(popularityData.length / batchSize)}`);
    }

    console.log(`Generated ${popularityData.length} popularity records`);
    console.log("Data generation completed successfully");
  } catch (error) {
    console.error("Data generation failed:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

generatePopularityData();