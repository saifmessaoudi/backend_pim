import mongoose from "mongoose";
import Plan from "../models/plan.model.js";


export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}