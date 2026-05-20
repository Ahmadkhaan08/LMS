import { Response,Request, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import { generateLast12MonthsData } from "../utilis/analytics.generator";
import userModel from "../models/user.model";
import orderModel from "../models/order.model";
import courseModel from "../models/course.model";



// get user analytics -- only for admin
export const getUsersAnalytics=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const users = await generateLast12MonthsData(userModel)

        res.status(200).json({
            success:true,
            users
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get course analytics -- only for admin
export const getCoursesAnalytics=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const courses = await generateLast12MonthsData(courseModel)

        res.status(200).json({
            success:true,
            courses
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})


// get order analytics -- only for admin
export const getOrdersAnalytics=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const orders = await generateLast12MonthsData(orderModel)

        res.status(200).json({
            success:true,
            orders
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})