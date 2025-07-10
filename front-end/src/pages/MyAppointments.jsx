import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [qrPopup, setQrPopup] = useState({ show: false, appointmentId: null }) // ✅ NEW: state for QR modal

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const navigate = useNavigate()

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1] - 1)] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const simulateQrPayment = async (appointmentId) => { // ✅ NEW: simulate QR payment function
    setQrPopup({ show: true, appointmentId })
    setTimeout(async () => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/simulate-payment',
          { appointmentId },
          { headers: { token } }
        )
        if (data.success) {
          toast.success('Payment Successful')
          setQrPopup({ show: false, appointmentId: null })
          getUserAppointments()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }, 5000)
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-900 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address?.line1}</p>
              <p className='text-xs'>{item.docData.address?.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex items-center flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded  text-stone-500 font-semibold'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => simulateQrPayment(item._id)} // ✅ NEW: QR payment button
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                  Pay with QR
                </button>
              )}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded border-red-500 text-red-500 font-semibold'>Appointment Cancelled</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 text-sm text-green-500 rounded font-medium'>Completed</button>}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ QR Code Popup Modal */}
      {qrPopup.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded shadow-xl text-center w-80'>
            <p className='font-semibold text-lg mb-2'>Scan QR to Pay</p>
            <img src='https://api.qrserver.com/v1/create-qr-code/?data=upi://pay&size=200x200' alt='QR Code' className='mx-auto' />
            <p className='text-sm text-gray-500 mt-3'>Simulating payment... Please wait</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments