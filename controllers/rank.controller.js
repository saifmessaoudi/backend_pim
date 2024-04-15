import Rank from "../models/rank.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export function createRank(req, res) {
    
    if (!req.body.score) {
      return res.status(400).json({ error: 'Incomplete data for rank submission' });
    }
  
    const newRank = new Rank({
        score: req.body.score,
        date: new Date()
    });

  
    newRank.save()
      .then(() => res.status(201).json({ message: 'Rank submitted successfully' }))
      .catch((saveError) => res.status(500).json({ error: saveError.message }));
  }
  export const getAllRank = async (req, res) => {
    try {
      const rank = await Rank.find({});
      if (rank.length === 0) {
        return res.status(404).json("No rank found"); 
      }
      res.status(200).json(rank);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };