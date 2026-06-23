import express,{Request,Response,NextFunction} from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"
import { ErrorMiddleware } from "./middleware/error"
import userRouter from "./routes/user.route"
import courseRouter from "./routes/course.route"
import orderRouter from "./routes/order.route"
import notificationRouter from "./routes/notification.route"
import analyticsRouter from "./routes/analytics.route"
import layoutRouter from "./routes/layout.route"
import { rateLimit } from 'express-rate-limit'
dotenv.config()
export const app=express()


// body parser
app.use(express.json({limit:"50mb"}))
// cookie parser
app.use(cookieParser())
// cors
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))

// api rate limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})


// routes
app.use("/api/v1",userRouter,courseRouter,orderRouter,notificationRouter,analyticsRouter,layoutRouter)




// testing api
app.get("/test",(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"Api is working"
    })
})
// unknown routes
app.use((req:Request,res:Response,next:NextFunction)=>{
    const err=new Error (`Route ${req.originalUrl} not found`) as any
    err.statusCode=404
    next(err)
})




// middleware calls
app.use(limiter)
app.use(ErrorMiddleware)