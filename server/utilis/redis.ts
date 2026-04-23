import {Redis} from "ioredis"
import dotenv from "dotenv"
dotenv.config()

const redis_url=process.env.REDIS_URL
const redisClient=()=>{
    if(redis_url){
        console.log("Redis connected successfully")
        return redis_url
    }
    throw new Error("Redis connection failed")

}

export const redis=new Redis(redisClient())