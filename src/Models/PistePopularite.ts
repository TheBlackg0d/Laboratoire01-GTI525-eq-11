import mongoose, { Document, Schema } from "mongoose";

export interface IPistePopularite {
  pisteId: number;
  compteurId: number;
  totalPassages: number;
  dateDebut: Date;
  dateFin: Date;
  NOM_ARR_VILLE_CODE: string;
}

export interface IPistePopulariteModel extends IPistePopularite, Document {}

const PistePopulariteSchema: Schema = new Schema(
  {
    pisteId: { type: Number, required: true },
    compteurId: { type: Number, required: true },
    totalPassages: { type: Number, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    NOM_ARR_VILLE_CODE: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

// Create compound index for queries
PistePopulariteSchema.index({ pisteId: 1, dateDebut: 1, dateFin: 1 });

export default mongoose.model<IPistePopulariteModel>(
  "PistePopularite",
  PistePopulariteSchema,
  "piste_popularite"
);
