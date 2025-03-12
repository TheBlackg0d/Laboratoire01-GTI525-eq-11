import mongoose from "mongoose";
import Territoire from "../Models/Territoire";

export default class TerritoireController {
  async createTerritoire(nom: string, codeID: string, abrev: string) {
    const territoire = new Territoire({
      _id: new mongoose.Types.ObjectId(),
      nom,
      codeID,
      abrev,
    });

    return territoire.save();
  }

  async readTerroire(territoireId: string) {
    return Territoire.findById(territoireId);
  }

  async readAll() {
    return Territoire.find();
  }

  async update(
    nom: string,
    codeID: string,
    abrev: string,
    territoireId: number
  ) {
    const territoire = await Territoire.findById(territoireId);

    if (territoire) {
      territoire.set({ nom, codeID, abrev });

      return territoire.save();
    } else {
      throw Error("Not Found");
    }
  }

  async getGeoData(): Promise<String> {
    try {
      // Fetch data
      let response = await fetch(
        "http://localhost:3000/data/territoires.geojson"
      );
      let geojson = await response.json();
      return geojson;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }

    return "";
  }

  async delete(territoireId: number) {
    return Territoire.findByIdAndDelete(territoireId);
  }
}
