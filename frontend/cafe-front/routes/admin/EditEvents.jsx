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
    const [viewPast, setViewPast] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const endpoint = viewPast ? '/events/past' : '/events';
                const response = await API.get(endpoint);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [viewPast]);

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
                const response = await API.put(`/events/${selectedEventId}`, newEvent);
                setEvents(events.map(event => (event._id === selectedEventId ? response.data : event)));
            } else {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (confirmDelete) {
            try {
                await API.delete(`/events/${id}`);
                setEvents(events.filter(item => item._id !== id));
            } catch (error) {
                console.error('Error deleting menu item:', error);
            }
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className="md:py-20 py-10 mx-auto px-8">
                <h1 className="admin-section-title">{t('editEvents.title')}</h1>
                <div className="flex justify-end mb-4">
                    <label className="mr-2 font-medium">{t('editEvents.includePastLabel')}</label>
                    <select
                        className="border px-2 py-1 rounded-md"
                        value={viewPast ? 'past' : 'upcoming'}
                        onChange={(e) => setViewPast(e.target.value === 'past')}
                    >
                        <option value="upcoming">{t('editEvents.onlyUpcoming')}</option>
                        <option value="past">{t('editEvents.allEvents')}</option>
                    </select>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5 ">
                    <input
                        type="text"
                        name="title"
                        placeholder={t('editEvents.titlePlaceholder')}
                        value={newEvent.title}
                        onChange={handleChange}
                        required
                        className="border px-4 py-2 rounded-md w-full"
                    />
                    <textarea
                        name="description"
                        placeholder={t('editEvents.descriptionPlaceholder')}
                        value={newEvent.description}
                        onChange={handleChange}
                        required
                        className="border px-4 py-2 rounded-md w-full min-h-[100px]"
                    ></textarea>
                    <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleChange}
                        required
                        className="border px-4 py-2 rounded-md w-full"
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder={t('editEvents.imagePlaceholder')}
                        value={newEvent.image}
                        onChange={handleChange}
                        className="border px-4 py-2 rounded-md w-full"
                    />

                    <div className="flex gap-4 pt-2 justify-center">
                        <button
                            type="submit"
                            className="bg-green-800 text-white px-6 py-2 rounded"
                        >
                            {selectedEventId ? t('editEvents.updateButton') : t('editEvents.submitButton')}
                        </button>
                        {selectedEventId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setNewEvent({ title: '', description: '', date: '', image: '' });
                                    setSelectedEventId(null);
                                }}
                                className="admin-button-cancle-delete"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <h2 className='md:px-10 md:pt-10 md:mt-10 md:pb-5 pt-10 pb-5 text-2xl md:text-3xl font-medium text-gray-800'>{t('editEvents.existingEvents')}</h2>
                <div className="flex flex-wrap justify-center mx-auto gap-3">
                    {events.map(event => (
                        <div key={event._id} className="border rounded-md p-4 shadow hover:shadow-md transition duration-200 ">
                            <EventsCard
                                eventTitle={event.title}
                                eventDate={new Date(event.date).toLocaleDateString('en-GB', {
                                    day: '2-digit', month: 'long', year: 'numeric'
                                })}
                                eventDescription={event.description}
                                image={event.image}
                            />
                            <div className="flex gap-2 justify-center pt-2 ">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="admin-button-edit"
                                >
                                    {t('editEvents.editButton')}
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="admin-button-cancle-delete"
                                >
                                    {t('editEvents.deleteButton')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditEvents;
