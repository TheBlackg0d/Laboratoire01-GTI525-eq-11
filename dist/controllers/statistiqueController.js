"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const papaparse = require('papaparse');
class StatistiqueController {
    getStatData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch data
                let response = yield fetch('http://localhost:3000/data/compteurs.csv');
                let csvData = yield response.text();
                return papaparse.parse(csvData, {
                    delimiter: ",",
                    header: true
                }).data;
            }
            catch (error) {
                console.error('Error fetching or parsing data:', error);
            }
            return [];
        });
    }
}
exports.default = StatistiqueController;
//# sourceMappingURL=statistiqueController.js.map