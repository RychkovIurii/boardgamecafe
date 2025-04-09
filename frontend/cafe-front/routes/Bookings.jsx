import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
/* import floorplan from '../assets/floorplan.png' */
import BookingForm from '../components/BookingForm';
import { useTranslation } from 'react-i18next';


export default function Bookings() {
	const { t } = useTranslation();
	return (
		<>
			<Navbar />
			<div className="md:py-20 py-10">
				<h1 className="md:pt-5 text-3xl md:text-5xl lg:text-6xl font-medium text-yellow-500 mb-10">{t('bookingForm.tableReservation')}</h1>
				{/* <img class="floorplan" src={floorplan}></img> */}
				<BookingForm />
			</div>
			<Footer />
		</>
	)
}
