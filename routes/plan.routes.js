import { Router } from "express";
import { getPlans } from "../controllers/plan.controller.js";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "../controllers/plan.controller.js";
const planRouter = Router();

planRouter.get("/", getPlans);
planRouter.post("/", createPlan);

planRouter.get("/", getAllPlans);

planRouter.get("/:id", getPlanById);

planRouter.put("/:id", updatePlan);

planRouter.delete("/:id", deletePlan);

export default planRouter;
