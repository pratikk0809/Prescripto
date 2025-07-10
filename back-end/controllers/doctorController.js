import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";



const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to login doctor
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ docId: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid Password" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }

}

//API to get all the appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId; // Get from middleware
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//API to mark completed for doc panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId; // Get from middleware

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: "Appointment Completed" })
        }
        else {

            return res.json({ success: false, message: "Mark Failed" })

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//API to mark  cancel for doc panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId; // Get from middleware

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment Cancelled" })
        }
        else {

            return res.json({ success: false, message: "Cancellation Failed" })

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//Api to get dashboard data for doctor panel
const doctorDash = async (req, res) => {

    try {

        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId })

        let earnings = 0
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += Number(item.amount) // Ensure numeric addition
            }
        })

        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }

}

//API to get doctor profile in doctor panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId;
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to update the profile
const updateDoctorProfile = async (req, res) => {
    try {
        const { fee, available, address } = req.body;
        const docId = req.docId;

        await doctorModel.findByIdAndUpdate(docId, { fee, available, address });

        res.json({ success: true, message: 'Doctor Profile Updated' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    changeAvailablity, doctorList, loginDoctor,
    appointmentsDoctor, appointmentComplete, appointmentCancel,
    doctorDash, updateDoctorProfile, doctorProfile
}