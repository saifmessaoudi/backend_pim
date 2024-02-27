import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import Plan from "../models/plan.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
export const verifyPayment = async (req, res) => {
    const { paymentToken } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentToken);
    
        // Check the paymentIntent status
        if (paymentIntent.status === 'succeeded') {
          // Payment was successful
          res.status(200).json({ success: true, message: 'Payment successful!' });
        } else {
          // Payment failed or is still in progress
          res.status(400).json({ success: false, message: 'Payment failed or still in progress.' });
        }
      } catch (error) {
        console.error('Error retrieving PaymentIntent:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
 }
