import mongoose, { Document, Schema } from "mongoose";

export interface ICompteur {
  compteurId: number;
  passage: number;
  date: Date;
}

export interface ICompteurModel extends ICompteur, Document {}

const CompteurSchema: Schema = new Schema(
  {
    compteurId: { type: Number, required: true },
    passage: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICompteurModel>(
  "Compteur",
  CompteurSchema,
  "comptage_velo"
);
