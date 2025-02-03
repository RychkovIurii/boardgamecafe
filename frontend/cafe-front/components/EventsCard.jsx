import React from 'react'
import { useState } from 'react'
import CountdownTimer from './CountdownTimer'
import '../components/Style/EventCard.css'



export default function EventsCard(props) {

    return (
        <div className='cardBG'>
            <div className='cardContent'>
                <h1>{props.eventTitle}</h1>
                <img className='eventImg' src={props.image}></img>
                <CountdownTimer />
                <div>
                    {props.eventDate}
                </div>
                <div className='descr'>
                    {props.eventDescription}
                </div>
                <div className='button'>
                    <button className='LearnMore' type='button' title='Learn more'>Learn more...</button>
                </div>
            </div>
        </div>
    )
}
