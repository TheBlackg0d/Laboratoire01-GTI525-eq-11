import { PointInteretInterface } from "../interfaces/PointInteret-interface";
import PointInteret from "../Models/PointInteret";

const papaparse = require("papaparse");

export default class PointInteretController {
  async getStatData() {
    try {
      // Fetch data
      let response = await this.getAllPointInteret();

      return response;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }

    return [];
  }

  async getAllPointInteret() {
    return PointInteret.find();
  }

  async deletePointInteret(id: string) {
    return PointInteret.findByIdAndDelete(id);
  }

  async createPointInteret(params: object) {
    return PointInteret.create(params);
  }
  async getPointInteret(id: string) {
    return PointInteret.findById(id);
  }

  async update(params: object, id: string) {
    const pointInteret = await PointInteret.findById(id);

    if (pointInteret) {
      pointInteret.set(params);

      return pointInteret.save();
    } else {
      throw Error("Not Found");
    }
  }
  async getAllPointsInArea(id: string) {
    const pointInteret = await PointInteret.findById(id);
    if (pointInteret) {
      const pointInterets = await PointInteret.find({
        Arrondissement: pointInteret.Arrondissement,
      });

      return pointInterets;
    } else {
      throw Error("Not Found");
    }
  }
}
