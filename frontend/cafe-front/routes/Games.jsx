import React from 'react';
import heroImage from '../assets/hero_games.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Games() {
    return (
        <>
            <Navbar />
            <Hero
                cName="heroGames"
                heroImage={heroImage}
                title="Our Game Collection"
                text="Enjoy the best board games with us."
                linkText="Book Now"
                linkClass="show"
                url="/bookings"
            />
			<h1>Here we will have some games?</h1>
            <Footer />
        </>
    );
}

export default Games;
