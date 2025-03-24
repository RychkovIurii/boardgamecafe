import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios'

const MyBookings = () => {


    const [bookings, setBookings] = useState({ past: [], upcoming: [] });
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('bookings/my-bookings');
                console.log('Fetched bookings:', response.data)
                const now = new Date();

                const past = response.data.filter(booking => new Date(booking.date) < now);
                const upcoming = response.data.filter(booking => new Date(booking.date) >= now);

                console.log('Upcoming:', upcoming);
                console.log('Past:', past);

                setBookings({ past, upcoming });
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings()
    }, [])

    // const handleEdit = (bookingId) => {
    //     navigate(`/edit-booking/${bookingId}`);
    // };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await API.delete(`/bookings/my-bookings/${id}`);
            setBookings(prev => prev.filter(booking => booking._id !== id));
            alert('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div>
                <h1 className="pb-3 mt-12 text-2xl font-bold mb-6">My Bookings</h1>

                <div> {/* Upcoming Bookings */}
                    <h2 className="text-lg font-semibold mt-6 mb-4">Upcoming Bookings</h2>
                    {bookings.upcoming.length > 0 ? (
                        bookings.upcoming.map((booking) => (
                            <div key={booking._id} className="border p-4 rounded-md mb-4 shadow-sm">
                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}</p>
                                <p><strong>Players:</strong> {booking.players}</p>
                                <p><strong>Contact:</strong> {booking.contactName} ({booking.contactPhone})</p>
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleEdit(booking._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(booking._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming bookings.</p>
                    )}</div>

                <div> {/* Past Bookings */}
                    <h2 className="text-lg font-semibold mt-6 mb-4">Booking History</h2>
                    {bookings.past.length > 0 ? (
                        bookings.past.map((booking) => (
                            <div key={booking._id} className="border p-4 rounded-md mb-4 shadow-sm">
                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}</p>
                                <p><strong>Players:</strong> {booking.players}</p>
                                <p><strong>Contact:</strong> {booking.contactName} ({booking.contactPhone})</p>
                            </div>
                        ))
                    ) : (
                        <p>No booking history.</p>
                    )}

                </div >
            </div>

            <Footer />
        </>
    );
};

export default MyBookings;
