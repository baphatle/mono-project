import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User.js"

dotenv.config()
const APP_SECRET = process.env.APP_SECRET

export const verifyToken = async (req, res, next) => {
    try {
        // check login status
        const token = req.headers.authorization?.split(" ")[1]
        
        //check token
        if(!token){
            return res.status(403).json({
                message: "you have to login"
            })
        }
   
        const {userId} = jwt.verify(token, process.env.APP_SECRET)
        req.user = {userId}
 
        next()
    } catch (error) {
        return res.json({
            name: error.name,
            message: error.message
        })
    }
}