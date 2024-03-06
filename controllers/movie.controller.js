import Movie from "../models/movie.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

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


export const addtofavoris = async (req, res) => {
    const userId = req.params.id;
    const { movieId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const movieIndex = user.favouriteMovies.indexOf(movieId);

        if (movieIndex === -1) {
            // Movie is not in favorites, add it
            user.favouriteMovies.push(movieId);
            await user.save();
            return res.status(200).json({ message: "Movie added to favorites", action: "added" });
        } else {
            // Movie is in favorites, remove it
            user.favouriteMovies.splice(movieIndex, 1);
            await user.save();
            return res.status(200).json({ message: "Movie removed from favorites", action: "removed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

  


  export const getFavoris = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Fetch detailed information for each movie using the IDs
        const favoriteMoviesDetails = await Movie.find({ _id: { $in: user.favouriteMovies } });

        // Return the list of favorite movies with details
        return res.status(200).json({ favoriteMovies: favoriteMoviesDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const checkIsFavoris = async (req, res) => {
    const { userId } = req.params;
    const { movieId } = req.body;
    try {
      const user = await User .findById(userId );
      const isFavoris = user.favouriteMovies.includes(movieId);
      if (isFavoris){
        return res.status(200).json({isFavoris})
      }
        else{
            return res.status(400).json(null)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
        }
    };

export const getById = async (req, res) => {
    const movieId = req.params.movieId;
    
    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
            // Retourne l'ID du film et l'attribut link
        const { _id, link } = movie;
        return res.status(200).json({ _id, link });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    };
    
