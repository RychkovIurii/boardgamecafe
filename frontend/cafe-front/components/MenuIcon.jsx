import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useTranslation } from 'react-i18next';
import { iconMap } from '../src/assets/icons/icon';
import { colors } from '../components/Style/Colors';

const MenuIcon = ({ activeId, setActiveId }) => {
	const [menuData, setMenuData] = useState([]);
	const { t } = useTranslation();

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
             <h2 className="pt-10 text-3xl md:text-5xl lg:text-6xl font-medium mb-7" style={{ color: colors.color.fontYellow }}>{t("menu.title")}</h2>
            <p className="px-4 text-xl md:text-2xl font-semibold" style={{ color: colors.color.fontSubTitle }}>{t("menu.subtitle")}</p>
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 pt-2 md:gap-6 md:pt-7">
                {menuData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveId(index)} // Update activeId
                        className={`flex flex-col items-center cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${activeId === index ? 'text-indigo-600 font-semibold' : ''
                            }`}
                        style={{ width: '150px', marginTop: '3px', marginBottom: '5px' }} // Set a fixed width for each item
                    >
                        <div className="flex justify-center items-center w-full">
                            <img
                                className={`rounded-lg ${item.menuType === 'Own Brand'
                                    ? 'w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto mb-6 mt-3'
                                    : 'w-12 sm:w-16 md:w-20 lg:w-24 mb-2'
                                    }`}
								src={iconMap[item.image]} alt={item.menuType}
                            />
                        </div>
                        <p className={`${item.menuType === 'Own Brand' ? 'md:mt-4 font-medium' : 'mt-4 font-medium'}`}>
							{t(`menu.types.${item.menuType}`, item.menuType)}
                        </p>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default MenuIcon
