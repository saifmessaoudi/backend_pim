import { Router } from "express";
import { addtofavoris } from '../controllers/movieController.js';

const movierouter = Router();

// Change app.post to movierouter.post
movierouter.post('/:username/addFavoriteMovie', addtofavoris);

export default movierouter;
