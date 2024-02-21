import mongoose from "mongoose";
import Movie from "../models/movie.model.js";



export async function trendingMovies(req, res) {
    try {
      const trendingMovies = await Movie.find({ ratingtotal: { $gte: 6, $lte: 8 } });
      res.status(200).json(trendingMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  
export async function toprated(req, res) {
    try {
      const trendingMovies = await Movie.find({ ratingtotal: { $gte: 4, $lt: 6 } });
      res.status(200).json(trendingMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

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
