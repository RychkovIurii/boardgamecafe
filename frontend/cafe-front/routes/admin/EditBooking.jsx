import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';

const EditBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [tables, setTables] = useState([]);
    const [games, setGames] = useState([]);
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
        return date.toISOString().slice(11, 16);
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
                const gamesResponse = await API.get('/admin/games');

                setBooking(bookingResponse.data);
                setTables(tablesResponse.data);
                setGames(gamesResponse.data);
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
            alert("Please provide a valid date, start time, and end time.");
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
            alert("Invalid date or time format.");
            return;
        }

        const updatedBooking = {
            ...booking,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString()
        };
		console.log("Updating booking with:", updatedBooking);

        try {
            await API.put(`/admin/bookings/${id}`, updatedBooking);
            alert('Booking updated successfully');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to update booking');
        }
    };

    if (loading || !booking) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Edit Booking</h1>
            <form onSubmit={handleUpdate}>
                <label>Date:</label>
                <input 
                    type="date" 
                    value={booking.date?.split('T')[0] || ''} 
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                />

                <label>Start Time:</label>
                <input 
                    type="time" 
                    value={booking.startTime ? formatTime(booking.startTime) : ''} 
                    onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
                />

                <label>End Time:</label>
                <input 
                    type="time" 
                    value={booking.endTime ? formatTime(booking.endTime) : ''} 
                    onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
                />

				<label>Table:</label>
				<select
				value={booking.tableId ? booking.tableId.toString() : ''}
				onChange={(e) => {
					console.log("New table id:", e.target.value);
					setBooking({ ...booking, tableId: e.target.value });
				}}
				>
				{tables.map((table) => (
					<option key={table._id} value={table._id.toString()}>
					Table {table.number}
					</option>
				))}
				</select>

                <label>Game:</label>
                <select 
                    value={booking.gameId || ''} 
                    onChange={(e) => setBooking({ ...booking, gameId: e.target.value })}
                >
                    {games.map(game => (
                        <option key={game._id} value={game._id}>
                            {game.title}
                        </option>
                    ))}
                </select>

                <label>Players:</label>
                <input 
                    type="number" 
                    value={booking.players} 
                    onChange={(e) => setBooking({ ...booking, players: e.target.value })}
                />

                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/admin')}>Cancel</button>
            </form>
        </div>
    );
};

export default EditBooking;
