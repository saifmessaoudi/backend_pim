import { Router } from "express";
import { addtofavoris,removefavoris } from '../controllers/movieController.js';

const movierouter = Router();

// Change app.post to movierouter.post
movierouter.post('/:username/addFavoriteMovie', addtofavoris);
movierouter.post('/:username/removeFavoriteMovie', removefavoris);
export default movierouter;
