import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../utilis/redis";

// upload course
export const uploadCourse = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      if (!data) {
        return next(new ErrorHandler("Course data is required", 400));
      }

      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses/thumbnail",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// edit course
export const editCourse = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      if (!data) {
        return next(new ErrorHandler("Course data is required", 400));
      }

      const thumbnail = data.thumbnail;

      if (thumbnail) {
        // delete previous thumbnail
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        // then uoload new thumnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses/thumbnail",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true },
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get single course ---- without purchasing
export const getSingleCourse = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      if (!courseId) {
        return next(new ErrorHandler("Course not found", 400));
      }

      const isCacheExists = await redis.get(courseId.toString());

      if (isCacheExists) {
        const course = JSON.parse(isCacheExists);

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await courseModel
          .findById(req.params.id)
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions",
          );

        await redis.set(courseId.toString(), JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get all course ---- without purchasing
export const getAllCourse = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExists = await redis.get("allCourses");

      if (isCacheExists) {
        const courses = JSON.parse(isCacheExists);

        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await courseModel
          .find()
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions",
          );

        await redis.set("allCourses", JSON.stringify(courses));
        
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


// get course content ---- for valid user
export const getCourseByUser=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const userCourseList=req.user?.courses

    const courseId=req.params.id

    const courseExists=userCourseList?.find((course:any)=>course._id.toString()===courseId)

    if(!courseExists){
      return next(new ErrorHandler("You are not eligible for this course",404))
    }

    const course=await courseModel.findById(courseId)

    const courseContent=course?.courseData

    res.status(200).json({
      success:true,
      courseContent
    })
  } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
})