import { PointInteretInterface } from "../interfaces/PointInteret-interface";
import Fontaines from "../Models/Fontaines";

const papaparse = require("papaparse");

export default class PointInteretController {
  async getStatData(): Promise<PointInteretInterface[]> {
    try {
      // Fetch data
      let response = await fetch("http://localhost:3000/data/fontaines.csv");
      let csvData = await response.text();

      return papaparse.parse(csvData, {
        delimiter: ",",
        header: true,
      }).data;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }

    return [];
  }

  async getAllFontaine() {
    return Fontaines.find();
  }
}
