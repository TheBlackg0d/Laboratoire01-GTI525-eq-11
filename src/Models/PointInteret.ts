import mongoose, { Document, Schema } from "mongoose";
const autiIncrement = require("mongoose-id-autoincrement");
export interface IPointInteret {
  ID: number;
  Arrondissement: string;

  Nom_parc_lieu: string;

  Proximite_jeux_repere: string;

  Intersection: string;

  Precision_localisation: string;

  X: number;

  Y: number;

  Longitude: number;
  Latitude: number;
  type: string;
  Remarque: string;
}

export interface IPointInteretModel extends IPointInteret, Document {}

const pointInteretSchema: Schema = new Schema(
  {
    Arrondissement: { type: String, required: true },
    Remarque: { type: String, required: false, default: "none" },
    type: { type: String, required: true },
    Nom_parc_lieu: { type: String, required: true },
    Proximite_jeux_repere: { type: String, required: false, default: "none" },
    Intersection: { type: String, required: true },
    Precision_localisation: { type: String, required: false, default: "none" },
    X: { type: Number, required: false, default: 0 },
    Y: { type: Number, required: false, default: 0 },
    Longitude: { type: Number, required: false, default: 0 },
    Lagitude: { type: Number, required: false, default: 0 },
    ID: { type: Number, required: false, default: 0 },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IPointInteretModel>(
  "PointInteret",
  pointInteretSchema,
  "pointInteret"
);
