import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminDashboard = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(''); // Search filter
    const [filterBy, setFilterBy] = useState('all'); // Filter option
    const [selectedDate, setSelectedDate] = useState(''); // Date selection
    const [selectedTable, setSelectedTable] = useState(''); // Table selection
    const [tables, setTables] = useState([]); // Available tables
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const bookingsResponse = await API.get('/admin/upcoming-bookings');
                setUpcomingBookings(bookingsResponse.data);
                const tablesResponse = await API.get('/admin/tables');
                setTables(tablesResponse.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Failed to load data');
                navigate('/'); // Redirect if unauthorized
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleEdit = (id) => {
        navigate(`/admin/edit-booking/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await API.delete(`/admin/bookings/${id}`);
                setUpcomingBookings(prev => prev.filter(booking => booking._id !== id));
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert('Failed to delete booking');
            }
        }
    };

    const filteredBookings = upcomingBookings.filter(booking => {
		// Check the search filter
		const matchesSearch = booking.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
			booking.tableId?.number?.toString().includes(search) ||
			booking.gameId?.title?.toLowerCase().includes(search.toLowerCase());
	
		// Convert booking date to a Date object for comparisons
		const bookingDate = new Date(booking.date);
		const today = new Date();
	
		// Apply selected date filter if set
		const matchesDate = selectedDate
			? bookingDate.toDateString() === new Date(selectedDate).toDateString()
			: true;
	
		// Apply selected table filter if set
		const matchesTable = selectedTable
			? booking.tableId?.number?.toString() === selectedTable
			: true;
	
		// Apply filterBy option (today or thisWeek) if set
		let matchesFilter = true;
		if (filterBy === 'today') {
			matchesFilter = bookingDate.toDateString() === today.toDateString();
		} else if (filterBy === 'thisWeek') {
			const oneWeekLater = new Date();
			oneWeekLater.setDate(today.getDate() + 7);
			matchesFilter = bookingDate >= today && bookingDate <= oneWeekLater;
		}
	
		return matchesSearch && matchesDate && matchesTable && matchesFilter;
	});
	

    return (
        <div>
			<AdminNavbar />
            <h1 style={{ marginTop: '30px' }}>Admin Dashboard</h1>
            <input 
                type="text" 
                placeholder="Search by user, table, or game" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
            />
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
            />
            <select onChange={(e) => setSelectedTable(e.target.value)} value={selectedTable}>
                <option value="">All Tables</option>
                {tables.map(table => (
                    <option key={table._id} value={table.number}>Table {table.number}</option>
                ))}
            </select>
            <select onChange={(e) => setFilterBy(e.target.value)} value={filterBy}>
                <option value="all">All Upcoming</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
            </select>
            <h2>Upcoming Bookings</h2>
            <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Start Time</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>End Time</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Table</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Game</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Phone</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Players</th>
						<th style={{ border: '1px solid black', padding: '8px' }}>Payment Status</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}> </th>
						<th style={{ border: '1px solid black', padding: '8px' }}> </th>

                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking) => (
                        <tr key={booking._id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.date).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.startTime).toLocaleTimeString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(booking.endTime).toLocaleTimeString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{booking.tableId ? booking.tableId.number : 'No Table Assigned'}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{booking.gameId ? booking.gameId.title : ' '}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {booking.userId ? 
                                    <a href={`/admin/users/${booking.userId._id}`}>{booking.userId.name}</a> 
                                    : booking.contactName || 'Guest'}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{booking.userId ? booking.userId.phone : booking.contactPhone || 'No Phone'}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{booking.players}</td>
							<td style={{
								border: '1px solid black', 
								padding: '8px', 
								color: booking.paymentId?.status === 'completed' ? 'green' : 'red'
							}}>
								{booking.paymentId ? (
									<>
										<span>{booking.paymentId.status.toUpperCase()}</span>
										<br />
										<small>{booking.paymentId.paymentMethod} - ${booking.paymentId.amount}</small>
									</>
								) : 'No Payment'}
							</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(booking._id)}>Edit</button>
							</td>
							<td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleDelete(booking._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
