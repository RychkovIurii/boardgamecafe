import React from 'react';
import { menuData } from '../assets/menu_icon_assets/assets';

const MenuAccordions = ({ activeId, setActiveId }) => {
    return (
        <div className="w-full min-h-screen py-2 flex justify-center">
            <div className="w-[800px] h-max shadow-lg border border-gray-200 rounded-xl overflow-hidden bg-white">
                {/* Header Section */}
                <div className="flex flex-wrap justify-center px-6 py-5 gap-5 bg-gray-100">
                    {menuData.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveId(index)} // Update activeId
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${activeId === index
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {item.menuType}
                        </button>
                    ))}
                </div>

                {/* Details Section */}
                {menuData.map((item, index) => (
                    activeId === index && (
                        <div key={index} className="px-6 py-5 bg-indigo-50 border-t border-gray-300">
                            {/* Description */}
                            <p className="mb-6 text-sm text-gray-700 leading-relaxed">{item.details.description}</p>

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
                                                <p className="text-gray-800 text-sm font-medium">
                                                    {pricingItem.item}
                                                </p>
                                                {pricingItem.options && (
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {pricingItem.options.join(', ')}
                                                    </p>
                                                )}
                                            </div>

                                            <span className="flex-1 border-dashed border-t mx-2"></span>
                                            <p className="text-indigo-600 text-sm font-bold">
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
