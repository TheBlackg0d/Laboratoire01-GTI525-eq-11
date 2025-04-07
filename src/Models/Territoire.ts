import mongoose, { Document, Schema } from "mongoose";

export interface ITerritoire {
  nom: string;
  codeID: number;
  abrev: string;
  type: string;
  comment?: string | null;
  dateModif: string;
  codeMAMH: string;
  num: number;
  geometry: object;
}

export interface ITerritoireModel extends ITerritoire, Document {}

const TerritoireSchema: Schema = new Schema(
  {
    nom: { type: String, required: true },
    codeID: { type: Number, required: true },
    abrev: { type: String, required: true },
    type: { type: String, required: true },
    comment: { type: String, default: null },
    dateModif: { type: String, required: true },
    codeMAMH: { type: String, required: true },
    num: { type: Number, required: true },
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
