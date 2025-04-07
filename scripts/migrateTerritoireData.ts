import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { config } from "../src/config/db";
import Territoire from "../src/Models/Territoire";

interface GeoJSONFeature {
  properties: {
    CODEID: number;
    NOM: string;
    CODEMAMH: string;
    NUM: number;
    ABREV: string;
    TYPE: string;
    COMMENT?: string | null;
    DATEMODIF: string;
  };
  geometry: object;
}

async function migrateTerritoireData() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: "majority" });
    console.log("Connected to MongoDB");

    // Read GeoJSON file
    const geojsonPath = path.join(__dirname, "../public/data/territoires.geojson");
    const rawData = fs.readFileSync(geojsonPath, "utf8");
    const geojsonData = JSON.parse(rawData);

    // Check if we have features
    if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
      throw new Error("Invalid GeoJSON: No features array found");
    }

    console.log(`Found ${geojsonData.features.length} features to migrate`);

    // Delete existing data
    await Territoire.deleteMany({});
    console.log("Cleared existing territoire data");

    // Map features to required schema
    const territoires = geojsonData.features.map((feature: GeoJSONFeature) => {
      return {
        abrev: feature.properties.ABREV,
        codeID: feature.properties.CODEID,
        nom: feature.properties.NOM,
        type: feature.properties.TYPE,
        comment: feature.properties.COMMENT || null,
        dateModif: feature.properties.DATEMODIF,
        geometry: feature.geometry,
      };
    });

    // Insert features
    const result = await Territoire.insertMany(territoires);
    console.log(`Migrated ${result.length} territoires to database`);

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateTerritoireData();