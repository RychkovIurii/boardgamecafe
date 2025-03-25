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
			<div>
				<h1 style={{ padding: '20px', marginTop: '20px' }}>{t('bookingForm.tableReservation')}</h1>
				{/* <img class="floorplan" src={floorplan}></img> */}
				<BookingForm/>
			</div>
			<Footer />
		</>
	)
}
