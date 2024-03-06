import mongoose from "mongoose";
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose



const roomSchema = new Schema(
    {
        title : { type: String, required: true},
        moviename : { type: String, required: true},
        userowner : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        roomusers : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        roomusersPending : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        

       
        
        
            
    }
    );

const Room = model("Room", roomSchema);
export default Room;
