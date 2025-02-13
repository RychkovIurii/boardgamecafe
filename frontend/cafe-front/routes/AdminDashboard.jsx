import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const bookingsResponse = await API.get('/admin/upcoming-bookings');
				console.log('API Response:', bookingsResponse.data); // Debugging log
                setUpcomingBookings(bookingsResponse.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                navigate('/'); // Redirect if unauthorized
            }
			finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [navigate]);

	if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
	console.log(upcomingBookings);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Upcoming Bookings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Table</th>
                        <th>Game</th>
                        <th>User</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingBookings.map((booking) => (
                        <tr key={booking._id}>
                            <td>{new Date(booking.date).toLocaleDateString()}</td>
                            <td>{booking.startTime} - {booking.endTime}</td>
                            <td>{booking.tableId?.number}</td>
                            <td>{booking.gameId?.title || 'N/A'}</td>
                            <td>{booking.userId?.name || booking.contactName}</td>
                            <td>{booking.players}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
