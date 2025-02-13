import React from 'react'
import AboutGalleryIntro from './AboutGalleryIntro'
import { useNavigate } from 'react-router-dom'

const About = () => {

    const navigate = useNavigate()

    const AboutData = [
        { title: "How it works:", text: "Easily find our café, understand the ordering process, and get all the key details.", link: "/faq" },
        { title: "Menu:", text: "Explore our gaming fees and enjoy delicious food & drinks!", link: "/pricing" },
        { title: "Service:", text: "Let our friendly staff assist you for the best board game experience." }]

    return (
        <div>
            <div className='bg-gray-100 pt-10 pb-10'>
                <div className='pt-20'>
                    <h1 className='text-3xl md:text-5xl font-black text-yellow-500 '> ABOUT CAFÉ BOARDGAME</h1>
                    <p className='pt-5 m-3 sm:pt-10 text-xl md:text-2xl font-semibold text-gray-700'> Welcome to Café Boardgame, <span className='hidden sm:inline-block'>a one-of-a-kind space </span> located in the heart of Helsinki!</p>
                </div>



                <AboutGalleryIntro />

                <div className='text-2xl md:text-3xl mt-20 my-4'>
                    <p className='pt-10 text-3xl font-semibold text-gray-700' >
                        Expore more about Café Boardgame
                    </p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full sm:w-2/3 mx-auto pt-10 mb-20">
                    {AboutData.map((item, index) => (
        <div
            key={index}
            onClick={() => { if (item.link) navigate(item.link); scrollTo(0, 0); }}
            className="bg-amber-400 border-4 border-yellow-600 py-10 sm:py-5 hover:bg-primary hover:text-white transition-all duration-300 text-gray-800 cursor-pointer min-h-[200px] h-full flex flex-col justify-start text-center"
        >
            <div className="flex flex-col justify-center h-full gap-3">
                <p className="text-2xl font-bold text-gray-800">{item.title}</p>
                <p>{item.text}</p>
            </div>
        </div>
    ))}
</div>

            </div>
        </div>
    )
}

export default About
