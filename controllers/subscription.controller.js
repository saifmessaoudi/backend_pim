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
  const { userId, planId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentToken);

    if (paymentIntent.status === "succeeded") {
      const user = await User.findById(userId);
      const plan = await Plan.findById(planId);
      // Create a new subscription
      const subscription = new Subscription({
        user: user,
        plan: plan,
        paymentToken: paymentToken,
      });

      // affect duration base on plan
      const interval = plan.duration;
      const renewalDate = new Date();
      switch (interval) {
        case "week":
          renewalDate.setDate(renewalDate.getDate() + 7);
          break;
        case "month":
          renewalDate.setMonth(renewalDate.getMonth() + 1);
          break;
      }
      subscription.endDate = renewalDate;
      await subscription.save();

      res
        .status(200)
        .json({ success: true, message: "Payment successful!", subscription });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error retrieving PaymentIntent:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyUserStatus = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    const subscription = await Subscription.findOne({ user: userId });
    if (subscription.status === "ACTIVE") {
      const currentDate = new Date();
      if (currentDate > subscription.endDate) {
        subscription.status = "CANCELED";
        await subscription.save();
        res.status(200).json({
          success: true,
          isPremium: false,
          message: "Subscription canceled",
        });
      } else {
        res.status(200).json({
          success: true,
          isPremium: true,
          message: "Subscription active",
          subscription,
        });
      }
    } else {
      res.status(200).json({
        success: true,
        isPremium: false,
        message: "No subscription found",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
