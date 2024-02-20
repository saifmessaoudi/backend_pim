import { Router } from "express";
import { addtofavoris,removefavoris ,getFavoris} from '../controllers/movie.controller.js';

const movierouter = Router();

// Change app.post to movierouter.post
movierouter.post('/:username/addFavoriteMovie', addtofavoris);
movierouter.post('/:username/removeFavoriteMovie', removefavoris);
movierouter.get('/getfavoris/:username', getFavoris);
export default movierouter;
