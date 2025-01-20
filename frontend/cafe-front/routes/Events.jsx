import React from 'react';
import heroImage from '../assets/hero_events2.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Events() {
    return (
        <>
            <Navbar />
            <Hero
                cName="heroEvents"
                heroImage={heroImage}
                title="CafeCon Café Boardgame (here should be a timer what time for the next event CafeCon)"
                text="Free* monthly gaming event in central Helsinki"
                linkText="Learn More"
                linkClass="show"
                url="/cafecon"
            />
            <h1>Here we will have some cards with upcomming events?</h1>
            <Footer />
        </>
    );
}

export default Events;
