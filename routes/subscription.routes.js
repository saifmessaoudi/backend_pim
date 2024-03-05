import { Router } from "express";
<<<<<<< HEAD
import { verifyPayment } from "../controllers/subscription.controller.js";
import { sendSMS } from '../config/SmsService.js';
=======
import { verifyPayment, verifyUserStatus } from "../controllers/subscription.controller.js";
>>>>>>> 6246832901513bf198eb42032b3b978e56a06d60

const subscriptionRouter = Router();


subscriptionRouter.post("/verifyPayment", verifyPayment);
<<<<<<< HEAD
subscriptionRouter.post('/send', sendSMS);
=======
subscriptionRouter.post("/verifyUserStatus", verifyUserStatus);
>>>>>>> 6246832901513bf198eb42032b3b978e56a06d60

export default subscriptionRouter;