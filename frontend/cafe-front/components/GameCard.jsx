import React from 'react'
import '../components/Style/GameCardStyles.css'
import { colors } from '../components/Style/Colors';

export default function GameCard({ gamesInfo }) {
    return (

        <div className='gameBG' style={{ backgroundColor: colors.color.CardBgColor }}>
            <div className='cardContent'>
                <div className='gameTit' style={{ color: colors.color.fontTitle }}>
                    {gamesInfo.title}
                </div>
                <div className='imgHold'>
                    <img className='gameImg' src={gamesInfo.image} />
                </div>
            </div>
        </div>

    )
}
