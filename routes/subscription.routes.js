import { Router } from "express";
import { verifyPayment } from "../controllers/subscription.controller.js";
import { sendSMS } from '../config/SmsService.js';

const subscriptionRouter = Router();


subscriptionRouter.post("/verifyPayment", verifyPayment);
subscriptionRouter.post('/send', sendSMS);

export default subscriptionRouter;