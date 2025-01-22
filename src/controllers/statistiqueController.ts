import {CompteurInterface} from "../interfaces/compteur-interface";

const papaparse = require('papaparse');

export default class StatistiqueController {

    async getStatData(): Promise<CompteurInterface[]> {

        try {
            // Fetch data
            let response = await fetch('http://localhost:3000/data/compteurs.csv');
            let csvData = await response.text();

            return papaparse.parse(csvData, {
                delimiter: ",",
                header: true
            }).data;
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
        }

        return []
    }
}