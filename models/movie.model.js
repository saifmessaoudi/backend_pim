import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const movieSchema = new Schema(
    {
        title : { type: String, required: true},
        releaseDate : { type: Date, required: true},
        country : { type: String, required: true},
        director : { type: String, required: true},
        synopsis : { type: String, required: true},
        poster : { type: String, required: true},
        link : { type: String, required: true},
        ratingtotal : { type: Number},
        genre : { type: String, required: true},
        duration : { type: Number, required: true},
        rating : [
            {
                user : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
                rating : { type: Number, required: true},
                date : { type: Date, default: Date.now}
            }
        ],     
    }
    );

const Movie = model("Movie", movieSchema);
export default Movie;
