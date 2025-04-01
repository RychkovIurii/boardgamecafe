import React from 'react';
import { steps } from '../src/assets/assets';
import { assets } from '../src/assets/assets';
import { useTranslation } from 'react-i18next';



const HowItWorks = () => {
	const { t } = useTranslation();
    return (
        <div className="py-20 max-w-4xl mx-auto dark:bg-gray-800">
            <h2 className="text-4xl md:text-5xl font-black text-yellow-500 mb-10">
            {t(`HowItWorks.title`)}
            </h2>

            {steps.map((item, index) => (
                <div className="flex" key={index}>
                    {/* Step Indicator */}
                    <div className="mr-7 flex flex-col items-center">
                        <div
                            className={`flex items-center justify-center w-10`}
                        >
                            <img src={item.image} alt="" className='w-10 h-10 object-contain' />

                        </div>
                        {/* Line connecting the steps */}
                        <div className="h-full w-0.5 bg-gray-300 dark:bg-slate-500"></div>

                    </div>

                    {/* Step Content */}
                    <div className="pt-1 pb-10 text-left">
                        <p className="mb-2 text-xl font-bold text-gray-900 dark:text-slate-300">{t(item.label)}</p>
                        <p className="text-gray-600 dark:text-slate-400">{t(item.details.process.step1)}</p>
                        {item.details.process.step2 && (
                            <p className="mt-2 text-gray-600 dark:text-slate-400">{t(item.details.process.step2)}</p>
                        )}
                        {item.details.process.step3 && (
                            <p className="mt-2 text-gray-600 dark:text-slate-400">{t(item.details.process.step3)}</p>
                        )}

                        {item.details.marks && (
                            <div className="mt-2">
                                <p className="mt-2 text-gray-600 dark:text-slate-400">{t(item.details.marks.mark1)}</p>
                                <p className="mt-2 text-gray-600 dark:text-slate-400">{t(item.details.marks.mark2)}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Final Step */}
            <div className="flex">
                <div className="mr-4 flex flex-col items-center">
                    <div
                        className="flex w-10 items-center justify-center"
                    >
                        <img src={assets.face_grin_stars_icon} alt="" className='w-10 h-10 object-contain' />
                    </div>
                </div>
                <div className="pt-1">
                    <p className="mb-2 text-xl font-bold text-gray-900 dark:text-slate-300">Your Adventure Awaits!</p>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
