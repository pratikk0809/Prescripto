import express from 'express'

import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import dotenv from 'dotenv'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'



// app config
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()
dotenv.config()


// middlewares 
app.use(express.json())

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [];

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)

//user api endpoints
app.use('/api/user', userRouter)

// localhost:3000/api/admin/add-doctor





app.get('/', (req, res)=>{
    res.send('API IS WORKING WITH NODEMON')
})

app.listen(port, ()=>{
    console.log('SERVER STARTED AT PORT :',port)
})