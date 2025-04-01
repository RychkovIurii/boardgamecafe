import React from 'react'
import { assets } from '../src/assets/assets';

function Title({ text1, text2 }) {
    return (
        <div className='inline-flex gap-2 items-center mb-3'>
            <p className='text-gray-700'>
                {text1} <span className='text-yellow-500 font-medium'>{text2}</span>
            </p>
            <div className='w-8 sm:w-12 h-[1px] sm:h-[3px] bg-gray-700'></div>
            <img src={assets.rolling_dices} alt="rolling_dices" className='h-12 object-contain' />
        </div>
    )
}

export default Title
