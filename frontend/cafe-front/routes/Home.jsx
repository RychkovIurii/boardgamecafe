import heroImage from '../assets/hero_home.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from '../components/About'

function Home() {
    return (
        <>
            <Navbar />
            <Hero
                cName="hero"
                heroImage={heroImage}
                title="Welcome to CAFÉ BOARDGAME" //Change here
                text="Enjoy the best board games with your friends and family" //Change here
                linkText="Book Now" //Change here
                linkClass="show"
                url="/bookings"
            />

            <About />
            <Footer />
        </>
    );
}

export default Home;
