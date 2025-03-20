import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useTranslation } from 'react-i18next';
import EventsCard from '../../components/EventsCard';
import AdminNavbar from '../../components/admin/AdminNavbar';

const EditEvents = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        image: ''
    });
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get('/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setNewEvent({
            ...newEvent,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedEventId) {
                // Update existing event
                const response = await API.put(`/events/${selectedEventId}`, newEvent);
                setEvents(events.map(event => (event._id === selectedEventId ? response.data : event)));
            } else {
                // Create new event
                const response = await API.post('/events', newEvent);
                setEvents([...events, response.data]);
            }
            setNewEvent({ title: '', description: '', date: '', image: '' });
            setSelectedEventId(null);
        } catch (error) {
            console.error('Error creating/updating event:', error);
        }
    };

    const handleEdit = (event) => {
        const formattedDate = new Date(event.date).toISOString().split('T')[0];
        setNewEvent({
            title: event.title,
            description: event.description,
            date: formattedDate,
            image: event.image
        });
        setSelectedEventId(event._id);
    };

	return (
		<div>
			<AdminNavbar />
			<h1 style={{ marginTop: '30px' }}>{t('editEvents.title')}</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="title"
					placeholder={t('editEvents.titlePlaceholder')}
					value={newEvent.title}
					onChange={handleChange}
					required
				/>
				<textarea
					name="description"
					placeholder={t('editEvents.descriptionPlaceholder')}
					value={newEvent.description}
					onChange={handleChange}
					required
				></textarea>
				<input
					type="date"
					name="date"
					value={newEvent.date}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="image"
					placeholder={t('editEvents.imagePlaceholder')}
					value={newEvent.image}
					onChange={handleChange}
				/>
				<button type="submit">{selectedEventId ? t('editEvents.updateButton') : t('editEvents.submitButton')}</button>
			</form>
			<h2 style={{ marginTop: '30px' }}>{t('editEvents.existingEvents')}</h2>
			<div className='cardGen'>
				{events.map(event => (
					<div key={event._id}>
						<EventsCard 
							eventTitle={event.title}
							eventDate={new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
							eventDescription={event.description}
							image={event.image}
						/>
						<button onClick={() => handleEdit(event)}>{t('editEvents.editButton')}</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default EditEvents;
