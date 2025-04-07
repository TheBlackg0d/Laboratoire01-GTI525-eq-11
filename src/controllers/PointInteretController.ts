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

  async getPointInteretById(id: number) {
    return PointInteret.find({ ID: id });
  }

  async getFilteredPointInteret(
    limite: number,
    page: number,
    type: string,
    territoire: string,
    nom: string
  ) {
    const filter: any = {};
    if (type) {
      filter.type = { $regex: type };
    }

    if (nom) {
      filter.Nom_parc_lieu = { $regex: nom };
    }

    if (territoire) {
      filter.Arrondissement = territoire;
    }

    return PointInteret.find(filter)
      .limit(limite)
      .skip(page * limite);
  }
}
