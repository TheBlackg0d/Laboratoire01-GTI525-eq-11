import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { config } from "../src/config/db";
import PisteCyclable from "../src/Models/PisteCyclable";

async function migrateData() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: "majority" });
    console.log("Connected to MongoDB");

    // Read GeoJSON file
    const geojsonPath = path.join(__dirname, "../public/data/reseau_cyclable.geojson");
    const rawData = fs.readFileSync(geojsonPath, "utf8");
    const geojsonData = JSON.parse(rawData);

    // Check if we have features
    if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
      throw new Error("Invalid GeoJSON: No features array found");
    }

    console.log(`Found ${geojsonData.features.length} features to migrate`);

    // Delete existing data
    await PisteCyclable.deleteMany({});
    console.log("Cleared existing bike path data");

    // Insert features
    const result = await PisteCyclable.insertMany(geojsonData.features);
    console.log(`Migrated ${result.length} bike paths to database`);

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateData();