import { Double } from "bson";
import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const taskSchema = new Schema(
    {
        title : { type: String, required: true},
        releaseDate : { type: Date, required: true},
        description : { type: String, required: true},
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
    );

const Task = model("Task", taskSchema);
export default Task;
