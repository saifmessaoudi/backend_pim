import { Router } from "express";
import { verifyPayment } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();


subscriptionRouter.post("/verifyPayment", verifyPayment);

export default subscriptionRouter;