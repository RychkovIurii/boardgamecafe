import React from 'react'
import AboutGalleryIntro from './AboutGalleryIntro'
import { useNavigate } from 'react-router-dom'

const About = () => {

    const navigate = useNavigate()

    return (
        <div>
            <div className='bg-gray-100 pt-10 pb-10'>
                <div className='pt-20'>
                    <h1 className='text-3xl md:text-5xl font-black text-yellow-500 '> ABOUT CAFÉ BOARDGAME</h1>
                    <p className='pt-5 sm:pt-10 text-xl md:text-2xl font-semibold text-gray-700'> Welcome to Café Boardgame,
                        <span className='hidden sm:inline-block'>a one-of-a-kind space </span> located in the heart of Helsinki!</p>
                </div>



                <AboutGalleryIntro />


                <div className='text-2xl md:text-3xl mt-20 my-4'>
                    <p className='pt-10 text-3xl font-semibold text-gray-700' >
                        Expore more about Café Boardgame
                    </p>
                </div>


                <div className='flex flex-col md:flex-row mb-20 w-full sm:w-3/5 mx-auto gap-1 pt-10'>
                    <div onClick={() => { navigate('/faq'); scrollTo(0, 0) }} className='bg-amber-400 px-6 py-6  flex sm:w-1/3 flex-col gap-4 text-[-1px] border-4 border-yellow-600  hover:bg-primary hover:text-white transition-all duration-300 text-gray-800 cursor-pointer'>
                        <p className='text-1xl md:text-2xl font-bold  text-gray-800'>How it works:</p>
                        <p>Easily find our café, understand the ordering process, and get all the key details.</p>
                    </div>
                    <div onClick={() => { navigate('/pricing'); scrollTo(0, 0) }} className='bg-amber-400  px-6 py-6  flex sm:w-1/3 flex-col gap-4 text-[-15px]  border-4 border-yellow-600 hover:bg-primary hover:text-white transition-all duration-300 text-gray-800 cursor-pointer'>
                        <p className='text-1xl md:text-2xl font-bold  text-gray-800'>Menu:</p>
                        <p>Explore our gaming fees and enjoy delicious food & drinks! </p></div>
                    <div className='bg-amber-400 px-6 py-6  flex flex-col sm:w-1/3 gap-4 text-[-15px] border-4 border-yellow-600  hover:bg-primary hover:text-white transition-all duration-300 text-gray-800 cursor-pointer'>
                        <p className='text-1xl md:text-2xl font-bold  text-gray-800'>Service:</p>
                        <p> Let our friendly staff assist you for the best board game experience.</p></div>
                </div>

            </div>
        </div>
    )
}

export default About
