import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    read: { type: Boolean, default: false }
  }, { timestamps: true });
  
  const Notification = mongoose.model('Notification', notificationSchema);
  export default Notification;
  