import React from 'react'
import '../components/Style/GameCardStyles.css'

export default function GameCard({ gamesInfo }) {
    return (

        <div className='gameBG'>
            <div className='cardContent'>
                <div className='gameTit'>
                    {gamesInfo.title}
                </div>
                <div className='imgHold'>
                    <img className='gameImg' src={gamesInfo.image} />
                </div>
            </div>
        </div>

    )
}
