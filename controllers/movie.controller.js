import User from '../models/user.model.js';
import Movie from '../models/movie.model.js'

export const addtofavoris = async (req, res) => {
const { username }= req.params
const {movieId}= req.body
try{
    const user = await User.findOne({username})
    if(!user){
        return res.status(400).json({message: "user not found"})
    }
    if(!user.favouriteMovies.includes(movieId)){
        user.favouriteMovies.push(movieId)
        await user.save();
        return res.status(200).json({message: "mivie add to favoris"})
    }else{
        return res.status(400).json({message: "movie exist in favoris"})
    }
}catch(error){
    console.error(error)
    return res.status(500).json({message: "erreur serveur"})
}
};
export const removefavoris = async (req, res) => {
    const { username } = req.params;
    const { movieId } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const index = user.favouriteMovies.indexOf(movieId);
  
      if (index !== -1) {
        // Retirer le film de la liste des favoris
        user.favouriteMovies.splice(index, 1);
        await user.save();
        return res.status(200).json({ message: "Movie removed from favorites" });
      } else {
        return res.status(400).json({ message: "Movie not found in favorites" });
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
  