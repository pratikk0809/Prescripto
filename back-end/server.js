import express from 'express'

import cors from 'cors'
import dotenv from 'dotenv'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const allowedOrigins = [
  'https://prescripto-frontend-lime.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

// app config
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()


// middlewares 
app.use(express.json())

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if you use cookies/auth headers
}));

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)

//user api endpoints
app.use('/api/user', userRouter)

// localhost:3000/api/admin/add-doctor





app.get('/', (req, res)=>{
    res.send('API IS WORKING WITH NODEMON ("PRESCRIPTO")')
})

app.listen(port, ()=>{
    console.log('SERVER STARTED AT PORT :',port)
})