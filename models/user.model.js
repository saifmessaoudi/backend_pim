import mongoose from "mongoose";
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose


const userSchema = new mongoose.Schema(
    {
      firstName : { type: String},
      lastName : { type: String},
      email : { type: String, required: true, unique: true},
      username : { type: String, required: true, unique: true},
      password : { type: String, required: true},
      selectedgift : { type: String},
      role : { type: String, default: "user"},
      birthDate : { type: Date},
      bio : { type: String},
      latitude: { type: Number },
      longitude: { type: Number },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        
        },
        coordinates: {
          type: [Number], 
         
        },
      },
    
      profilePicture : { type: String , default: "https://louisville.edu/enrollmentmanagement/images/person-icon/image"},
      friends : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      friendRequests : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      friendRequestsSent : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      favouriteMovies : [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
      isBanend : { type: Boolean, default: false},
      lastGiftReceivedDate: { type: Date },
      favouriteGenders: {
        type: [{
            type: String,
            enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'],
        }],
        default: [],
        
    },
      isVerified : { type: Boolean, default: false},
      resetVerificationToken : { type: String},
      verificationToken: { type: String, index: true, unique: true, sparse: true },
    }
    ); 


const User = model("User", userSchema);
export default User;
