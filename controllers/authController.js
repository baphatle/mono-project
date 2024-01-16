import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from "dotenv"

dotenv.config()
const APP_SECRET = process.env.APP_SECRET

export const register = async (req, res) => {
   try {
        const userExists = await User.findOne({emaul: req.body.email})
            if(userExists){
                return res.status(400).json({
                    message: "Used email"
            })
        }

        const user = await User.create(req.body)
        const token = jwt.sign({userId: user._id}, APP_SECRET)
        res.status(200).json({
            message: "Success",
            data: {token, userName: user.name}
        })
   } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
   }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(400).json({
                message: "Email or password is not correct"
            })
        }
        if(bcrypt.compareSync(req.body.password, user.password)){
            const token = jwt.sign({userId: user._id}, APP_SECRET)
            res.status(200).json({
                status: "success",
                data: {
                    userName: user.name,
                    token
                }
            })
        }else{
            return res.status(400).json({
                message: "Wrong password"
            })
        }
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
}

export const getCurrentUser = async (req, res, next) => {
    try {
        const data = { user: null }
        if(req.user){
            const user = await User.findOne({_id: req.user.userId})
            data.user ={userName: user.name}
        }
        res.status(200).json({
            status: "success",
            data: data
        })
    } catch (error) {
        res.json(error)
    }
}