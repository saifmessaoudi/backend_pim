import mongoose from "mongoose";


const userSchema = mongoose.Schema(
    {
      firstName : { type: String, required: true},
      lastName : { type: String, required: true},
      email : { type: String, required: true, unique: true},
      username : { type: String, required: true, unique: true},
      password : { type: String, required: true},
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
const User = mongoose.model("User", userSchema);

export default User;
