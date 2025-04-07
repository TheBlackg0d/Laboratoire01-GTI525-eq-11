import mongoose, { Document, Schema } from "mongoose";

export interface ITerritoire {
  nom: string;
  codeID: string;
  abrev: string;
  type: string;
  comment?: string | null;
  dateModif: string;
  geometry: object;
}

export interface ITerritoireModel extends ITerritoire, Document {}

const TerritoireSchema: Schema = new Schema(
  {
    nom: { type: String, required: true },
    codeID: { type: String, required: true },
    abrev: { type: String, required: true },
    type: { type: String, required: true },
    comment: { type: String, default: null },
    dateModif: { type: String, required: true },
    geometry: { type: Object, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ITerritoireModel>(
  "Territoire",
  TerritoireSchema,
  "territoire"
);
