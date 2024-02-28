import mongoose from "mongoose";
import Plan from "../models/plan.model.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const createPlan = async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;
    const newPlan = new Plan({ title, description, price, duration });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir un plan par ID
export const getPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un plan
export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, duration } = req.body;
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { title, description, price, duration },
      { new: true }
    );
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    a;
    res.status(404).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const id = req.params.id;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await Plan.findOneAndDelete(id);

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
