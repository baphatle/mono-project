import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const APP_SECRET = process.env.APP_SECRET


export const checkCurrentUser = (req, res, next) => {
    const Authorization = req.header("authorization")
    if(!Authorization){
        req.user = null
        next()
    }else {
        const token = Authorization.replace("Bearer ", "")

        try {
            const {userId} = jwt.verify(token, APP_SECRET)
            req.user = {userId}
            next()
        } catch (error) {
            req.user =null,
            next()
        }
    }
}
