import mongoose from "mongoose";
const { Schema, model } = mongoose;

const quizSchema = new Schema({
  categorie: [
    {
      type: String,
     
    },
  ],
  question: {
        type: String,
  },
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
     
    },
  ],
  winningPoints: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = model("Quiz", quizSchema);
export default Quiz;
