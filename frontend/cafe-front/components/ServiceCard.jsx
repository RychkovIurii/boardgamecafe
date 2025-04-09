import React from 'react'
import { useTranslation } from 'react-i18next';
import { serviceMenu } from '../src/assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';

function ServiceCard() {
    const navigate = useNavigate()

    const { t } = useTranslation();
    return (
        <div className="md:py-20 py-10 max-w-4xl mx-auto">
            <h2 className="md:pt-5 text-3xl md:text-5xl lg:text-6xl font-medium text-yellow-500 mb-7">
                {t(`service.Title`)}
            </h2>
            <p className='w-5/6 m-auto sm:text-sm md:text-base text-gray-700'>
                {t(`service.serviceP`)}
            </p>

            {/* ServiceMenu */}
            <div className="flex flex-wrap gap-3.5 pt-8 m-auto px-5 sm:px-0">
                {serviceMenu.map((item, index) => (
                    <div key={index} onClick={() => { navigate(`/service-product/${item._id}`); scrollTo(0, 0) }} className='w-full md:w-[49%] border border-yellow-800 rounded-xl 
                overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                        <img
                            className={`w-full h-[250px] ${item.title === 'home.serviceMenu.COMMUNITY' ? 'bg-black object-contain' : 'object-cover'}`}
                            src={item.img[0]}
                            alt="service_menu"
                        />
                        <div className='p-3'>
                            <p className='text-gray-900 text-lg font-medium'>{t(item.title)}</p>
                        </div>

                    </div>

                ))}
            </div>
            <button onClick={() => {
                navigate(`/contact`); scroll(0, 0)
            }}
                className='bg-amber-200 text-gray-600 text-2xl px-12 py-3 rounded-full mt-10'>{t(`service.button`)}</button>


        </div>
    )
}

export default ServiceCard
