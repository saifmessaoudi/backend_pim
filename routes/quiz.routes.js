import {Router} from "express";
import { addQuiz , deleteQuiz,getAllQuiz} from "../controllers/quiz.controller.js";
import Quiz  from "./quiz.routes.js";

const quizRouter = Router();

quizRouter.route('/addquiz')
.post(addQuiz);

quizRouter.delete('/deletequiz/:id', deleteQuiz);
quizRouter.get('/getquiz',getAllQuiz);

export default quizRouter;


