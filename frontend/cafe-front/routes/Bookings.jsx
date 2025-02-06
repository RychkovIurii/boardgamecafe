import React from 'react'
import heroImage from '../assets/hero_booking.png';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import floorplan from '../assets/floorplan.png'
import BookingForm from '../components/BookingForm';

export default function Bookings() {
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
            <div>
                <h1>Table Reservation</h1>
                {/* <img class="floorplan" src={floorplan}></img> */}
                <BookingForm/>
            </div>
            <Footer />
        </>
    )
}
