import { Router } from "express";
import { addMovie } from "../controllers/movie.controller.js";
import { trendingMovies , listMovies, toprated } from "../controllers/movieController.js";

const movieRouter = Router();

movieRouter.post("/addMovie", addMovie);


movieRouter.route('/')
.get(listMovies)

movieRouter.route('/toprated')
.get(toprated)

movieRouter.route('/trendingMovies')
.get(trendingMovies)

export default  movieRouter;
