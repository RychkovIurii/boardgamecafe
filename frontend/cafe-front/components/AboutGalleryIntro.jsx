import React from 'react'
import clsx from "clsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { assets } from '../src/assets/assets';
import { useTranslation } from 'react-i18next';

function AboutGalleryIntro() {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth < 1280);
	const [workingHours, setWorkingHours] = useState([]);
	const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

	useEffect(() => {
		const fetchWorkingHours = async () => {
			const ONE_DAY = 24 * 60 * 60 * 1000;
			const cache = localStorage.getItem('workingHours');
			const timestamp = localStorage.getItem('workingHours_timestamp');
			const now = Date.now();
	
			if (cache && timestamp && now - parseInt(timestamp) < ONE_DAY) {
				try {
					const parsed = JSON.parse(cache);
					if (Array.isArray(parsed)) {
						setWorkingHours(parsed);
						return;
					}
				} catch (e) {
					console.warn("Invalid cache, refetching...");
				}
			}
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/hours`);
				const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
				const sorted = res.data.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
				setWorkingHours(sorted);
				localStorage.setItem('workingHours', JSON.stringify(sorted));
				localStorage.setItem('workingHours_timestamp', now.toString());
			} catch (err) {
				console.error("Failed to fetch working hours", err);
			}
		};
	
		fetchWorkingHours();
	}, []);

	const groupWorkingHours = (hours) => {
		const result = [];
		let group = [];
	
		const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		const sorted = [...hours].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
	
		for (let i = 0; i < sorted.length; i++) {
			const current = sorted[i];
			const prev = group[group.length - 1];
	
			const timeStr = `${current.openTime || ''}-${current.closeTime || ''}`;
			const prevStr = prev ? `${prev.openTime || ''}-${prev.closeTime || ''}` : null;
	
			if (!prev || timeStr === prevStr) {
				group.push(current);
			} else {
				result.push(group);
				group = [current];
			}
		}
		if (group.length > 0) result.push(group);
		return result;
	};
	
	const formatDayRange = (group) => {
		const dayName = (d) => t(`footer.${d}`);
		if (group.length === 1) return dayName(group[0].day);
		return `${dayName(group[0].day)} - ${dayName(group[group.length - 1].day)}`;
	};

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
					<h2 className={clsx("sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4", isMobile ? "bg-gray-200 pt-10" : "pt-3", "font-fontdiner")}>
						{t('aboutIntro.openingTitle')}
					</h2>
					<ul className="text-md font-semibold text-gray-800 font-fontdiner">
						{workingHours.length > 0 ? groupWorkingHours(workingHours).map((group, idx) => (
							<li key={idx}>
								{formatDayRange(group)}{' '}
								{group[0].openTime && group[0].closeTime
									? `${group[0].openTime} - ${group[0].closeTime}`
									: t('footer.Closed')}
							</li>
						)) : <li> </li>}
					</ul>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default AboutGalleryIntro
