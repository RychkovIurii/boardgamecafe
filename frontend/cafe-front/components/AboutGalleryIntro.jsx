import React from 'react'
import clsx from "clsx";
import { useState, useEffect } from "react";
import { assets } from '../assets/image_assets/assets';
import { useTranslation } from 'react-i18next';

function AboutGalleryIntro() {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth < 1280);
	const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
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
                                src={assets.property_photo_10}
                            />
                        </div>
                        <div className="w-full lg:w-1/2 p-1 md:p-1">
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
                                src={assets.property_photo_13}
                            />
                        </div>
                    </div>
                </div>
                <div className={clsx('flex flex-col justify-center gap-6 md:w-2/4 text-md text-gray-800')} style={{
                    backgroundImage: isMobile ? "none" : `url(${assets.rotated_scroll})`,
                    backgroundSize: "100% 130%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    color: "black",
                }}>

                    < div className={clsx('justify-center pr-10 pl-10 mt-12 font-fontdiner', isMobile? 'm-5':'')}>
                        <p className='pt-2 mr-4 ml-16 font-fontdiner text-gray-800'>
							{t('aboutIntro.intro1')}
                        </p>
                        <p className='pt-2 mr-4 ml-14 font-fontdiner text-gray-800'>
							{t('aboutIntro.intro2')}
						</p>
                        <p className='pt-2 mr-4 ml-14 font-fontdiner text-gray-800'>
							{t('aboutIntro.intro3')}
                        </p>
                    </div>

                    <div className={clsx('mb-12', isMobile ? "bg-gray-200 pb-10" : "", "font-fontdiner")}>
                        <h2 className={clsx("sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4", isMobile ? "bg-gray-200 pt-10" : "pt-3", "font-fontdiner")}>{t('aboutIntro.openingTitle')}</h2>
                        <ul className="text-md font-semibold text-gray-800 font-fontdiner">
							<li>{t('aboutIntro.monThu')}</li>
							<li>{t('aboutIntro.friday')}</li>
							<li>{t('aboutIntro.saturday')}</li>
							<li>{t('aboutIntro.sunday')}</li>
                        </ul>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default AboutGalleryIntro
