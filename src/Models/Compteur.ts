import exp from "constants";
import mongoose, { Document, Schema } from "mongoose";

export interface ICompteur {
  ID: number;
  Ancien_ID: number;
  Nom: string;
  Statut: string;
  Latitude: number;
  Longitude: number;
  Annee_implante: number;
}

export interface ICompteurModel extends ICompteur, Document {}

const CompteurSchema: Schema = new Schema(
  {
    ID: { type: Number, required: true },
    Ancien_ID: { type: Number, required: true },
    Nom: { type: String, required: true },
    Statut: { type: String, required: true },
    Latitude: { type: Number, required: true },
    Longitude: { type: Number, required: true },
    Annee_implante: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICompteurModel>(
  "Compteur",
  CompteurSchema,
  "compteur"
);
