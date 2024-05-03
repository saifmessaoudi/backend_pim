import { Router } from "express";


import { addMovie ,rateMovie ,fetchUserRating,removeRating, getMoviesgenre} from "../controllers/movie.controller.js";
import { listMovies } from "../controllers/movieController.js";
import { addtofavoris ,getFavoris ,getAllMovies,checkIsFavoris , getById,getmoviebytitle,moviesStatsparRapportRating} from '../controllers/movie.controller.js';
const movierouter = Router();

movierouter.route('/')
.get(listMovies)




const movieRouter = Router();
movieRouter.post("/addMovie", addMovie);


movieRouter.route('/')
.get(listMovies)
/*

movieRouter.route('/toprated')
.get(toprated)

movieRouter.route('/trendingMovies')
.get(trendingMovies)
*/

movieRouter.post("/rateMovie/:movieId", rateMovie);
movieRouter.post("/fetchUserRating/:movieId", fetchUserRating);
movieRouter.post("/removeRating/:movieId", removeRating);
movieRouter.post('/:id/addFavoriteMovie', addtofavoris);
movieRouter.get('/getfavoris/:username', getFavoris);
movieRouter.get('/getMoviesgenre/:username', getMoviesgenre);
movieRouter.post('/checkIsFavoris/:userId', checkIsFavoris);
movieRouter.get('/:movieId', getById);
movieRouter.get('/', getAllMovies);
movieRouter.get('/wassim/:title', getmoviebytitle);
movieRouter.get('/stats/ratings', moviesStatsparRapportRating);



export default  movieRouter;





