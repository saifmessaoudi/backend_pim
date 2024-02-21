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

export const rateMovie = async (req, res) => {
    
   const movieId = req.params.movieId;
   const userId = req.body.userId;
    const rating = req.body.rating;
    const movie = await Movie.findById(movieId);
    const userRating = movie.rating.find(rating => rating.user == userId);
    if (userRating) {
        userRating.rating = rating;
        try {
            await movie.save();
            res.status(201).json(movie);
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    } else {
    const newRating = {
        user: userId,
        rating: rating,
        date: Date.now()
    };
    movie.rating.push(newRating);
    try {
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}}

export const fetchUserRating = async (req, res) => {
    const movieId = req.params.movieId;
    const userId = req.body.userId;
    const movie = await Movie.findById(movieId);
    const userRating = movie.rating.find(rating => rating.user == userId);
    try {
        res.status(200).json(userRating);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const removeRating = async (req, res) => {
    const movieId = req.params.movieId;
    const userId = req.body.userId;

    try {
        const movie = await Movie.findById(movieId);

        // Find the index of the rating for the specified user
        const userRatingIndex = movie.rating.findIndex(rating => rating.user == userId);

        if (userRatingIndex !== -1) {
            // If the rating for the user is found, remove it from the array
            movie.rating.splice(userRatingIndex, 1);

            // Save the updated movie document
            await movie.save();

            res.status(200).json({ message: 'Rating removed successfully' });
        } else {
            res.status(404).json({ message: 'Rating not found for the specified user' });
        }
    } catch (error) {
        console.error('Error removing rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

