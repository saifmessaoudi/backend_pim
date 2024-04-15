import mongoose from "mongoose";
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose


const rankSchema = new mongoose.Schema(

{
    score : { type: Number},
    date : { type: Date },
})

const Rank = model("Rank", rankSchema);
export default Rank;