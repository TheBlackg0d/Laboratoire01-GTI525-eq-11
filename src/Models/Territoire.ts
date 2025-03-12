import mongoose, { Document, Schema } from "mongoose";

export interface ITerritoire {
  nom: string;
  codeID: string;
  abrev: string;
}

export interface ITerritoireModel extends ITerritoire, Document {}

const TerritoireSchema: Schema = new Schema(
  {
    nom: { type: String, required: true },
    codeID: { type: String, required: true },
    abrev: { type: String, required: true },
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
