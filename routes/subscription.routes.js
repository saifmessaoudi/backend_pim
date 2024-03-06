import { Router } from "express";
import {
  verifyPayment,
  verifyUserStatus,
} from "../controllers/subscription.controller.js";
import { sendSMS } from "../config/SmsService.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/verifyPayment", verifyPayment);

subscriptionRouter.post('/send', sendSMS);

subscriptionRouter.post("/verifyUserStatus", verifyUserStatus);


export default subscriptionRouter;
