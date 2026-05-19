import {Request,Response,NextFunction} from "express"
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import { newOrder } from "../services/order.service";
import { sendMail } from "../utilis/sendMail";
import notificationModel from "../models/notification.model";
import mongoose from "mongoose";

export const createOrder=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {courseId,payment_info}=req.body as IOrder
        
        const user=await userModel.findById(req.user?._id)
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        const userId = user._id?.toString()
        if(!userId){
            return next(new ErrorHandler("User not found",404))
        }

        const courseExistInUser=user.courses.some((course:any)=>course.courseId.toString()===courseId)

        if(courseExistInUser){
            return next(new ErrorHandler("You have already purchase this course",400))
        }

        // After extracting courseId from req.body:
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new ErrorHandler("Invalid course ID format", 400));
        }

        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        
        const data:any={
            courseId:course._id.toString(),
            userId,
            payment_info
        }

        
        const mailData={
            order:{
                _id:course._id.toString().slice(0, 6),
                name:course.name,
                price:course.price,
                date:new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
            }
        }

        try {
            await sendMail({
                email:user.email,
                subject:"Order Confirmation",
                template:"order-confirmation.ejs",
                data:mailData
            })
        } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
        }

        user.courses.push({courseId:course._id.toString()})

        await user.save()
        
        await notificationModel.create({
            userId,
            title:"New Order",
            message: `You've a new order from ${course.name}`,
        })

        course.purchased = (course.purchased ?? 0) + 1;
        
        await course.save()

         newOrder(data,res,next)
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})
