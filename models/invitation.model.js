import mongoose from 'mongoose';
const { Schema, model } = mongoose; 


const invitationSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending'
    }
  });
  export default model("Invitation", invitationSchema);