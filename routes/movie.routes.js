import { Router } from "express";
import { addMovie } from "../controllers/movie.controller.js";

const movieRouter = Router();

movieRouter.post("/addMovie", addMovie);

export default movieRouter;
