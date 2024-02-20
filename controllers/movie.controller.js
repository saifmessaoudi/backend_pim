import Movie from "../models/movie.model.js";
import mongoose from "mongoose";

export const addMovie = async (req, res) => {
    const movie = req.body;
    const newMovie = new Movie(movie);
    try {   
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};