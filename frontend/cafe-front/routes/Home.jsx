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
                title="Welcome to CAFÉ BOARDGAME"
                text="Enjoy the best board games with your friends and family"
                linkText="Book Now"
                linkClass="show"
                url="/bookings"
            />

            <About />
            <Footer />
        </>
    );
}

export default Home;
