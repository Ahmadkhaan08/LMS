import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncHandler } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utilis/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utilis/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utilis/jwt";
import { redis } from "../utilis/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary"
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
        user
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

    const userId=req.user?._id
    if (userId) {
      await redis.del(userId.toString())
    }

    res.status(200).json({
      success:true,
      message:"Logged Out Successfully"
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})


// update access token
export const updateAccessToken=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const refresh_token=req.cookies.refresh_token as string

    const decoded=jwt.verify(refresh_token,process.env.REFRESH_TOKEN as string) as JwtPayload

    const message="Could not refresh token"

    if(!decoded){
      return next(new ErrorHandler(message, 400));
    }

    const session=await redis.get(decoded.id as string)

    if(!session){
      return next(new ErrorHandler(message, 400));
    }

    const user=JSON.parse(session)

    const accessToken=jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string,{expiresIn:"5m"})

    const refreshToken=jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string,{expiresIn:"3d"})

    req.user=user

    res.cookie("access_token",accessToken,accessTokenOptions)
    res.cookie("refresh_token",refreshToken,refreshTokenOptions)

    res.status(200).json({
      status:"success",
      accessToken
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})


// get user info
export const getUserInfo=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const userId=req.user?._id 

    if(userId){
      getUserById(userId.toString(),res)
    }

  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})

// social auth

interface ISocialAuthBody{
  email:string
  name:string
  avatar:string
}
export const socialAuth=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
try {
   const {email,name,avatar}=req.body as ISocialAuthBody
  const avatarData: IUser["avatar"] = { public_id: "", url: avatar }

   const user=await userModel.findOne({email})

   if(!user){
   const newUser=await userModel.create({email,name,avatar:avatarData})
    sendToken(newUser,200,res)
   }else{
    sendToken(user,200,res)
   }
} catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})

// update user info
interface IUpdateUserInfo{
  name?:string
  email?:string
}

export const updateUserInfo=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {name,email}=req.body as IUpdateUserInfo
    
    const userId=req.user?._id

     if (!userId) {
      return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const user=await userModel.findById(userId.toString())


    if(email && user){
      const isEmail=await userModel.findOne({email})
      if(isEmail){
      return next(new ErrorHandler("Email Already Exists", 400));
      }else{
        user.email=email
      }
    }

    if(name && user){
      user.name=name
    }

    await user?.save()

    await redis.set(userId.toString(),JSON.stringify(user))

    res.status(201).json({
      success:true,
      user
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})

// update user password
interface IUpdatePassword{
  oldPassword:string
  newPassword:string
}


export const updatePassword=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    
    const {oldPassword,newPassword}=req.body as IUpdatePassword

    if(!oldPassword || !newPassword){
      return next(new ErrorHandler("Please enter old and new password",400))
    }

    const userId = req.user?._id
    if (!userId) {
      return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const user=await userModel.findById(userId.toString()).select("+password")

    if(user?.password===undefined){
      return next(new ErrorHandler("Invalid User",400))
    }

    const isPasswordMatch=await user.comparePassword(oldPassword)

    if(!isPasswordMatch){
      return next(new ErrorHandler("Invalid Old Password",400))
    }

    user.password=newPassword

    await user.save()

    await redis.set(userId.toString(),JSON.stringify(user))

    res.status(201).json({
      success:true,
      user
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})

// update user profile(avatar)
interface IUpdateProfilePicture{
  avatar:string
}

export const updateProfilePicture=CatchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    
    const {avatar}=req.body

    const userId=req.user?._id

    if(!userId){
      return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const user=await userModel.findById(userId)

    if(avatar && user){
      // if user already have avatar 
      if(user.avatar?.public_id){
        //  first delete old avatar
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)

        const myCloud=await cloudinary.v2.uploader.upload(avatar,{
          folder:"avatars",
          width:150
        })

        user.avatar={
          public_id:myCloud.public_id,
          url:myCloud.secure_url
        }
      }else{
const myCloud=await cloudinary.v2.uploader.upload(avatar,{
          folder:"avatars",
          width:150
        })
        
        user.avatar={
          public_id:myCloud.public_id,
          url:myCloud.secure_url
      }
    }
    }

    await user?.save()

    await redis.set(userId.toString(),JSON.stringify(user))

    res.status(201).json({
      success:true,
      user
    })
  } catch (error:any) {
      return next(new ErrorHandler(error.message, 400));
  }
})