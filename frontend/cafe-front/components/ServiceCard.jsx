import React from 'react'
import { useTranslation } from 'react-i18next';
import { serviceMenu } from '../assets/image_assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';

function ServiceCard() {
    const navigate = useNavigate()
    const location = useLocation();
	const { t } = useTranslation();
    return (
        <div className="py-20 max-w-4xl mx-auto dark:bg-gray-800">
            <h2 className="text-4xl md:text-5xl font-black text-yellow-500 mb-10">
                Find our service
            </h2>
            <p className='w-5/6 m-auto sm:text-sm md:text-base text-gray-700'>
                "Our goal is to make Helsinki the heart of gaming culture and to provide an accessible meeting place for everyone interested in games. <br />Cafe Boardgame is a four-story gaming culture hub, combining a restaurant, café, bar, events, training, and meeting services."
            </p>

            {/* ServiceMenu */}
            <div className='w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {serviceMenu.map((item, index) => (
                    <div key={index} onClick={() => { navigate(`/service-product/${item._id}`); scrollTo(0, 0) }} className='border border-yellow-800 rounded-xl 
                overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                        <img className='w-full h-[250px] object-cover bg-blue-50' src={item.img[0]} alt="service_menu" />
                        <div className='p-3'>
                            <p className='text-gray-900 text-lg font-medium'>{t(item.title)}</p>
                        </div>

                    </div>

                ))}
            </div>

            { }
            <button onClick={() => {
                navigate('/contact'); scroll(0, 0)
            }} className='bg-amber-200 text-gray-600 text-2xl px-12 py-3 rounded-full mt-10'>contact us</button >


        </div>
    )
}

export default ServiceCard
