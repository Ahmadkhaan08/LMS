import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const db_url:string=process.env.DB_URL || ""
export const connnectDB=async()=>{
    try {
        await mongoose.connect(db_url).then((data:any)=>{
            console.log(`Database is connected successfully with ${data.connection.host}`)
        })
    } catch (error:any) {
        console.log(error.message)
        setTimeout(connnectDB,5000)
    }
}