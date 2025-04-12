import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import Swal from '../../utils/swalWithFont';
import CircularProgress from '@mui/material/CircularProgress';

const EditBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to safely format time for the input
    const formatTime = (time) => {
        // If the time is already in HH:mm format, return it as-is.
        if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
            return time;
        }
        const date = new Date(time);
        if (isNaN(date.getTime())) return '';
        // Use toLocaleTimeString to format according to local time.
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      };

    // Helper function to combine a date and a time into a Date object
    const combineDateTime = (date, time) => {
        // Ensure the date is in YYYY-MM-DD format
        const dateStr = date.includes('T') ? date.split('T')[0] : date;
        return new Date(`${dateStr}T${time}`);
    };

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const bookingResponse = await API.get(`/admin/bookings/${id}`);
                const tablesResponse = await API.get('/admin/tables');

                setBooking(bookingResponse.data);
                setTables(tablesResponse.data);
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchBookingData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Validate that date, startTime, and endTime are provided
        if (!booking.date || !booking.startTime || !booking.endTime) {
            await Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please provide a valid date, start time, and end time.',
            });
            return;
        }

        // Always extract HH:mm from the stored time values.
        const startTimeStr = formatTime(booking.startTime);
        const endTimeStr = formatTime(booking.endTime);

        // Combine the booking date with the extracted time strings.
        const startDate = combineDateTime(booking.date, startTimeStr);
        const endDate = combineDateTime(booking.date, endTimeStr);

        // Check that the combined dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            await Swal.fire({
                icon: 'error',
                title: 'Invalid Date or Time',
                text: 'Please enter a valid date and time format.',
            });
            return;
        }

        const updatedBooking = {
            ...booking,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString()
        };

        try {
            await API.put(`/admin/bookings/${id}`, updatedBooking);
            await Swal.fire({
                icon: 'success',
                title: 'Booking Updated',
                text: 'The booking has been successfully updated.',
                confirmButtonText: 'OK'
            });
            navigate('/admin');
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Something went wrong while updating the booking.',
            });
        }
    };

    if (loading || !booking) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size="4rem" thickness={5} color="inherit" />
            </div>
        );
    }
    if (error) return <div>{error}</div>;

    return (
        <div className="admin-section-wrapper">
            <h1 className="admin-section-title">Edit Booking</h1>

                <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-5">
                    <div>
                        <label className="block mb-1 font-semibold">Date</label>
                        <input
                            type="date"
                            className="border px-4 py-2 rounded-md w-full"
                            value={booking.date?.split('T')[0] || ''}
                            onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Start Time</label>
                            <input
                                type="time"
                                className="border px-4 py-2 rounded-md w-full"
                                value={formatTime(booking.startTime)}
                                onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">End Time</label>
                            <input
                                type="time"
                                className="border px-4 py-2 rounded-md w-full"
                                value={formatTime(booking.endTime)}
                                onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Table</label>
                        <select
                            className="border px-4 py-2 rounded-md w-full"
                            value={booking.tableId?.toString() || ''}
                            onChange={(e) => setBooking({ ...booking, tableId: e.target.value })}
                        >
                            {tables.map((table) => (
                                <option key={table._id} value={table._id}>
                                    Table {table.number}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Game</label>
                        <input
                            type="text"
                            className="border px-4 py-2 rounded-md w-full"
                            value={booking.game || ''}
                            onChange={(e) => setBooking({ ...booking, game: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Players</label>
                        <input
                            type="number"
                            className="border px-4 py-2 rounded-md w-full"
                            value={booking.players}
                            onChange={(e) => setBooking({ ...booking, players: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 w-20 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="bg-gray-500 w-20 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
  

        </div>

    );
};

export default EditBooking;
