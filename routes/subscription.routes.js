import { Router } from "express";
import {
  verifyPayment,
  verifyUserStatus,getSubscriptionStatsByDay,
  getSubscriptionrevenue,getTotalSubscriptionRevenue
} from "../controllers/subscription.controller.js";
import { sendSMS } from "../config/SmsService.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/verifyPayment", verifyPayment);

subscriptionRouter.post('/send', sendSMS);

subscriptionRouter.post("/verifyUserStatus", verifyUserStatus);
subscriptionRouter.get('/stats', getSubscriptionStatsByDay);
subscriptionRouter.get('/revenue', getSubscriptionrevenue);
subscriptionRouter.get('/totalrevenue', getTotalSubscriptionRevenue);

export default subscriptionRouter;
