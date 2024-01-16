import express from 'express'
import { connect } from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/index.js'

const app = express()

dotenv.config()
app.use(cors())
app.use(express.json()) 

const PORT = process.env.PORT 
connect(process.env.MONGO_URL);

app.use('/api/v1', router)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})