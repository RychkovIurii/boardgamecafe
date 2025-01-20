import React from 'react'
import { menuNavbarData } from '../assets/menu_icon_assets/assets'
import { Link } from 'react-router-dom'

const MenuIcon = () => {
    return (
        <div id='menuType' className='flex flex-col items-center gap-5 py-16 text-gray-800'>
            <h1 className='text-5xl font-medium'>Find Our Menu</h1>
            <p className='sm:w-1/3 text-center text-md'>  Need a snack or a drink? Even our own products?</p>
            <div className='flex sm:justify-center gap-10 pt-6 w-full overflow-scroll px-9'>
                {menuNavbarData.map((item, index) => (
                    <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
                        key={index} to={`/menu/${item.menuType}`}>
                        <img
                            className={`rounded-lg ${item.menuType === 'own brand' ? 'w-16 sm:w-24 h-15 mt-5 mb-2' : 'w-16 sm:w-24 mb-2'
                                }`} src={item.image} alt="" />
                        <p className={`${item.menuType === 'own brand' ? 'mt-8 text-sm' : 'mt-2 text-sm'}`}
                        >{item.menuType}</p>
                    </Link>
                ))}
            </div>
        </div >
    )
}

export default MenuIcon
