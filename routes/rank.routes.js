import { Router } from "express";
import { createRank ,  getAllRank} from "../controllers/rank.controller.js";





const rankRouter = Router();


rankRouter.post('/addrank', createRank);

rankRouter.get("/rank" , getAllRank);

export default rankRouter;