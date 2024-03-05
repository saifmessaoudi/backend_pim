import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Quiz from "../models/quiz.model.js";

export function addQuiz(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }
  Quiz.create(req.body)
    .then((newQuiz) => {
      res.status(201).json(newQuiz);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteQuiz(req, res) {
  Quiz.findOneAndDelete(req.params.id)
    .then((Quiz) => {
      if (!Quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.status(200).json({ message: "Quiz deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
