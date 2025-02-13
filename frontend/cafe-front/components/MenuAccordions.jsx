import React from 'react';
import { menuData } from '../assets/image_assets/assets';

const MenuAccordions = ({ activeId, setActiveId }) => {
    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="w-[900px] h-max shadow-lg border-4 border-yellow-600 rounded-xl overflow-hidden bg-white">
                {/* Header Section */}
                {/* <div className="flex flex-wrap justify-center px-6 py-5 gap-5 bg-yellow-900">
                    {menuData.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveId(index)} // Update activeId
                            className={`px-4 py-2 rounded-lg font-medium text-base whitespace-nowrap ${activeId === index
                                ? 'bg-indigo-500 text-white'
                                : 'bg-amber-400 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {item.menuType}
                        </button>
                    ))}
                </div> */}

                {/* Details Section */}
                {menuData.map((item, index) => (
                    activeId === index && (
                        <div key={index} className="px-6 py-5 bg-yellow-900  border-yellow-600">
                            {/* Description */}
                            <p className="mb-6  text-white leading-relaxed">{item.details.description}</p>

                            {/* Pricing or Other Items */}
                            {item.details.pricing && (
                                <ul className="space-y-4">
                                    {item.details.pricing.map((pricingItem, pricingIndex) => (
                                        <li
                                            key={pricingIndex}
                                            className="flex items-center justify-between py-2 px-4 rounded-md shadow-sm bg-white hover:shadow-md transition-all"
                                        >
                                            {/* Item and Options in a Column */}
                                            <div className="flex flex-col text-left">
                                                <p className="text-gray-800 font-medium">
                                                    {pricingItem.item}
                                                </p>
                                                {pricingItem.options && (
                                                    <p className="text-gray-500 mt-1">
                                                        {pricingItem.options.join(', ')}
                                                    </p>
                                                )}
                                            </div>

                                            <span className="flex-1 border-dashed border-t mx-2"></span>
                                            <p className="text-indigo-600  font-bold">
                                                {pricingItem.price}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default MenuAccordions;
