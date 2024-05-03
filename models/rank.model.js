import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const rankSchema = new Schema(
    {
        name : { type: String, required: true},
        badge : { type: String, required: true},
        requiredPoints : { type: Number, required: true},
    }
    );

const Rank = model("Rank", rankSchema);

export default Rank;