import { NextFunction, Response } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import orderModel from "../models/order.model";

// create new order
export const newOrder = CatchAsyncHandler(async (data: any, res: Response, next: NextFunction) => {
    const order = await orderModel.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  },
);
