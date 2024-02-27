import { Router } from "express";

import { listMovies } from '../controllers/movieController.js';

const movierouter = Router();

movierouter.route('/')
.get(listMovies)

export default  movierouter;