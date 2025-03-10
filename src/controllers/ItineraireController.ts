const papaparse = require("papaparse");

export default class ItineraireController {
  async getGeoData(): Promise<String> {
    try {
      // Fetch data
      let response = await fetch(
        "http://localhost:3000/data/reseau_cyclable.geojson"
      );
      let geojson = await response.json();
      return geojson;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }

    return "";
  }
}
