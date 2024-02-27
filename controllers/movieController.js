import mongoose from "mongoose";
import Movie from "../models/movie.model.js";

export async function listMovies(req, res) {
    Movie
    .find({})
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
  }