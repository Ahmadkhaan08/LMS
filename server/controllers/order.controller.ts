import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { sendMail } from "../utilis/sendMail";
import notificationModel from "../models/notification.model";
import mongoose from "mongoose";
import Stripe from "stripe";
import { redis } from "../utilis/redis";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

dotenv.config();

export const createOrder = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id as string;
          const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized!", 400));
          }
        }
      }

      const user = await userModel.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      const userId = user._id?.toString();
      if (!userId) {
        return next(new ErrorHandler("User not found", 404));
      }

      const courseExistInUser = user.courses.some(
        (course: any) => course.courseId.toString() === courseId,
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchase this course", 400),
        );
      }

      // After extracting courseId from req.body:
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID format", 400));
      }

      const course = await courseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id.toString(),
        userId,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user.courses.push({ courseId: course._id.toString() });

      await redis.set(req.user?._id as any,JSON.stringify(user   ))

      await user.save();

      await notificationModel.create({
        userId,
        title: "New Order",
        message: `You've a new order from ${course.name}`,
      });

      course.purchased = (course.purchased ?? 0) + 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get all orders -- only for admin
export const getAllOrders = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// send stripe publishable key
export const sendStripePublishableKey = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISABLE_KEY,
    });
  },
);

// new payment
export const newPayment = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
