import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {

    try {

      const updateData = {
        address: profileData.address,
        fee: profileData.fee,
        available: profileData.available
      }

      console.log('Sending updateData:', updateData)

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  return profileData && (
    <div>
      <div className='flex flex-col gap-4 m-5'>

        <div>
          <img className='bg-primary/80 w-60 sm:max-w-46 rounded' src={profileData.image} alt="" />
        </div>

        <div className='flex-1 border border-stone-100 rounded p-8 py-7 bg-white'>
          {/* Doctor Info : name, degree, experience */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className='flex items-center mt-1 gap-2 text-gray-500'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='py-0.5 px-2 border rounded-full text-xs'>{profileData.experience}</button>
          </div>

          {/* Doctor About */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About :</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment Fee :
            <span className='text-gray-800'>
              {currency}
              {isEdit ? <input onChange={(e) => setProfileData(prev => ({ ...prev, fee: e.target.value }))} value={profileData.fee} type="number" /> : profileData.fee}</span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit
                ?
                <input onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} type="text" />
                : profileData.address.line1}
              <br />
              {isEdit
                ?
                <input onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} type="text" />
                : profileData.address.line2}
            </p>
          </div>

          <div className='flex gap-2 pt-2'>
            <input
              onChange={e => setProfileData(prev => ({ ...prev, available: e.target.checked }))}
              checked={profileData.available}
              type="checkbox"
            />
            <label htmlFor="">Available</label>
          </div>

          {
            isEdit
              ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
              : <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>

          }
        </div>
      </div>

    </div>
  )
}

export default DoctorProfile
