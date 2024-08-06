import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User.js"
import Post from "../models/Post.js"

dotenv.config()
const APP_SECRET = process.env.APP_SECRET

export const verifyToken = async (req, res, next) => {
    try {
        // check login status
        const token = req.headers.authorization?.split(" ")[1]

        //check token
        if (!token) {
            return res.status(403).json({
                message: "you have to login"
            })
        }

        const { userId } = jwt.verify(token, process.env.APP_SECRET)
        // req.user = {userId}
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // Attach user information to req.user
        req.user = { userId: user.id, admin: user.admin }
        next()
    } catch (error) {
        return res.json({
            name: error.name,
            message: error.message
        })
    }
}

export const verifyRole = async (req, res, next) => {
    try {
        // Verify token to get user info
        await verifyToken(req, res, async () => {
            // Get post by id
            const post = await Post.findById(req.params.postId).populate('author')

            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }

            // Check if user is admin or the author of the post
            if (req.user.userId === post.author.id || req.user.admin) {
                return next()
            } else {
                return res.status(403).json({
                    message: "You are not allowed to delete this post"
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        })
    }
}