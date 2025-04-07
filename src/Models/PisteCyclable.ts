import mongoose, { Document, Schema } from "mongoose";

export interface IPisteCyclable {
    type: string; // e.g., "Feature"
    properties: {
        ID_CYCL: number;
        ID_TRC: number;
        AFFICHEUR_DYNAMIQUE: string; // "Oui" / "Non"
        AVANCEMENT_CODE: string;
        AVANCEMENT_DESC: string;
        COMPTEUR_CYLISTE: string; // "Oui" / "Non"
        LONGUEUR: number;
        NBR_VOIE: number;
        NOM_ARR_VILLE_CODE: string;
        NOM_ARR_VILLE_DESC: string;
        PROTEGE_4S: string; // "Oui" / "Non"
        REV_AVANCEMENT_CODE: string;
        REV_AVANCEMENT_DESC: string;
        ROUTE_VERTE: string; // "Oui" / "Non"
        SAISONS4: string; // "Oui" / "Non"
        SAS_VELO: string; // "Oui" / "Non"
        SEPARATEUR_CODE: string | null; // Marked as potentially null
        SEPARATEUR_DESC: string | null; // Marked as potentially null
        TYPE_VOIE_CODE: string;
        TYPE_VOIE_DESC: string;
        TYPE_VOIE2_CODE: string;
        TYPE_VOIE2_DESC: string;
        VILLE_MTL: string; // "Oui" / "Non"
    };
    geometry: {
        type: string;
        coordinates: number[][][];
    };
}

export interface IPisteCyclableModel extends IPisteCyclable, Document { }

const PisteCyclableSchema: Schema = new Schema(
    {
        type: { type: String, required: true, default: "Feature" },
        properties: {
            ID_CYCL: { type: Number, required: false },
            ID_TRC: { type: Number, required: false },
            AFFICHEUR_DYNAMIQUE: { type: String, required: false },
            AVANCEMENT_CODE: { type: String, required: false },
            AVANCEMENT_DESC: { type: String, required: false },
            COMPTEUR_CYLISTE: { type: String, required: false },
            LONGUEUR: { type: Number, required: false },
            NBR_VOIE: { type: Number, required: false },
            NOM_ARR_VILLE_CODE: { type: String, required: false },
            NOM_ARR_VILLE_DESC: { type: String, required: false },
            PROTEGE_4S: { type: String, required: false },
            REV_AVANCEMENT_CODE: { type: String, required: false },
            REV_AVANCEMENT_DESC: { type: String, required: false },
            ROUTE_VERTE: { type: String, required: false },
            SAISONS4: { type: String, required: false },
            SAS_VELO: { type: String, required: false },
            SEPARATEUR_CODE: { type: String, required: false, default: null },
            SEPARATEUR_DESC: { type: String, required: false, default: null },
            TYPE_VOIE_CODE: { type: String, required: false },
            TYPE_VOIE_DESC: { type: String, required: false },
            TYPE_VOIE2_CODE: { type: String, required: false },
            TYPE_VOIE2_DESC: { type: String, required: false },
            VILLE_MTL: { type: String, required: false },
        },
        geometry: {
            type: { type: String, required: true, default: "LineString" },
            coordinates: { type: [[[Number]]], required: true }
        }
    },
    {
        versionKey: false,
    }
);

// Create an index on ID_CYCL for faster lookups
PisteCyclableSchema.index({ 'properties.ID_CYCL': 1 });

export default mongoose.model<IPisteCyclableModel>(
    "PisteCyclable",
    PisteCyclableSchema,
    "pistes_cyclables"
);