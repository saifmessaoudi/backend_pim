import User from '../models/user.model.js';


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