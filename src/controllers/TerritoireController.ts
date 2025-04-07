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

  async getGeoData(): Promise<string> {
    // try {
    //   // Fetch data
    //   let response = await fetch(
    //     "http://localhost:3000/data/territoires.geojson"
    //   );
    //   let geojson = await response.json();
    //   return geojson;
    // } catch (error) {
    //   console.error("Error fetching or parsing data:", error);
    // }

    const territoires = await Territoire.find();

    const geojson = {
      type: "FeatureCollection",
      features: territoires.map((territoire) => ({
        type: "Feature",
        properties: {
          CODEID: territoire.codeID,
          NOM: territoire.nom,
          CODEMAMH: territoire.codeMAMH,
          NUM: territoire.num,
          ABREV: territoire.abrev,
          TYPE: territoire.type,
          COMMENT: territoire.comment,
          DATEMODIF: territoire.dateModif
        },
        geometry: territoire.geometry,
      })),
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      }
    };
    
    return JSON.stringify(geojson);
  }

  async delete(territoireId: number) {
    return Territoire.findByIdAndDelete(territoireId);
  }
}
