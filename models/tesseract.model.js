import mongoose from "mongoose";
const { Schema, model } = mongoose;

const extractedDataSchema = new Schema({
    nom: String,
    prenom: String,
    identifiant: String
});

const ExtractedData = model("ExtractedData", extractedDataSchema);

export default ExtractedData;
