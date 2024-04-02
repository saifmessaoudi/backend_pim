import mongoose from "mongoose";
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose

const messageSchema = new Schema(
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
    { _id: false } 
  );

const roomSchema = new Schema(
    {
        title : { type: String, required: true},
        moviename : { type: String, required: true},
        userowner : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        roomusers : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        roomusersPending : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        Allroomusers : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        UsersMicAccess : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        UsersChatAccess : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        UsersOwnerAccess : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        
        
        messages: [messageSchema],
        roomPoster: { type: String, required: true},
    }
    );

const Room = model("Room", roomSchema);
export default Room;
