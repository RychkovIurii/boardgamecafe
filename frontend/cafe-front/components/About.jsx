import React from 'react'
import AboutGalleryIntro from './AboutGalleryIntro'
import { useNavigate } from 'react-router-dom'
import { aboutMenu } from '../src/assets/assets';
import Title from './Title';
import { useTranslation } from 'react-i18next';
//import { fonts } from '../components/Style/Fonts';
import { colors } from '../components/Style/Colors';


const About = () => {
    const navigate = useNavigate()
	const { t } = useTranslation();
    return (
        <div>
            <div className='bg-gray-100 pt-10 pb-10 px-4 sm:px-8'>
                <div className='pt-20'>
                    <h1 className='text-3xl md:text-5xl font-black '
                    style={{ color: colors.color.fontYellow }}>
                        {t(`about.title`)}</h1>
                    <p className='pt-5 m-3 sm:pt-10 text-xl md:text-2xl font-semibold font-fontdiner '
                    style={{ color: colors.color.fontSubTitle }}
                        >{t(`about.aboutP`)}</p>
                </div>

                <AboutGalleryIntro />

                <div className='mt-20'>
                    <div className='text-center pt-10 py-8 text-3xl'>
                        <Title text1={t(`about.GalleryIntroTitle1`)} text2={t(`about.GalleryIntroTitle2`)} />
                    </div>
                </div>

                {/* AboutMenu */}
                <div className="flex flex-col sm:flex-row sm:gap-10 w-full mx-auto items-center justify-center text-gray-800 ">
                    {aboutMenu.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => { if (item.link) navigate(item.link); }}
                            className="relative cursor-pointer h-[250px] flex flex-col justify-end text-center bg-cover bg-center hover:scale-105 transition-transform duration-300"
                        >
                            <div className='relative'>
                                <img src={item.img} alt={t(item.title)} />
                                <div className='absolute inset-0 bg-black bg-opacity-70 rounded-3xl flex items-center justify-center text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 '>
                                    <p className='text-base'>{t(item.text)}</p></div>
                            </div>
                            {/* 텍스트 */}
                            <div className=" text-gray-600">
                                <p className="text-2xl font-bold pt-3 bg-slate-100 inline-block">{t(item.title)}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default About
