import { createContext, useState } from "react";
import axios from 'axios'
import { useEffect } from "react";
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://prescripto-backend-074r.onrender.com"

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)


    const getDoctorsData = async (params) => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async (req, res) => {
        try {

            const { data } = await axios.get(
                backendUrl + '/api/user/get-profile',
                { headers: { token } }
            )
            setUserData(data.user);

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }


    const value = {
        doctors,getDoctorsData,
        currencySymbol,
        getDoctorsData,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])



    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider