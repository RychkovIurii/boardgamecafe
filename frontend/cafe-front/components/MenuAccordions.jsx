import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';

const MenuAccordions = ({ activeId, setActiveId }) => {
    const [menuData, setMenuData] = useState([]);
    const sectionRef = useRef(null); // Add ref

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await API.get('/prices');
                setMenuData(response.data);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };

        fetchMenuData();
    }, []);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile && activeId !== null && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [activeId]); // Scroll when activeId changes

    return (
        <div ref={sectionRef} className="w-full flex flex-col justify-center px-8">
            <div className="flex flex-col w-[900px] shadow-lg border-4 border-yellow-500 rounded-xl overflow-hidden bg-white mx-auto font-roboto mb-5">

                {/* Details Section */}
                {menuData.map((item, index) => (
                    (activeId === null || activeId === index) && (
                        <div key={index} className="px-6 py-5 bg-yellow-900 border-yellow-600">

                            <h2 className="text-2xl font-bold text-yellow-500 mb-4 pt-2 text-center">
                                {item.menuType}
                            </h2>
                            <p className="mb-6 text-white">{item.details.description}</p>
                            {item.details.pricing && (
                                <ul className="space-y-4">
                                    {item.details.pricing.map((pricingItem, pricingIndex) => (
                                        <li
                                            key={pricingIndex}
                                            className="flex items-center justify-between py-2 px-4 rounded-md shadow-sm bg-white hover:shadow-md transition-all"
                                        >
                                            <div className="flex flex-col text-left">
                                                <p className="text-gray-800 font-medium">{pricingItem.item}</p>
                                                {pricingItem.options && (
                                                    <p className="text-gray-500 mt-1">{pricingItem.options.join(', ')}</p>
                                                )}
                                            </div>
                                            <span className="flex-1 border-dashed border-t mx-2"></span>
                                            <p className="text-indigo-600 font-bold">{pricingItem.price}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                ))}
            </div>

            {activeId !== null && (
                <div className="w-full flex justify-center mt-7 mb-10">
                    <button
                        onClick={() => setActiveId(null)}
                        className="py-2 px-6 bg-brown hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
                    >
                        Show Full Prices
                    </button>
                </div>
            )}

        </div >
    );
};

export default MenuAccordions;
