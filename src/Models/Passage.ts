import mongoose, { Document, Schema } from "mongoose";

export interface IPassage {
  compteurId: number;
  passage: number;
  date: Date;
}

export interface IPassageModel extends IPassage, Document {}

const PassageSchema: Schema = new Schema(
  {
    compteurId: { type: Number, required: true },
    passage: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IPassageModel>(
  "Passage",
  PassageSchema,
  "comptage_velo"
);
