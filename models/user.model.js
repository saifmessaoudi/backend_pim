import mongoose from "mongoose";
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose


const userSchema = new mongoose.Schema(
    {
      firstName : { type: String, required: false},
      lastName : { type: String, required: false},
      email : { type: String, required: false, unique: true},
      username : { type: String, required: false, unique: true},
      password : { type: String, required: false},
      role : { type: String, default: "user"},
      birthDate : { type: Date},
      bio : { type: String},
      profilePicture : { type: String , default: "https://louisville.edu/enrollmentmanagement/images/person-icon/image"},
      friends : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      friendRequests : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      friendRequestsSent : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      favouriteMovies : [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
      isBanned : { type: Boolean, default: false},
      isVerified : { type: Boolean, default: false},
      
    }
    ); 

export default model("User",userSchema);
