import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'



// API for adding doctor

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, degree, speciality, experience, about, fee, address } = req.body
        // Parse the address if it's a string
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        const imageFile = req.file

        console.log('BODY:', req.body);
        console.log('FILE:', req.file);

        //checking for all data to add doctor
        if (!name || !email || !password || !degree || !experience || !about || !address || !fee) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter a valid Email' })
        }

        //validating password
        if (password.length < 8) {
            return res.json({ success: false, message: 'Enter a Strong Password' })
        }

        //hashing doctor's password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
        const imageUrl = imageUpload.secure_url


        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee,
            address: parsedAddress,
            date: Date.now()
        }


        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added Successfully" })



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API for admin Login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            try {
                const token = jwt.sign(
                    {
                        email: process.env.ADMIN_EMAIL,
                        password: process.env.ADMIN_PASSWORD // Not recommended for production, but OK for a simple admin system
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );
                res.json({ success: true, token })
            } catch (err) {
                console.log('JWT error:', err)
                res.status(500).json({ success: false, message: 'JWT error' })
            }
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to get all doctors list for Admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true, doctors})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

//API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    
    try {

        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})


        
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }


}

//cancel appointments from admin side
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

       

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //releasing the doc slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Cancelled" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//API to get dashboard data for admin panel
const adminDash = async (req, res)=>{
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success:true, dashData})

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { addDoctor, loginAdmin, allDoctors,appointmentCancel, appointmentsAdmin, adminDash }