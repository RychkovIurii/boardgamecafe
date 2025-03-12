import React from 'react';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import heroImage from '../assets/hero_events2.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import EventsCard from '../components/EventsCard';
import '../components/Style/EventCard.css'

function Events() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const nextEventDate = '2025-04-02T16:00:00';
  
	useEffect(() => {
	  const fetchEvents = async () => {
		try {
		  const response = await API.get('/events');
		  setEvents(response.data);
		} catch (err) {
		  setError(err.message);
		} finally {
		  setLoading(false);
		}
	  };
  
	  fetchEvents();
	}, []);
  
	if (loading) return <div>Loading events...</div>;
	if (error) return <div>Error loading events: {error}</div>;
  
	return (
	  <>
		<Navbar />
		<Hero
		  cName="heroEvents"
		  heroImage={heroImage}
		  title="CafeCon Café Boardgame"
		  text={<CountdownTimer targetDate={nextEventDate} />}
		  linkText="Learn More"
		  linkClass="show"
		  url="/cafecon"
		/>
		<h1>Upcoming Events</h1>
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
