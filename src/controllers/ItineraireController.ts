import PisteCyclable from "../Models/PisteCyclable";
import PistePopulaire from "../Models/PistePopularite";

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

  // New method to get all pistes from database
  async getAllPistes() {
    try {
      const pistes = await PisteCyclable.find();
      return {
        type: "FeatureCollection",
        features: pistes
      };
    } catch (error) {
      console.error("Error fetching pistes from database:", error);
      throw error;
    }
  }

  // Get a specific piste by ID
  async getPisteById(id: number) {
    try {
      const piste = await PisteCyclable.findOne({ "properties.ID_CYCL": id });
      if (!piste) {
        return null;
      }
      return piste;
    } catch (error) {
      console.error(`Error fetching piste with ID ${id}:`, error);
      throw error;
    }
  }

  // Get popular pistes based on date range
  async getPopularPistes(start?: string, end?: string) {
    try {
      const startDate = start 
      ? new Date(start.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) 
      : new Date('2019-01-01');
      
      const endDate = end 
        ? new Date(end.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) 
        : new Date();
      
      // Get popularity data
      const popularPistes = await PistePopulaire.aggregate([
        {
          $match: {
            dateDebut: { $gte: startDate },
            dateFin: { $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$pisteId",
            totalPassages: { $sum: "$totalPassages" }
          }
        },
        {
          $sort: { totalPassages: -1 }
        },
        {
          $limit: 3 // Get top 3 most popular
        }
      ]);
      
      // Get actual piste data for the popular ones
      const pisteIds = popularPistes.map(item => item._id);
      const pistes = await PisteCyclable.find({ "properties.ID_CYCL": { $in: pisteIds } });
      
      // Sort the pistes based on popularity
      const sortedPistes = pistes.sort((a, b) => {
        const aPopularity = popularPistes.find(
          item => item._id === a.properties.ID_CYCL
        )?.totalPassages || 0;
        const bPopularity = popularPistes.find(
          item => item._id === b.properties.ID_CYCL
        )?.totalPassages || 0;
        return bPopularity - aPopularity;
      });
      
      return {
        type: "FeatureCollection",
        features: sortedPistes
      };
    } catch (error) {
      console.error("Error fetching popular pistes:", error);
      throw error;
    }
  }
}
