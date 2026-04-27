import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utilis/sendMail";
import { sendToken } from "../utilis/jwt";
import { redis } from "../utilis/redis";
dotenv.config();

// Register User
interface IRegisterationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerationUser = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmail = await userModel.findOne({ email });

      if (isEmail) {
        return next(new ErrorHandler("Email Already Exists!", 400));
      }

      const user: IRegisterationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data,
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account! `,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// create user activate token
interface IActivationToken {
  token: string;
  activationCode: string;
}
const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" },
  );

  return { activationCode, token };
};

// activate user function
interface IActivateRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivateRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email and password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email and password", 400));
      }

      sendToken(user,200,res)
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// logout user
export const logoutUser=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.cookie("access_token","",{maxAge:1})
    res.cookie("refresh_token","",{maxAge:1})

    const userId=req.user?._id || '' 

    redis.del(userId as string)

    res.status(200).json({
      success:true,
      message:"Logged Out Successfully"
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})
