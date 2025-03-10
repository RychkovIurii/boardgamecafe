import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import heroImage from '../assets/hero_events2.jpg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import EventsCard from '../components/EventsCard';
import '../components/Style/EventCard.css'

const eventplaceholds = [
    {
        id: 1,
        eventTitle: 'Miniature painting',
        image: 'https://taverncraftstudios.com/cdn/shop/articles/q_a_how_to_print_3d_resin_miniatures.jpg?v=1700578830&width=1100',
        eventDate: '25-2-2025',
        eventDescription: 'Learn new techniques for painting miniatures. Paints and brushes are provided by the Cafe, bring your own mini\'s'
    },
    {
        id: 2,
        eventTitle: 'DM workshop',
        image: 'https://www.estywaygaming.com/cdn/shop/products/dungeonmaster.png?v=1706421135',
        eventDate: '5-5-2025',
        eventDescription: 'Come learn from experienced GM (name here)! Learn new tips and tricks for running your own tabletop RPG\'s and making it more fun for everybody, including you!'
    },
    {
        id: 3,
        eventTitle: 'Murder Mystery Party',
        image: 'https://murdermysteryevents.com/wp-content/uploads/2023/08/What-is-Murder-Mystery.jpg',
        eventDate: '14-2-2025',
        eventDescription: 'Join us for a fun night of mayhem and murder where we deepdive into a mystery where one of the participants is the killer. Help solve a murder while keeping your own little secrets. Can you find who did it?'
    },
    {
        id: 4,
        eventTitle: 'Miniature painting',
        image: 'https://taverncraftstudios.com/cdn/shop/articles/q_a_how_to_print_3d_resin_miniatures.jpg?v=1700578830&width=1100',
        eventDate: '25-2-2025',
        eventDescription: 'Learn new techniques for painting miniatures. Paints and brushes are provided by the Cafe, bring your own mini\'s'
    },
    {
        id: 5,
        eventTitle: 'DM workshop',
        image: 'https://www.estywaygaming.com/cdn/shop/products/dungeonmaster.png?v=1706421135',
        eventDate: '5-5-2025',
        eventDescription: 'Come learn from experienced GM (name here)! Learn new tips and tricks for running your own tabletop RPG\'s and making it more fun for everybody, including you!'
    },
    {
        id: 6,
        eventTitle: 'Murder Mystery Party',
        image: 'https://murdermysteryevents.com/wp-content/uploads/2023/08/What-is-Murder-Mystery.jpg',
        eventDate: '14-2-2025',
        eventDescription: 'Join us for a fun night of mayhem and murder where we deepdive into a mystery where one of the participants is the killer. Help solve a murder while keeping your own little secrets. Can you find who did it?'
    }
]

function Events() {
    const nextEventDate = '2025-02-02T16:00:00'; // Set the target date for the next event

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
            <h1>Here we will have some cards with upcoming events?</h1>
            <div className='cardGen'>{eventplaceholds.map(eventplacehold => <EventsCard key={eventplacehold.id} eventTitle= {eventplacehold.eventTitle} eventDate={eventplacehold.eventDate} eventDescription={eventplacehold.eventDescription} image={eventplacehold.image}/>)}</div>
            <Footer />
        </>
    );
}

export default Events;
