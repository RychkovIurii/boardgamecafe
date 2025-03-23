import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serviceMenu } from '../assets/image_assets/assets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ServiceProduct = () => {
    const { serviceId } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const [image, setImage] = useState('');
    const navigate = useNavigate()

    // Fetch service data when component loads
    const fetchServiceData = async () => {
        const foundService = serviceMenu.find((item) => item._id === serviceId);
        if (foundService) {
            setServiceData(foundService);
            setImage(foundService.img[0]);
        }
    };

    useEffect(() => {
        fetchServiceData();
    }, [serviceId]);

    return serviceData ? (
        <div>
            <Navbar />

            <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
                {/* ------- Service Data ---------- */}
                <div className='flex gap-12 sm:gap-5 flex-col sm:flex-row'>

                    {/* ------- Service Images --------- */}
                    <div className='flex-1 flex flex-col-reverse gap-1 sm:flex-row'>
                        <div className='flex sm:flex-col overflow-x-auto sm:over-y-scroll 
                justify-between sm:justify-normal sm:w-[18.7%] w-full pl-3'>
                            {
                                serviceData.img.map((item, index) => (
                                    <img onClick={() => (setImage(item))}
                                        src={item}
                                        key={index}
                                        alt="service_image"
                                        className='w-[22%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover aspect-[6/3] max-h-[180px]'
                                    />
                                ))
                            }
                        </div>
                        <div className='w-full md:w-[80%] sm:w-[90%]'>
                            <img className='w-[80%] m-auto' src={image} alt="service_image" />
                        </div>
                    </div>

                    {/* --------- Service Info --------  */}
                    <div className='flex-1 justify-start text-center'>
                        <h1 className='font-medium text-2xl mt-2'>{serviceData.title}</h1>
                        <div className='mt-7 text-gray-700 md:w-4/5 mx-auto'>{serviceData.detail}</div>

                        {/* Conditional Button */}
                        {serviceData._id === 's-community' ? (
                            <button
                                onClick={() => window.open("https://discord.com/invite/wwQGdKVrma", "_blank")}
                                className='bg-blue-500 text-white text-2xl px-12 py-3 rounded-full mt-10'
                            >
                                Join Discord
                            </button>
                        ) : (
                            <button onClick={() => { navigate(`/contact`); scrollTo(0, 0) }} className='bg-amber-200 text-gray-700 text-2xl px-12 py-3 rounded-full mt-10'>
                                Contact Us
                            </button>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </div >
    ) : (
        <div className='opacity-0'></div>
    );
}

export default ServiceProduct;
