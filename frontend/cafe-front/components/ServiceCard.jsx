import React from 'react'
import { useTranslation } from 'react-i18next';
import { serviceMenu } from '../src/assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../components/Style/Colors';

function ServiceCard() {
    const navigate = useNavigate()

    const { t } = useTranslation();
    return (
        <div className="py-20 max-w-4xl mx-auto">
            <h2 className="text-outline text-3xl md:text-5xl lg:text-6xl font-medium  mb-7" style={{ color: colors.color.fontYellow }}>
                {t(`service.Title`)}
            </h2>
            <p className='w-5/6 m-auto sm:text-sm md:text-base ' style={{ color: colors.color.fontSubTitle }}>
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
            className=" w-[180px] p-3 m-2 text-[antiquewhite] rounded-lg mt-[50px]" style={{ backgroundColor: colors.color.buttonMainColor }}>{t(`service.button`)}</button>


        </div>
    )
}

export default ServiceCard
