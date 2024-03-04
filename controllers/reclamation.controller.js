import Reclamation from "../models/reclamation.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export function createReclamation(req, res) {
    if (!req.body.reclamationText) {
      return res.status(400).json({ error: 'Incomplete data for reclamation submission' });
    }
  
    const newReclamation = new Reclamation({
        reclamationText: req.body.reclamationText,
        date: new Date()
    });

  
    newReclamation.save()
      .then(() => res.status(201).json({ message: 'Reclamation submitted successfully' }))
      .catch((saveError) => res.status(500).json({ error: saveError.message }));
  }
  export const deleteReclamation = async (req, res) => {
    try {
      const id = req.params.id;
  
      const reclamation = await Reclamation.findById(id);
  
      if (!reclamation) {
        return res.status(400).json({ error: 'Reclamation not found' });
      }
  
      await Reclamation.findOneAndDelete({ _id:id });
  
      res.status(200).json({ message: 'Reclamation deleted successfully' });
    } catch (error) {
      console.error(`Error deleting reclamation: ${error.message}`);
      res.status(500).json({ error: 'Failed to delete reclamation' });
    }
  };
  export const getAllReclamations = async (req, res) => {
    try {
      const reclamations = await Reclamation.find({});
      if (reclamations.length === 0) {
        return res.status(404).json("No reclamations found"); 
      }
      res.status(200).json(reclamations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };