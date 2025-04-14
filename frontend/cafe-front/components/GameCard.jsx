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
                    <img className='gameImg' src={gamesInfo.image} alt={gamesInfo.title} 
                    onError={(e) => {
                        e.target.onerror = null; // prevents infinite loop
                        e.target.src = '../src/assets/icons/boardgame_icom_round.png'; // fallback image
                      }}/>
                </div>
            </div>
        </div>

    )
}
