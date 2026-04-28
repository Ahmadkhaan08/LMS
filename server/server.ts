import {app} from "./app"
import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import { connnectDB } from "./utilis/db"
dotenv.config()

// cloudinary configuration
const cloudName = process.env.CLOUD_NAME
const cloudApiKey = process.env.CLOUD_API_KEY
const cloudSecretKey = process.env.CLOUD_SECRET_KEY

if (!cloudName || !cloudApiKey || !cloudSecretKey) {
    throw new Error("Missing Cloudinary environment variables")
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudSecretKey,
})


// SERVER RUNNING
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    connnectDB()
})
