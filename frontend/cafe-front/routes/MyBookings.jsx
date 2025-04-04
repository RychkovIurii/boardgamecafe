import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState({ past: [], upcoming: [] });
	const { user } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editedBooking, setEditedBooking] = useState({
        date: dayjs().format("YYYY-MM-DD"),
        startTime: dayjs().format('HH:mm'),
        duration: 60,
        tableId: '',
        players: 1,
    });
    const [filteredTables, setFilteredTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('bookings/my-bookings');
                console.log('data', response.data)
                const now = new Date();

                const past = response.data.filter(booking => new Date(booking.date) < now).sort((a, b) => new Date(a.date) - new Date(b.date));
                const upcoming = response.data.filter(booking => new Date(booking.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));

                setBookings({ past, upcoming });
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchTables = async () => {
            try {
                const response = await API.get('/tables');
                setTables(response.data);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchBookings();
        fetchTables();
    }, []);

    // Function to check and filter tables based on number of players
    function checkTableAvailability(people) {
        const seatCapacities = [2, 4, 5, 6, 8, 10]; // Define allowed seat counts
        const seatLimit = seatCapacities.find(capacity => people <= capacity); // Find the smallest matching capacity

        if (!seatLimit) {
            const message = t(`bookingForm.availabilityText`);
            Swal.fire({ icon: 'error', title: 'Error', text: message });
            return;
        }

        setFilteredTables(tables.filter(table => table.capacity === seatLimit)); // Filter tables
    }

    const handleEdit = (booking) => {
        setIsEditing(booking._id);
        setEditedBooking({
            ...booking,
            date: dayjs(booking.date).format("YYYY-MM-DD"),
            startTime: dayjs(booking.startTime),
            duration: booking.duration ?? 60,
            players: booking.players,
            tableId: booking.tableId, // 추가된 부분
			contactName: editedBooking.contactName || user?.name,
			contactPhone: editedBooking.contactPhone || user?.phone,
        });
        checkTableAvailability(booking.players);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditedBooking(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBooking({
            ...editedBooking,
            [name]: name === 'duration' || name === 'players' ? Number(value) : value,
        });
        if (name === 'players') checkTableAvailability(value); // Filter tables when player count changes
    };

    const handleTimeChange = (value) => {
        setEditedBooking({ ...editedBooking, startTime: value });
    };

    const handleSave = async (id) => {
		const selectedTable = tables.find(table => table.number.toString() === editedBooking.tableId.toString());
		if (!selectedTable) {
			return Swal.fire({ icon: 'error', title: 'Invalid Table', text: 'Selected table was not found.' });
		}
        const formattedBooking = {
            ...editedBooking,
            date: dayjs(editedBooking.date).format("YYYY-MM-DD"),
            startTime: dayjs(editedBooking.startTime).format("HH:mm"),
            duration: editedBooking.duration,
			tableId: selectedTable._id,
        };
        console.log("Sending data to backend:", formattedBooking);

        try {
            const response = await API.put(`/bookings/my-bookings/${id}`, formattedBooking);
            console.log('formattedBooking', response.data)

            if (response.status === 200) {
                Swal.fire({ icon: 'success', title: 'Updated!', text: 'The booking has been successfully updated.' });
                setBookings(prev => ({
                    ...prev,
                    upcoming: prev.upcoming.map(booking => booking._id === id ? { ...booking, ...formattedBooking } : booking)
                }));
                setIsEditing(null);
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Something went wrong while updating the booking.' });
        }
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

            await API.delete(`/bookings/my-bookings/${id}`);
            setBookings(prev => ({
                past: prev.past.filter(booking => booking._id !== id),
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
            <div className="py-20">
                <h1 className="text-outline text-5xl font-medium text-yellow-500 mt-5 mb-10">My Bookings</h1>

                <div className='max-w-5xl mx-auto'>
                    <p className='text-xl pt-7 text-start'>Upcoming Bookings</p>
                    <div className='w-full flex flex-wrap pt-5 px-3 gap-5 md:justify-start justify-center '>
                        {bookings.upcoming.length > 0 ? (bookings.upcoming.map((booking) => (
                            <div key={booking._id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border border-gray-400 p-4 rounded-xl flex flex-col text-sm gap-1 shadow-lg bg-white'>

                                {isEditing === booking._id ? (
                                    <>
                                        <div className="mb-2">
                                            <p><strong>Date:</strong></p>
                                            <input type='date'
                                                min={new Date().toJSON().slice(0, 10)}  // Setting the minimum date to today's date
                                                name="date"
                                                value={dayjs(editedBooking.date).format('YYYY-MM-DD') || ""}  // Make sure to format the date if using dayjs
                                                onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Start Time:</strong></p>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker value={editedBooking.startTime} onChange={handleTimeChange} timeSteps={{ minutes: 30 }} minutesStep={30} ampm={false} />
                                            </LocalizationProvider>
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Duration:</strong></p>
                                            <input type="number" name="duration" value={editedBooking.duration || 60} onChange={handleChange} min={60}
                                                step={30} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Players:</strong></p>
                                            <input type="number" name="players" value={editedBooking.players} onChange={(e) => handleChange({ target: { name: e.target.name, value: Number(e.target.value) } })} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Table No:</strong></p>
                                            <select
                                                name="tableId"
                                                value={editedBooking.tableId}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, tableId: e.target.value })}
                                                className="border p-1 rounded"
                                            >
                                                <option value="" disabled>Select a table</option>
                                                {filteredTables.map(table => (
                                                    <option key={table.number} value={table.number}>
                                                        {table.number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Game:</strong></p>
                                            <input type="text" name="game" value={editedBooking.game} onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Contact Name:</strong></p>
                                            <input type="text" name="contactName" value={editedBooking.contactName} onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Contact Phone:</strong></p>
                                            <input type="text" name="contactPhone" value={editedBooking.contactPhone} onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleSave(booking._id)} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2">Save</button>
                                            <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2">Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p>Players: {booking.players}</p>
                                        <p>Table No: {booking.tableId?.number}</p>
                                        <p>Contact: {booking.contactName}<br /> ({booking.contactPhone})</p>
                                        <div className="mt-3 flex gap-2 justify-center">
                                            <button onClick={() => handleEdit(booking)} className="bg-green-800 w-20 text-white px-4 py-2 rounded-md">Edit</button>
                                            <button onClick={() => handleDelete(booking._id)} className="bg-gray-700 w-20 text-white px-4 py-2 rounded-md">Cancel</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                        ) : (
                            <p>No upcoming bookings.</p>
                        )}
                    </div>
                </div>

                {/* Repeat for past bookings */}
                <div className='max-w-5xl mx-auto mt-7'>
                    <p className='text-xl pt-7 text-start'>Booking History</p>
                    <div className='flex flex-col sm:flex-row m-auto gap-5 pt-5 px-3 sm:px-0'>
                        {bookings.past.length > 0 ? (bookings.past.slice(0, 5).map((booking) => (
                            <div key={booking._id} className=' border border-gray-400 p-4 rounded-xl flex flex-col text-sm gap-1 shadow-lg bg-white'>
                                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p>Players:{booking.players}</p>
                                <p>Table No: {booking.tableId?.number}</p>
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
