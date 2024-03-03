import { Router } from "express";
import { addMovie ,rateMovie ,fetchUserRating,removeRating} from "../controllers/movie.controller.js";
import { trendingMovies , listMovies, toprated } from "../controllers/movieController.js";
import { addtofavoris ,getFavoris ,checkIsFavoris} from '../controllers/movie.controller.js';

const movieRouter = Router();

movieRouter.post("/addMovie", addMovie);


movieRouter.route('/')
.get(listMovies)

movieRouter.route('/toprated')
.get(toprated)

movieRouter.route('/trendingMovies')
.get(trendingMovies)

movieRouter.post("/rateMovie/:movieId", rateMovie);
movieRouter.post("/fetchUserRating/:movieId", fetchUserRating);
movieRouter.post("/removeRating/:movieId", removeRating);
movieRouter.post('/:id/addFavoriteMovie', addtofavoris);
movieRouter.get('/getfavoris/:username', getFavoris);
movieRouter.post('/checkIsFavoris/:userId', checkIsFavoris);


export default  movieRouter;





