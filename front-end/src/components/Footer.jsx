import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ---------left-------- */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum, molestias aperiam. Beatae doloremque ipsum consectetur nemo dolor corrupti incidunt, error, repellendus quo totam, dignissimos ea possimus adipisci ullam hic reiciendis!</p>
                </div>
                {/* ---------center-------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact Us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                {/* ---------right-------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>Get in Touch</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+1-234-56789</li>
                        <li>abcd@gmail.com</li>
                    </ul>
                </div>
            </div>
                {/* -----------Copyright text------------ */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto - All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer
