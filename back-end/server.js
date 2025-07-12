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
// middlewares 
app.use(express.json());
app.use(cors({
  origin: [
    'https://prescripto-admin-ru62.onrender.com',
    'https://prescripto-front-end-5a0i.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

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