import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import Plan from "../models/plan.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendSMS } from "../config/SmsService.js";
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

      const result = sendSMS(
        `Hey ${user.username} ! Your subscription to ${plan.title} has been done . Thanks.`
      );
    console.log(result);

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
export const getSubscriptionStatsByDay = async (req, res) => {
  try {
      const subscriptionstats = await Subscription.aggregate([
        {$group:{
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
          count: { $sum: 1 }
        }}
      ]);
      res.json({ subscriptionstats})

  } catch (error) { 
    res.status(500).json({ success: false, message: "Internal server error" });
    console.error(error);
  }
  
};
export const getSubscriptionrevenue = async (req, res) => {
  try {
    const subscriptionRevenue = await Subscription.aggregate([
      {
        $lookup: {
          from: 'plans', // name of the collection for Plan
          localField: 'plan', // field in Subscription to join on
          foreignField: '_id', // field in Plan to join on
          as: 'planDetails', // alias for the joined data
        },
      },
      {
        $unwind: '$planDetails', // flatten the array to get individual plan details
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
          totalRevenue: { $sum: '$planDetails.price' }, // sum the prices
        },
      
      },
      {
        $sort: { _id: 1 }, // optional: sort by date
      },
    ]);

    res.json({ success: true, data: subscriptionRevenue });

  } catch (error) {
    console.error("Error in getSubscriptionRevenue:", error); // log the error for debugging
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  
};
export const getTotalSubscriptionRevenue = async (req, res) => {
  try {
    const totalRevenue = await Subscription.aggregate([
      {
        $lookup: {
          from: 'plans', // name of the collection for Plan
          localField: 'plan', // field in Subscription to join on
          foreignField: '_id', // field in Plan to join on
          as: 'planDetails', // alias for the joined data
        },
      },
      {
        $unwind: '$planDetails', // flatten to get individual plan details
      },
      {
        $group: {
          _id: null, // No grouping key; all results combined
          totalRevenue: { $sum: '$planDetails.price' }, // sum all prices
        },
      },
    ]);

    const revenue = totalRevenue[0] ? totalRevenue[0].totalRevenue : 0; // Get the total revenue
    res.json({ success: true, totalRevenue: revenue }); // Respond with the total revenue

  } catch (error) {
    console.error("Error in getTotalSubscriptionRevenue:", error); // Log errors for debugging
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

