import Reclamation from "../models/reclamation.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";


export const createReclamation= async(req, res) => {
  const userId = req.body.userId

    if (!req.body.reclamationText) {
      return res.status(400).json({ error: 'Incomplete data for reclamation submission' });
    }
  
    const currentUser = await User.findById( userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newReclamation = new Reclamation({
        reclamationText: req.body.reclamationText,
        date: new Date(),
        user : currentUser
    });

  
    newReclamation.save()
      .then(() => res.status(201).json(newReclamation))
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
  
      // Fetch user objects for each reclamation
      const reclamationsWithUsers = await Promise.all(reclamations.map(async (reclamation) => {
        const user = await User.findById(reclamation.user);
        return { ...reclamation.toObject(), user }; // Merge reclamation and user objects
      }));
  
      res.status(200).json(reclamationsWithUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  