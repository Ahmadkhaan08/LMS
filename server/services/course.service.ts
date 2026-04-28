import { Response } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import courseModel from "../models/course.model";



export const createCourse=CatchAsyncHandler(async(data:any,res:Response)=>{
    const course=await courseModel.create(data)
    res.status(201).json({
        success:true,
        course
    })
})