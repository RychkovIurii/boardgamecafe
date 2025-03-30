import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyBookings = () => {

    const navigate = useNavigate();
    const [bookings, setBookings] = useState({ past: [], upcoming: [] });
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('bookings/my-bookings');
                console.log('Fetched bookings:', response.data)
                const now = new Date();

                const past = response.data.filter(booking => new Date(booking.date) < now).sort((a, b) => new Date(a.date) - new Date(b.date));
                const upcoming = response.data.filter(booking => new Date(booking.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));

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

    const handleEdit = (booking) => {
        navigate('/bookings/edit/${booking._id}', { state: { booking } });  // 예약 정보와 함께 이동
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'This booking will be permanently deleted.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (!result.isConfirmed) return;

            await API.delete(`bookings/my-bookings/${id}`);
            setBookings(prev => ({
                upcoming: prev.upcoming.filter(booking => booking._id !== id)
            }));

            await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The booking has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting booking:', error);

            await Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Something went wrong while deleting the booking.'
            });
        }
    };

    if (loading) return <p>Loading...</p>;
    return (
        <>
            <Navbar />
            <div className="py-20 max-w-4xl mx-auto  dark:bg-gray-800">
                <h1 className="text-4xl md:text-5xl font-black text-yellow-500 mb-10">My Bookings</h1>

                <div>
                    <p className='text-xl pt-7 text-start'>Upcoming Bookings</p>
                    <div className='flex flex-col sm:flex-row m-auto gap-5 pt-5 px-3 sm:px-0'>
                        {bookings.upcoming.length > 0 ? (bookings.upcoming.map((booking) => (
                            <div key={booking._id} className='border border-gray-400 p-4 rounded-xl flex flex-col text-sm gap-1 shadow-lg bg-white'>

                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p>Players: {booking.players}</p>
                                <p>Contact: {booking.contactName}<br /> ({booking.contactPhone})</p>
                                <div className="mt-3 flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleEdit(booking)}
                                        className="bg-green-800 w-20 text-white px-4 py-2 rounded-md"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(booking._id)}
                                        className="bg-gray-700 w-20 text-white px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>

                                </div>
                            </div>
                        ))
                        ) : (
                            <p>No upcoming bookings.</p>
                        )}
                    </div>
                </div>


                <div className='mt-10'>
                    <p className='text-xl pt-7 text-start'>Booking History</p>
                    <div className='flex flex-col sm:flex-row m-auto gap-5 pt-5 px-3 sm:px-0'>
                        {bookings.past.length > 0 ? (bookings.past.slice(0, 5).map((booking) => (
                            <div key={booking._id} className=' border border-gray-400 p-4 rounded-xl flex flex-col text-sm gap-1 shadow-lg bg-white'>

                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p>Players:{booking.players}</p>
                                <p>Contact:{booking.contactName} <br /> ({booking.contactPhone})</p>

                            </div>

                        ))
                        ) : (
                            <p>No booking history</p>
                        )}
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
};

export default MyBookings;
