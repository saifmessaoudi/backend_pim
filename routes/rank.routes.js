import { Router } from "express";
import rank from "../controllers/rank.controller.js";

const rankRouter = Router();

rankRouter.post("/addRank", rank.addRank);
rankRouter.get("/getRanks", rank.getRanks);
rankRouter.get("/getRankById/:id", rank.getRankById);
rankRouter.get("/getRankByName/:name", rank.getRankByName);
rankRouter.get("/getRankByPoints/:points", rank.getRankByPoints);
rankRouter.put("/updateRank/:id", rank.updateRank);
rankRouter.delete("/deleteRank/:id", rank.deleteRank);
rankRouter.post("/affectedRank", rank.affectRankToUser);
rankRouter.get("/getRankByUser/:id", rank.getRankByUserId);


export default rankRouter;