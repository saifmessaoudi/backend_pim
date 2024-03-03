import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const planSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: String, required: true },
    }
);

const Plan = model("Plan", planSchema);
export default Plan;