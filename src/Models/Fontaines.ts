import mongoose, { Document, Schema } from "mongoose";

export interface IFontaine {
  Arrondissement: string;

  Nom_parc_lieu: string;

  Proximite_jeux_repere: string;

  Intersection: string;

  Precision_localisation: string;

  X: number;

  Y: number;

  Longitude: number;
  Latitude: number;
}

export interface IFontaineModel extends IFontaine, Document {}

const FontaineSchema: Schema = new Schema(
  {
    Arrondissement: { type: String, required: true },
    Nom_parc_lieu: { type: String, required: true },
    Proximite_jeux_repere: { type: String, required: true },
    Intersection: { type: String, required: true },
    Precision_localisation: { type: String, required: true },
    X: { type: Number, required: true },
    Y: { type: Number, required: true },
    Longitude: { type: Number, required: true },
    Lagitude: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IFontaineModel>(
  "Fontaine",
  FontaineSchema,
  "fontaine"
);
