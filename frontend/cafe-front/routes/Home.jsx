import React from 'react';
import heroImage from '../assets/hero_home.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Home() {
    return (
        <>
            <Navbar />
            <Hero
                cName="hero"
                heroImage={heroImage}
                title="Welcome to BoardGameCafe"
                text="Enjoy the best board games with your friends and family."
                linkText="Book Now"
                linkClass="show"
                url="/bookings"
            />
            <Footer />
        </>
    );
}

export default Home;
