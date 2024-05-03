import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Quiz from "../models/quiz.model.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function addQuiz(req, res) {
  // Validate the request
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }
  const movie = req.body.movie;
  const categories = req.body.categories;

  console.log("movie", movie);
  console.log("categories", categories);

  const apiKey = process.env.GEMINI_API;
  if (!apiKey) {
    throw new Error("Missing API key (process.env.GEMINI_API)");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate one quiz question for the movie "${movie}" in the following format:
  "**Question**: goes here?"
  **Answers**:
  a) answer1
  b) answer2
  c) answer3
  d) answer4
  **Correct answer**:
  Indicate the correct answer here`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const generatedQuestion = await response.text();

  // Extracting the question
  const questionRegex = /\*\*Question\*\*:\s*(.+?)\n/;
  const questionMatch = generatedQuestion.match(questionRegex);
  const question = questionMatch ? questionMatch[1].trim() : null;

  // Extracting the answers
  const answerRegex = /\*\*Answers\*\*:\s*((?:\s*[a-d]\)\s*.*(?:\n|$))+)/i;
  const answerMatch = generatedQuestion.match(answerRegex);
  const answersBlock = answerMatch ? answerMatch[1].trim() : null;
  const answers = answersBlock
    ? answersBlock
        .match(/[a-d]\)\s*(.+)/gi)
        .map((answer) => answer.trim().substring(3))
    : [];

  // Extracting the correct answer
  const correctAnswerRegex = /\*\*Correct answer\*\*:\s*([a-d])\)\s*(.+)/i;
  const correctAnswerMatch = generatedQuestion.match(correctAnswerRegex);
  const correctAnswer = correctAnswerMatch
    ? correctAnswerMatch[2].trim()
    : null;

  console.log("Question:", question);
  console.log("Answers:", answers);
  console.log("Correct answer:", correctAnswer);

  const newQuiz = new Quiz({
    categorie: categories,
    question: question,
    answers: answers.map((answer, index) => ({
      answer,
      isCorrect: correctAnswer === answer ? true : false,
    })),
    winningPoints: 20,
  });

  await newQuiz.save();

  return res
    .status(200)
    .json({ message: "Quiz created successfully", newQuiz });
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
export function getAllQuiz(req, res) {
  Quiz.find({})
    .then((quiz) => {
      res.status(200).json(quiz);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
