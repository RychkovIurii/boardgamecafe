import React from 'react';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import heroImage from '../src/assets/hero/hero_events.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import EventsCard from '../components/EventsCard';
import '../components/Style/EventCard.css'
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';

function Events() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [nextCafeconDate, setNextCafeconDate] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await API.get('/events');
				const allEvents = response.data;
				setEvents(allEvents);

				// 🧠 Find the next CAFECON event
				const now = new Date();
				const upcomingCafecon = allEvents
					.filter(event =>
						event.title?.toLowerCase().includes('cafecon') &&
						new Date(event.date) > now
					)
					.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

				if (upcomingCafecon) {
					setNextCafeconDate(upcomingCafecon.date);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);
  
	if (loading) {
		return (
		  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
			<CircularProgress size="3rem" thickness={5} color="inherit"/>
		  </div>
		);
	  }
      if (error) {
        return (
          <>
            <Navbar />
            <div style={{
              padding: '2rem',
              textAlign: 'center',
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                 Our backend isn’t running right now.
              </h2>
              <p>
                Please contact us.
              </p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#991b1b' }}>
                Error: {error.message || error.toString()}
              </p>
            </div>
            <Footer />
          </>
        );
      }

	return (
		<>
			<Navbar />
			<Hero
				cName="hero"
				heroImage={heroImage}
				title="CafeCon Café Boardgame"
				text={nextCafeconDate ? <CountdownTimer targetDate={nextCafeconDate} /> : 'No upcoming CafeCon events'}
				linkText={t('Learn More')}
				linkClass="show"
				url="/cafecon"
			/>
			<h1 style={{ margin: '30px' }}>{t('events.upcomingEvents')}</h1>
			<div className='cardGen'>
				{events.map(event => (
					<EventsCard
						key={event._id}
						eventTitle={event.title}
						eventDate={new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
						eventDescription={event.description}
						image={event.image}
					/>
				))}
			</div>
			<Footer />
		</>
	);
}

export default Events;
