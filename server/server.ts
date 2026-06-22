import {app} from "./app"
import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import { connnectDB } from "./utilis/db"
import http from "http"
import { initSocketServer } from "./socketServer"
dotenv.config()
const server=http.createServer(app)

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
initSocketServer(server)

server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    connnectDB()
})
