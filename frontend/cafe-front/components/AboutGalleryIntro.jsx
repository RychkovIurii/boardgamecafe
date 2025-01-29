import React from 'react'
import clsx from "clsx";
import { useState, useEffect } from "react";
import { assets } from '../assets/image_assets/assets';
function AboutGalleryIntro() {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [isTablet, setIsTablet] = useState(window.innerWidth < 1280);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="max-w-[1200px] mx-auto">


            <div className='my-10 flex flex-col md:flex-row gap-3 m-4'>
                {/* 이미지 갤러리 컨테이너 */}
                {/* <div className="flex flex-wrap w-full md:max-w-800px] lg:flex-row"> */}
                <div className={clsx("flex lg:flex-row md:flex-wrap ", isMobile ? "w-full" : isTablet ? "w-1/2" : "w-2/3")}>
                    {/* 왼쪽 이미지 그룹 */}
                    <div className="flex w-full sm:w-1/2 flex-wrap lg:w-1/2">
                        <div className="w-full lg:w-1/2 p-1">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_5}
                            />
                        </div>
                        <div className="w-full lg:w-1/2 p-1">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_4}
                            />
                        </div>
                        <div className="w-full lg:w-1/2 p-1 md:p-1">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_10}
                            />
                        </div>
                        <div className="w-full lg:w-1/2 p-1 md:p-1">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_7}
                            />
                        </div>
                        <div className="w-full p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center max-h-none lg:max-h-[1000px]"
                                src={assets.property_photo_6}
                            />
                        </div>
                    </div>
                    <div className="flex w-full sm:w-1/2 flex-wrap">
                        <div className="w-full p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_9}
                            />
                        </div>
                        <div className="w-1/2 p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_11}
                            />
                        </div>
                        <div className="w-1/2 p-1 md:p-2">
                            <img
                                alt="gallery"
                                className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                                src={assets.property_photo_2}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-md text-gray-800' style={{
                    backgroundImage: isMobile ? "none" : `url(${assets.rotated_scroll})`,
                    backgroundSize: "100% 130%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    color: "black",
                }}>

                    <div className='justify-center pr-10 pl-10 mt-12'>
                        <p className='pt-2'>
                            Founded in 2002, with over 300 games Café Boardgame has been a welcoming spot for board game lovers for over 20 years.
                        </p>
                        <p className='pt-3'>Our friendly staff are always here to help you pick a game, explain the rules, or guide you through gameplay. </p>
                        <p className='pt-3'>
                            At Café Boardgame, you can enjoy great food, drinks, and games in a fun and relaxing space with friends, family, or colleagues.
                        </p>
                    </div>

                    <div className='mb-12'>
                        <h2 className="sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Opening Hours</h2>
                        <ul className="text-md font-semibold text-gray-800">
                            <li>Monday - Thursday 16:00 - 24:00 </li>
                            <li>Friday 16:00 - 02:00</li>
                            <li>Saturday 14:00 - 02:00 </li>
                            <li>Sunday Closed</li>
                        </ul>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default AboutGalleryIntro
