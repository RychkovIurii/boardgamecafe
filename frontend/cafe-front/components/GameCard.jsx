import React from 'react';
import '../components/Style/GameCardStyles.css';
import { colors } from '../components/Style/Colors';
import fallbackImage from '../src/assets/icons/boardgame_icom_round.png';

export default function GameCard({ gamesInfo }) {
    return (
        <div className='gameBG' style={{ backgroundColor: colors.color.CardBgColor }}>
            <div className='cardContent'>
                <div className='gameTit' style={{ color: colors.color.fontTitle }}>
                    {gamesInfo.title}
                </div>
                <div className='imgHold'>
                    <img
                        className='gameImg'
                        src={gamesInfo.image}
                        alt={gamesInfo.title}
                        onError={(e) => {
                            e.target.onerror = null; // prevents infinite loop
                            e.target.src = fallbackImage; // Use the imported fallback image
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
