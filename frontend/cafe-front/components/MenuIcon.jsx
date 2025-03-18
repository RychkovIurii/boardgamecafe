import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const MenuIcon = ({ activeId, setActiveId }) => {
	const [menuData, setMenuData] = useState([]);

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

    return (
        <div id="menuType" className="flex flex-col items-center gap-5 md:py-16 py-5 text-gray-800">
            <h1 className="text-3xl md:text-5xl font-black text-yellow-500">Find Our Menu</h1>
            <p className="pt-3 sm:pt-5 text-xl md:text-2xl font-semibold text-gray-700">Need a snack or a drink? Even our own products?</p>
            <div className="flex flex-cols-3 md:flex-cols-6 place-items-center gap-2 pt-3 md:gap-3 md:pt-6">
                {menuData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveId(index)} // Update activeId
                        className={`flex flex-col items-center cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${activeId === index ? 'text-indigo-600 font-semibold' : ''
                            }`}
                        style={{ width: '150px', marginTop: '5px', marginBottom: '5px' }} // Set a fixed width for each item
                    >
                        <div className="flex justify-center items-center w-full">
                            <img
                                className={`rounded-lg ${item.menuType === 'Own Brand'
                                    ? 'w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto mb-6 mt-3'
                                    : 'w-12 sm:w-16 md:w-20 lg:w-24 mb-2'
                                    }`}
								src={`/assets/image_assets/${item.image}`}
                                alt={item.menuType}
                            />
                        </div>
                        <p className={`${item.menuType === 'Own Brand' ? 'md:mt-4 font-medium' : 'mt-4 font-medium'}`}>
                            {item.menuType}
                        </p>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default MenuIcon
