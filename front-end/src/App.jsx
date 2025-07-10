import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact' 
import About from './pages/About'
import Appointment from './pages/Appointment'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';


function App() {

  return (
    <>
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointments/:docId' element={<Appointment />} />

        {/* Fallback route to Home if no match is found */}
        
      </Routes>
      <Footer/>
</div>
    
    </>
  )
}

export default App


/* The code snippet `<Routes>` and the nested `<Route>` components are part of React Router, a
      popular routing library for React applications. */