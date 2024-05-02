import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Quiz from "../models/quiz.model.js";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function addQuiz(req, res) {
  // Validate the request
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }
  const movie = req.body.movie;
  const categories=req.body.category;
  // Check if the API key is available
  const apiKey = process.env.GEMINI_API;
  if (!apiKey) {
    throw new Error("Missing API key (process.env.GEMINI_API)");
  }

  // Create a GoogleGenerativeAI instance
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Loop to generate multiple quizzes
  
    // Your movie variable is not defined here, make sure it's defined before using it
    // Generate the prompt
    const prompt = `Generate one quiz question for the movie "${movie}". The question should be formulated as follows:
    "Question goes here?"
    Provide four possible answers separated by underscores, and enclose the correct answer in double parentheses.
     For example: [Answer1_Answer2_Answer3_((CorrectAnswer))] `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();
        

    // Define regular expressions
    const questionRegex = /"([^"]+)"/;
    const answersRegex = /\[([^\]]+)\]/;
    const correctAnswerRegex = /\(\(([^\)]+)\)\)/;
    

    // Extract the question, answers, and correct answer
    const questionMatch = text.match(questionRegex);
    const answersMatch = text.match(answersRegex);
    const correctAnswerMatch = text.match(correctAnswerRegex);
    

    // Output the results (optional)
    const question = questionMatch ? questionMatch[1] : null;
    const answers = answersMatch ? answersMatch[1].split("_") : [];
    const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : null;

    console.log(question)
    console.log(answers)
    console.log(correctAnswer)

   

    

    // Create a new quiz document in the database
    const newQuiz = {
      categorie: categories, // Replace with actual categories
      questions: [
        {
          question: question,
          answers: answers.map((answer, index) => ({
            answer: answer,
            isCorrect: index === answers.indexOf(correctAnswer),
          })),
        },
      ],
      winningPoints: 10, // Replace with actual winning points
    };

    // Save the new quiz
    try {
      const savedQuiz = await Quiz.create(newQuiz);
      console.log("New quiz created:", savedQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

  

  // Return a success response
  return res.status(201).json({ message: "Quizzes created successfully" });
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
