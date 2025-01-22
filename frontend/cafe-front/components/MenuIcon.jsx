import React from 'react'
import { menuData } from '../assets/menu_icon_assets/assets'


const MenuIcon = ({ activeId, setActiveId }) => {
    return (
        <div id="menuType" className="flex flex-col items-center gap-5 py-16 text-gray-800">
            <h1 className="text-5xl font-medium">Find Our Menu</h1>
            <p className="sm:w-1/3 text-center text-md">Need a snack or a drink? Even our own products?</p>
            <div className="flex flex-wrap justify-center pt-6 w-full px-9">
                {menuData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveId(index)} // Update activeId
                        className={`flex flex-col items-center text-xs cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${activeId === index ? 'text-indigo-600 font-semibold' : ''
                            }`}
                        style={{ width: '150px', marginTop: '5px', marginBottom: '5px' }} // Set a fixed width for each item
                    >
                        <div className="flex justify-center items-center w-full">
                            <img
                                className={`rounded-lg ${item.menuType === 'Own Brand'
                                    ? 'w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto mb-6 mt-3'
                                    : 'w-12 sm:w-16 md:w-20 lg:w-24 mb-2'
                                    }`}
                                src={item.image}
                                alt=""
                            />
                        </div>
                        <p className={`${item.menuType === 'Own Brand' ? 'mt-4 text-sm' : 'mt-4 text-sm'}`}>
                            {item.menuType}
                        </p>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default MenuIcon
