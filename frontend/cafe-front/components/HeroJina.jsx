import React from 'react'
import { assets } from '../assets/image_assets/assets'



const HeroJina = () => {
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
            {/* ----------left side---------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-8 m-auto md:py-[6vw] md:mb-[-30px] pl-7'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>Welcome to Café Boardgame</p>
                <div className='flex flex-col md:flex-row items-center gap-10 text-white text-sm font-light' >

                    <p className='hidden sm:block'>Have a fun! <br />  schedule your appointment hassle-free.</p>
                    <img className='w-60' src={assets.logo} alt="" />

                </div >
                <a href='#table-booking' className='flex items-center gap-4 bg-white px-8 py-3 rounded-full text-red-700 font-bold text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                    Table Reservation <img className='w-3' src={assets.arrow_icon} />
                </a>
            </div>
            {/* ----------right side---------- */}
            <div className="md:w-1/2 flex items-center justify-end py-10 pr-10">
                <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-70">
                    <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4">Opening Hours</h2>
                    <ul className="text-md leading-loose">
                        <li>Monday - Thursday 16:00 - 24:00 </li>
                        <li>Friday 16:00 - 02:00</li>
                        <li>Saturday 14:00 - 02:00 </li>
                        <li>Sunday Closed</li>
                    </ul>
                </div>
            </div>
        </div >


    )
}

export default HeroJina