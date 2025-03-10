import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
/* import floorplan from '../assets/floorplan.png' */
import BookingForm from '../components/BookingForm copy';

export default function Bookings() {
    return (
        <>
            <Navbar />
            <div>
                <h1>Table Reservation</h1>
                {/* <img class="floorplan" src={floorplan}></img> */}
                <BookingForm/>
            </div>
            <Footer />
        </>
    )
}
