import { Router } from "express";
import { verifyPayment, verifyUserStatus } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();


subscriptionRouter.post("/verifyPayment", verifyPayment);
subscriptionRouter.post("/verifyUserStatus", verifyUserStatus);

export default subscriptionRouter;