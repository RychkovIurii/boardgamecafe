import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios'
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';


const MyBookings = () => {
    const [bookings, setBookings] = useState({ past: [], upcoming: [] });
	const { user } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editedBooking, setEditedBooking] = useState({
        date: dayjs().format("YYYY-MM-DD"),
        startTime: dayjs().format('HH:mm'),
        duration: 60,
        tableNumber: '',
        players: 1,
    });
    const [filteredTables, setFilteredTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

	const nameRegex = /^[\p{L}\s\-.']+$/u;
	const validDurations = ["60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360", "390", "420", "450", "480", "510", "540", "570", "600"];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('bookings/my-bookings');
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
            Swal.fire({ icon: 'error', title: t('bookingForm.errorTitle'), text: message });
            return;
        }

        setFilteredTables(tables.filter(table => table.capacity === seatLimit));
    }

	const validateEditedBooking = () => {
		const { contactName, contactPhone, players, date, startTime, duration } = editedBooking;
	  
		if (!contactName || !contactPhone || !players || !date || !startTime || !duration) {
		  Swal.fire({
			icon: 'warning',
			title: t('bookingForm.incompleteTitle'),
			text: t('bookingForm.incompleteText')
		  });
		  return false;
		}
	  
		if (!nameRegex.test(contactName)) {
		  Swal.fire({
			icon: 'warning',
			title: t('bookingForm.invalidNameTitle'),
			text: t('bookingForm.invalidNameText')
		  });
		  return false;
		}
	  
		if (!isValidPhoneNumber(contactPhone)) {
			Swal.fire({
				icon: 'warning',
				title: t('bookingForm.invalidPhoneTitle'),
				text: t('bookingForm.invalidPhoneText')
			});
			return false;
		  }
	  
		if (isNaN(players) || players < 1 || players > 10) {
		  Swal.fire({
			icon: 'warning',
			title: t('bookingForm.invalidPlayersTitle'),
			text: t('bookingForm.invalidPlayersText')
		  });
		  return false;
		}
	  
		if (isNaN(duration) || !validDurations.includes(duration.toString())) {
		  Swal.fire({
			icon: 'warning',
			title: t('bookingForm.invalidDurationTitle'),
			text: t('bookingForm.invalidDurationText')
		  });
		  return false;
		}
	  
		return true;
	  };
	  

    const handleEdit = (booking) => {
		setIsEditing(booking._id);
		setEditedBooking({
		  ...booking,
		  date: booking.date,
		  startTime: dayjs(booking.startTime),
		  endTime: dayjs(booking.endTime),
		  duration: booking.duration ?? 60,
		  players: booking.players,
		  tableNumber: booking.tableId.number,
		  contactName: booking.contactName || user?.name,
		  contactPhone: booking.contactPhone || user?.phone,
		});
		checkTableAvailability(booking.players);
	  };

    const handleCancel = () => {
        setIsEditing(null);
        setEditedBooking({
            date: dayjs().format("YYYY-MM-DD"),
            startTime: dayjs().format('HH:mm'),
            duration: 60,
            tableNumber: '',
            players: 1,
            contactName: '',
            contactPhone: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBooking({
            ...editedBooking,
            [name]: name === 'duration' || name === 'players' ? Number(value) : value,
        });
        if (name === 'players') checkTableAvailability(value); // Filter tables when player count changes
		const firstAvailableTable = tables.find(table => table.capacity >= value);
        if (firstAvailableTable) {
            setEditedBooking(prev => ({
                ...prev,
                tableNumber: firstAvailableTable.number,
            }));
        }
    };

    const handleTimeChange = (value) => {
        setEditedBooking({ ...editedBooking, startTime: value });
    };

    const handleSave = async (id) => {
		if (!validateEditedBooking()) {
			return;
		}  
		const selectedTable = tables.find(table => table.number.toString() === editedBooking.tableNumber.toString());
		if (!selectedTable) {
			return Swal.fire({ icon: 'error', title: t('bookingForm.invalidTableTitle'), text: t('bookingForm.invalidTableText') });
		}
		const calculatedEndTime = dayjs(editedBooking.startTime).add(editedBooking.duration, 'minute');
		const bookingDate = dayjs(editedBooking.date).format("YYYY-MM-DD");
        // Create an object for the API (only time parts)
		const formattedBookingForAPI = {
			...editedBooking,
			date: bookingDate,
			startTime: dayjs(editedBooking.startTime).format("HH:mm"),
			endTime: calculatedEndTime.format("HH:mm"),
			duration: editedBooking.duration,
			tableNumber: selectedTable.number,
		};

		const bookingForState = {
			...editedBooking,
			date: bookingDate,
			startTime: `${bookingDate} ${dayjs(editedBooking.startTime).format("HH:mm")}`,
			endTime: `${bookingDate} ${calculatedEndTime.format("HH:mm")}`,
			duration: editedBooking.duration,
			players: editedBooking.players,
			tableId: { ...selectedTable },
			contactName: editedBooking.contactName,
			contactPhone: editedBooking.contactPhone,
		};

        try {
			const response = await API.put(`/bookings/my-bookings/${id}`, formattedBookingForAPI);
			if (response.status === 200) {
				Swal.fire({ icon: 'success', title: t('bookingForm.updateSuccessTitle'), text: t('bookingForm.updateSuccessText') });
				setBookings(prev => ({
					...prev,
					upcoming: prev.upcoming.map(booking =>
						booking._id === id
							? {
								...booking,
								...bookingForState,
								tableId: { ...selectedTable },
							}
							: booking
					),
				}));
	
				setIsEditing(null);
			}
		} catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
				Swal.fire({ icon: 'error', title: t('bookingForm.updateFailedTitle'), text: error.response.data.message });
			} else {
				Swal.fire({ icon: 'error', title: t('bookingForm.updateFailedTitle'), text: t('bookingForm.updateFailedText') });
			}
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: t('bookingForm.deleteConfirmTitle'),
                text: t('bookingForm.deleteConfirmText'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: t('bookingForm.deleteConfirmButton'),
                cancelButtonText: t('bookingForm.cancelButtonText')
            });

            if (!result.isConfirmed) return;

            await API.delete(`/bookings/my-bookings/${id}`);
            setBookings(prev => ({
                past: prev.past.filter(booking => booking._id !== id),
                upcoming: prev.upcoming.filter(booking => booking._id !== id)
            }));

            await Swal.fire({
                icon: 'success',
                title: t('bookingForm.deletedTitle'),
                text: t('bookingForm.deletedText'),
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting booking:', error);

            await Swal.fire({
                icon: 'error',
                title: t('bookingForm.deleteFailedTitle'),
                text: t('bookingForm.deleteFailedText')
            });
        }
    };

    if (loading) {
			return (
				<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
					<CircularProgress size="4rem" thickness={5} color="inherit"/>
				</div>
			);
		};
    return (
        <>
            <Navbar />
            <div className="py-20">
                <h1 className="text-outline text-4xl font-medium text-yellow-500 mt-5 mb-10">{t('myBookings.pageTitle')}</h1>

                <div className='max-w-5xl mx-auto px-4 sm:px-0'>
                    <p className='text-xl pt-7 text-start'>{t('myBookings.upcomingBookings')}</p>
                    <div className='w-full flex flex-wrap pt-5 px-3 gap-5 md:justify-start justify-center '>
                        {bookings.upcoming.length > 0 ? (bookings.upcoming.map((booking) => (
                            <div key={booking._id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border border-gray-400 p-4 rounded-xl flex flex-col text-sm gap-1 shadow-lg bg-white'>

                                {isEditing === booking._id ? (
                                    <>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.dateLabel')} </strong></p>
                                            <input type='date'
                                                min={new Date().toJSON().slice(0, 10)}  // Setting the minimum date to today's date
                                                name="date"
                                                value={dayjs(editedBooking.date).format('YYYY-MM-DD') || ""}  // Make sure to format the date if using dayjs
                                                onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.startTimeLabel')} </strong></p>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker 
													value={dayjs(editedBooking.startTime).isValid() ? editedBooking.startTime : dayjs()}
													onChange={handleTimeChange} 
													timeSteps={{ minutes: 30 }} 
													minutesStep={30} 
													ampm={false} 
                                                    slotProps={{
                                                        textField: {
                                                          fullWidth: true,
                                                          required: true,
                                                        },
                                                     }}/>
                                            </LocalizationProvider>
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.durationLabel')} </strong></p>
                                            <input type="number" name="duration" value={editedBooking.duration || 60} onChange={handleChange} min={60}
                                                step={30} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.playersLabel')} </strong></p>
                                            <input type="number" name="players" value={editedBooking.players} onChange={(e) => handleChange({ target: { name: e.target.name, value: Number(e.target.value) } })} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.tableNumberLabel')} </strong></p>
                                            <select
                                                name="tableNumber"
                                                value={editedBooking.tableNumber}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, tableNumber: e.target.value })}
                                                className="border p-1 rounded"
                                            >
                                                <option value="" disabled>{t('myBookings.selectTable')}</option>
                                                {filteredTables.map(table => (
                                                    <option key={table.number} value={table.number}>
                                                        {table.number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.gameLabel')} </strong></p>
                                            <input type="text" name="game" value={editedBooking.game} onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.contactNameLabel')} </strong></p>
                                            <input type="text" name="contactName" value={editedBooking.contactName} onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>{t('myBookings.contactPhoneLabel')} </strong></p>
                                            <input type="text" name="contactPhone" value={editedBooking.contactPhone} onChange={handleChange} className="border p-1 rounded" />
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleSave(booking._id)} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2">{t('myBookings.saveButton')}</button>
                                            <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2">{t('myBookings.cancelButton')}</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>{t('myBookings.dateLabel')} </strong> {dayjs(booking.date).format('DD/MM/YYYY')}</p>
                                        <p><strong>{t('myBookings.timeLabel')} </strong> 
											{dayjs(booking.startTime).isValid() 
												? dayjs(booking.startTime).format('HH:mm') 
												: booking.startTime} 
											- 
											{dayjs(booking.endTime).isValid() 
												? dayjs(booking.endTime).format('HH:mm') 
												: booking.endTime}
										</p>
                                        <p>{t('myBookings.playersLabel')} {booking.players}</p>
                                        <p>{t('myBookings.tableNumberLabel')} {booking.tableId?.number || 'N/A'}</p>
                                        <p>{t('myBookings.contactLabel')} {booking.contactName}<br /> ({booking.contactPhone})</p>
                                        <div className="mt-3 flex gap-2 justify-center">
                                            <button onClick={() => handleEdit(booking)} className="bg-green-800 w-20 text-white px-1 py-2 rounded-md">{t('myBookings.editButton')}</button>
                                            <button onClick={() => handleDelete(booking._id)} className="bg-gray-700 w-20 text-white px-1 py-2 rounded-md">{t('myBookings.deleteButton')}</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                        ) : (
                            <p>{t('myBookings.noUpcoming')}</p>
                        )}
                    </div>
                </div>

                {/* Repeat for past bookings */}
                <div className='max-w-5xl mx-auto mt-7 px-4 sm:px-0'>
                    <p className='text-xl pt-7 text-start'>{t('myBookings.bookingHistory')}</p>
                    <div className='flex flex-col sm:flex-row m-auto gap-5 pt-5 px-3 sm:px-0'>
                        {bookings.past.length > 0 ? (bookings.past.slice(0, 5).map((booking) => (
                            <div key={booking._id} className=' border border-gray-400 p-4 rounded-xl flex flex-col text-sm gap-1 shadow-lg bg-white'>
                                <p><strong>{t('myBookings.dateLabel')} </strong> {dayjs(booking.date).format('DD/MM/YYYY')}</p>
                                <p><strong>{t('myBookings.timeLabel')} </strong> 
									{dayjs(booking.startTime).isValid() 
										? dayjs(booking.startTime).format('HH:mm') 
										: booking.startTime} 
									- 
									{dayjs(booking.endTime).isValid() 
										? dayjs(booking.endTime).format('HH:mm') 
										: booking.endTime}
								</p>
                                <p>{t('myBookings.playersLabel')} {booking.players}</p>
                                <p>{t('myBookings.tableNumberLabel')} {booking.tableId?.number}</p>
                                <p>{t('myBookings.contactLabel')} {booking.contactName} <br /> ({booking.contactPhone})</p>
                            </div>
                        ))
                        ) : (
                            <p>{t('myBookings.noHistory')}</p>
                        )}
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
};

export default MyBookings;
