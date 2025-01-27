import React from 'react';
import heroImage from '../assets/hero_events2.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';

function Events() {
    const nextEventDate = '2025-02-02T16:00:00'; // Set the target date for the next event

    return (
        <>
            <Navbar />
            <Hero
                cName="heroEvents"
                heroImage={heroImage}
                title="CafeCon Café Boardgame"
                text={<CountdownTimer targetDate={nextEventDate} />}
                linkText="Learn More"
                linkClass="show"
                url="/cafecon"
            />
            <h1>Here we will have some cards with upcoming events?</h1>
            <Footer />
        </>
    );
}

export default Events;
