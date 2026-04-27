import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "./catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utilis/redis";
dotenv.config();

// authenticated user
export const isAuthenticated = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400),
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string,
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access Token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    req.user=JSON.parse(user)

    next()
  },
);

// authorize role
export const authorizeRoles=(...roles:string[])=>{
    return(req:Request,res:Response,next:NextFunction)=>{
        if(!roles.includes(req.user?.role || "")){
            return next(new ErrorHandler(`Role ${req.user?.role} is not allowed to access this resource`,403))
        }
        next()
    }
}
