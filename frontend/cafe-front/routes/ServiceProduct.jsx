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
                <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

                    {/* ------- Service Images --------- */}
                    <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                        <div className='flex sm:flex-col overflow-x-auto sm:over-y-scroll 
                justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                            {
                                serviceData.img.map((item, index) => (
                                    <img onClick={() => (setImage(item))}
                                        src={item}
                                        key={index}
                                        alt="service_image"
                                        className='w-[22%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover aspect-[4/3] max-h-[180px]'
                                    />
                                ))
                            }
                        </div>
                        <div className='w-full sm:w-[88%]'>
                            <img className='w-full' src={image} alt="service_image" />
                        </div>
                    </div>

                    {/* --------- Service Info --------  */}
                    <div className='flex-1 justify-center text-center'>
    <h1 className='font-medium text-2xl mt-2'>{serviceData.title}</h1>
    <div className='mt-7 text-gray-700 md:w-4/5 mx-auto'>{serviceData.detail}</div>
    <button 
        onClick={() => { navigate(`/contact`); scroll(0, 0) }} 
        className='bg-amber-200 text-gray-600 text-1xl px-5 py-3 rounded-full mt-8'
    >
        Contact Us
    </button>
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
