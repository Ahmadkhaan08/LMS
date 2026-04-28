import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.service";
import courseModel from "../models/course.model";

// upload course
export const uploadCourse=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data = req.body

        if (!data) {
            return next(new ErrorHandler("Course data is required", 400))
        }

        const thumbnail=data.thumbnail

        if(thumbnail){

            const myCloud=await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses/thumbnail"
            })

            data.thumbnail={
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }  
        
        createCourse(data,res,next)

    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// edit course
export const editCourse=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data = req.body

        if (!data) {
            return next(new ErrorHandler("Course data is required", 400))
        }

        const thumbnail=data.thumbnail

        if(thumbnail){
            // delete previous thumbnail
            await cloudinary.v2.uploader.destroy(thumbnail.public_id)
            // then uoload new thumnail
            const myCloud=await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses/thumbnail"
            })

            data.thumbnail={
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        } 
        
        const courseId=req.params.id

        const course=await courseModel.findByIdAndUpdate(courseId,{$set:data},{new:true})

        res.status(201).json({
            success:true,
            course
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})
