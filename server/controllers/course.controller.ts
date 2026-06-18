import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/course.model";
import ejs from "ejs";
import { redis } from "../utilis/redis";
import mongoose from "mongoose";
import path from "path";
import { sendMail } from "../utilis/sendMail";
import notificationModel from "../models/notification.model";
import axios from "axios";

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

      const thumbnail = data.thumbnail;

      const courseId = req.params.id as string;

      const courseData = (await courseModel.findById(courseId)) as any;

      if (!data) {
        return next(new ErrorHandler("Course data is required", 400));
      }

      if (thumbnail && !thumbnail.startsWith("https")) {
        // delete previous thumbnail
        await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        // then uoload new thumnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses/thumbnail",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true },
      );

      // Update the Redis cache with the new course data
      if (course) {
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);
      }
      
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

        await redis.set(
          courseId.toString(),
          JSON.stringify(course),
          "EX",
          604800,
        ); //7 days expiry
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
export const getCourseByUser = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId,
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible for this course", 404),
        );
      }

      const course = await courseModel.findById(courseId);

      const courseContent = course?.courseData;

      res.status(200).json({
        success: true,
        courseContent,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content Id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content Id", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      courseContent.questions.push(newQuestion);

      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      // send notification to admin
      await notificationModel.create({
        userId: userId.toString(),
        title: "New Question Recieved",
        message: `You have a new question in ${courseContent.title}`,
      });

      await course?.save();

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// add answer in course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content Id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content Id", 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId),
      );

      if (!question) {
        return next(new ErrorHandler("Invalid Question Id", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add this answer to our course content
      question?.questionReplies?.push(newAnswer);

      await course?.save();

      // user validation to add notification/email sending
      if (req.user?._id === question.user._id) {
        const userId = req.user?._id;

        if (!userId) {
          return next(new ErrorHandler("Invalid user", 400));
        }

        // send notification to admin
        await notificationModel.create({
          userId: userId.toString(),
          title: "New Question Reply Recieved",
          message: `You have a new question reply in ${courseContent.title}`,
        });
      } else {
        // send mail

        const data: any = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data,
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// add review to course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check if course Id exists in user course list based on _id
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId?.toString(),
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible for this course", 404),
        );
      }

      const course = await courseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((review: any) => {
        avg += review.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} left a review for ${course?.name}`,
      };

      // create a notification

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// add reply to review
interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 400));
      }

      const review = course.reviews.find(
        (rev: any) => rev._id.toString() === reviewId,
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 400));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies.push(replyData);

      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get all courses -- only for admin
export const getAdminAllCourses = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// delete course -- only for admin
export const deleteCourse = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await courseModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await courseModel.findByIdAndDelete(id);

      if (typeof id === "string") {
        await redis.del(id);
      }

      res.status(200).json({
        success: true,
        message: "Course Deleted Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// generate video url
export const generateVideoUrl = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { videoId } = req.body;

      if (!videoId || typeof videoId !== "string") {
        return next(
          new ErrorHandler("A valid Video ID string is required", 400),
        );
      }

      videoId = videoId.trim();

      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        {
          ttl: 300,
          // Allow playback from localhost during development
          ...(process.env.NODE_ENV === "development" && {
            whitelisthref: "http://localhost:3000",
          }),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        },
      );

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error(
        "VDOCIPHER ERROR DETAILS:",
        error.response?.data || error.message,
      );

      const statusCode = error.response?.status || 500;

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate video OTP";

      return next(new ErrorHandler(errorMessage, statusCode));
    }
  },
);
