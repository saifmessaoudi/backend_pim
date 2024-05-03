import mongoose from "mongoose";
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose


const reclamationSchema = new mongoose.Schema(

{
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reclamationText : { type: String},
    date : { type: Date },
})

const Reclamation = model("Reclamation", reclamationSchema);
export default Reclamation;