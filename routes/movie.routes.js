import { Router } from "express";

import { listMovies} from '../controllers/movieController.js';

const movierouter = Router();

movierouter.route('/')
.get(listMovies)
/*

movierouter.route('/toprated')
.get(toprated)

movierouter.route('/trendingMovies')
.get(trendingMovies)
*/

export default  movierouter;
