import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Swal from '../../utils/swalWithFont';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
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
                let bookingsResponse;
                if (filterBy === 'past') {
                    bookingsResponse = await API.get('/admin/past-bookings');
                } else {
                    bookingsResponse = await API.get('/admin/upcoming-bookings');
                }
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
    }, [navigate, filterBy]);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <CircularProgress size="3rem" thickness={5} color="inherit" />
            </div>
        );
    }
    if (error) return <div>{error}</div>;

    const handleEdit = (id) => {
        navigate(`/admin/edit-booking/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: t('adminDashboard.deleteConfirm.title'),
                text: t('adminDashboard.deleteConfirm.text'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: t('adminDashboard.deleteConfirm.confirmButton'),
                cancelButtonText: t('adminDashboard.deleteConfirm.cancelButton')
            });

            if (!result.isConfirmed) return;

            await API.delete(`/admin/bookings/${id}`);
            setUpcomingBookings(prev => prev.filter(booking => booking._id !== id));

            await Swal.fire({
                icon: 'success',
                title: t('adminDashboard.deleteSuccess.title'),
                text: t('adminDashboard.deleteSuccess.text'),
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting booking:', error);

            await Swal.fire({
                icon: 'error',
                title: t('adminDashboard.deleteError.title'),
                text: t('adminDashboard.deleteError.text')
            });
        }
    };

    const filteredBookings = upcomingBookings.filter(booking => {
        // Check the search filter
        const matchesSearch = booking.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.contactName?.toLowerCase().includes(search.toLowerCase()) ||
            booking.userId?.phone?.toLowerCase().includes(search.toLowerCase()) ||
            booking.contactPhone?.toLowerCase().includes(search.toLowerCase()) ||
            booking.tableId?.number?.toString().includes(search) ||
            booking.game?.toLowerCase().includes(search.toLowerCase());

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
            <div className="admin-section-wrapper">

                <h1 className="admin-section-title">
                    {t(`adminDashboard.pageTitle.${filterBy === 'past' ? 'past' : 'upcoming'}`)}
                </h1>
                <div className="flex flex-wrap gap-4 mb-6 pt-5">
                    <input
                        type="text"
                        placeholder={t('adminDashboard.searchPlaceholder')}
                        className="border px-4 py-2 rounded-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="date"
                        className="border px-4 py-2 rounded-md"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="border px-4 py-2 rounded-md w-48"
                    >
                        <option value="" className='text-center'>{t('adminDashboard.tableFilter.allTables')}</option>
                        {tables.map(table => (
                            <option key={table._id} value={table.number}>{t('adminDashboard.tableFilter.table')} {table.number}</option>
                        ))}
                    </select>
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="border px-4 py-2 rounded-md w-48"
                    >
                        <option className='text-center' value="all">{t('adminDashboard.filter.all')}</option>
                        <option className='text-center' value="today">{t('adminDashboard.filter.today')}</option>
                        <option className='text-center' value="thisWeek">{t('adminDashboard.filter.thisWeek')}</option>
                        <option className='text-center' value="past">{t('adminDashboard.filter.past')}</option>
                    </select>


                </div>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-gray-300 shadow-sm rounded-md">
                        <thead className="bg-gray-100 text-center">
                            <tr>
                            {["date", "startTime", "endTime", "table", "game", "user", "phone", "players", "paymentStatus", "edit", "delete"].map((key, idx) => (
                                    <th key={idx} className="px-4 py-2 border">{t(`adminDashboard.tableHeader.${key}`)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="admin-section-td">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="admin-section-td">{formatTime(booking.startTime)}</td>
                                    <td className="admin-section-td">{formatTime(booking.endTime)}</td>
                                    <td className="admin-section-td">{booking.tableId?.number || t('adminDashboard.noTableAssigned')}</td>
                                    <td className="admin-section-td">{booking.game || '-'}</td>
                                    <td className="admin-section-td">
                                        {booking.userId?.name || booking.contactName || t('adminDashboard.guest')}
                                        {booking.userId?.name && booking.contactName && booking.contactName !== booking.userId.name && (
                                            <> (for {booking.contactName})</>
                                        )}
                                    </td>
                                    <td className="admin-section-td">{booking.userId?.phone || booking.contactPhone || t('adminDashboard.noPhone')}</td>
                                    <td className="admin-section-td">{booking.players}</td>
                                    <td className={`admin-section-td ${booking.paymentId?.status === 'completed' ? 'text-green-600' : 'text-gray-500 '}`}>
                                        {booking.paymentId ? (
                                            <>
                                                <span className="font-semibold uppercase">
                                                    {t(`adminDashboard.paymentStatus.${booking.paymentId.status}`)}
                                                </span>
                                                <br />
                                                <small>{booking.paymentId.paymentMethod} - ${booking.paymentId.amount}</small>
                                            </>
                                        ) : t('adminDashboard.noPayment')}
                                    </td>
                                    <td className="admin-section-td">
                                        <button
                                            onClick={() => handleEdit(booking._id)}
                                            className="admin-button-edit"
                                        >
                                            {t('adminDashboard.tableHeader.edit')}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => handleDelete(booking._id)}
                                            className="admin-button-cancle-delete"
                                        >
                                            {t('adminDashboard.tableHeader.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
