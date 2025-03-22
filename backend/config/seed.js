const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Game = require('../models/Game');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Table = require('../models/Table');
const Event = require('../models/Event');
const { WorkingHours, SpecialHours } = require('../models/WorkingHours');
const moment = require('moment-timezone');

dotenv.config({ path: './back.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedUsers = [
    {
        name: 'User',
        email: 'user@example.com',
        password: 'user',
        phone: '1234567890',
        role: 'user',
    },
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        phone: '0987654321',
        role: 'admin',
    },
];

const seedTables = [
    { number: 1, capacity: 2, location: "ground" },
    { number: 2, capacity: 2, location: "ground" },
    { number: 3, capacity: 6, location: "ground" },
    { number: 4, capacity: 5, location: "ground" },
    { number: 5, capacity: 5, location: "ground" },
    { number: 6, capacity: 6, location: "ground" },
    { number: 7, capacity: 8, location: "ground" },
    { number: 8, capacity: 8, location: "ground" },
    { number: 9, capacity: 2, location: "ground" },
    { number: 10, capacity: 2, location: "ground" },
    { number: 11, capacity: 2, location: "ground" },
    { number: 12, capacity: 4, location: "upstairs" },
    { number: 13, capacity: 4, location: "upstairs" },
    { number: 14, capacity: 4, location: "upstairs" },
    { number: 15, capacity: 4, location: "upstairs" },
    { number: 16, capacity: 4, location: "upstairs" },
    { number: 17, capacity: 10, location: "upstairs" },
    { number: 18, capacity: 2, location: "upstairs" },
    { number: 19, capacity: 4, location: "upstairs" },
    { number: 20, capacity: 4, location: "upstairs" },
    { number: 21, capacity: 4, location: "upstairs" },
    { number: 22, capacity: 2, location: "upstairs" },
    { number: 23, capacity: 8, location: "upstairs" },
    { number: 24, capacity: 4, location: "terrace" },
    { number: 25, capacity: 8, location: "terrace" },
    { number: 26, capacity: 8, location: "terrace" },
    { number: 27, capacity: 4, location: "terrace" }
];

const seedEvents = [
	{
	  title: 'Miniature Painting Workshop',
	  description: 'Learn new techniques for painting miniatures. Paints and brushes provided. Bring your own miniatures!',
	  date: new Date('2025-04-25T18:00:00'),
	  image: 'https://taverncraftstudios.com/cdn/shop/articles/q_a_how_to_print_3d_resin_miniatures.jpg?v=1700578830&width=1100'
	},
	{
	  title: 'Dungeon Master Workshop',
	  description: 'Master the art of game mastering with experienced GMs. Learn to create engaging campaigns for your players.',
	  date: new Date('2025-05-05T16:00:00'),
	  image: 'https://www.estywaygaming.com/cdn/shop/products/dungeonmaster.png?v=1706421135'
	},
	{
	  title: 'Murder Mystery Night',
	  description: 'Solve a thrilling murder mystery while enjoying drinks and snacks. Can you find the killer?',
	  date: new Date('2025-03-14T19:30:00'),
	  image: 'https://murdermysteryevents.com/wp-content/uploads/2023/08/What-is-Murder-Mystery.jpg'
	}
  ];

const seedBookings = [
    {
        date: new Date("2025-04-07T10:33:30.922Z"),
        startTime: moment.tz("2025-01-31 16:00", "Europe/Helsinki").toDate(),
        endTime: moment.tz("2025-01-31 18:00", "Europe/Helsinki").toDate(),
        tableId: null, // This will be updated after tables are seeded
        players: 3,
        contactName: 'Charlie',
        contactPhone: '1122334455',
    },
    {
        date: new Date("2025-04-07T10:33:30.922Z"),
        startTime: moment.tz("2025-01-31 18:00", "Europe/Helsinki").toDate(),
        endTime: moment.tz("2025-01-31 21:00", "Europe/Helsinki").toDate(),
        tableId: null, // This will be updated after tables are seeded
        players: 5,
        userId: null, // This will be updated after users are seeded
        game: 'Monopoly',
    },
];

const seedPayments = [
    {
        bookingId: null, // This will be updated after bookings are seeded
        amount: 50.00,
        status: 'completed',
        paymentMethod: 'card',
        transactionId: 'txn_1234567890',
        stripePaymentIntentId: 'pi_1234567890',
        stripeCustomerId: 'cus_1234567890',
    },
    {
        bookingId: null, // This will be updated after bookings are seeded
        amount: 75.00,
        status: 'pending',
        paymentMethod: 'eps',
        transactionId: 'txn_0987654321',
        stripePaymentIntentId: 'pi_0987654321',
        stripeCustomerId: 'cus_0987654321',
    },
];

const parseTime = (time) => {
    return time ? time : null; // Keep null for closed days
};

const workingHoursData = [
    { day: 'Monday', openTime: parseTime('16:00'), closeTime: parseTime('24:00') },
    { day: 'Tuesday', openTime: parseTime('16:00'), closeTime: parseTime('24:00') },
    { day: 'Wednesday', openTime: parseTime('16:00'), closeTime: parseTime('24:00') },
    { day: 'Thursday', openTime: parseTime('16:00'), closeTime: parseTime('24:00') },
    { day: 'Friday', openTime: parseTime('16:00'), closeTime: parseTime('02:00') },
    { day: 'Saturday', openTime: parseTime('14:00'), closeTime: parseTime('02:00') },
    { day: 'Sunday', openTime: null, closeTime: null }, // Closed
];

const specialHoursData = [
    { date: new Date('2025-12-25'), openTime: null, closeTime: null, reason: 'Christmas Holiday' },
    { date: new Date('2025-12-31'), openTime: '18:00', closeTime: '03:00', reason: 'New Year’s Eve' }
];

const importData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Game.deleteMany();
        await Booking.deleteMany();
        await Payment.deleteMany();
        await Table.deleteMany();
		await Event.deleteMany();
		await WorkingHours.deleteMany();
		await SpecialHours.deleteMany();

        const createdUsers = await Promise.all(seedUsers.map(user => User.create(user)));
        const createdTables = await Table.insertMany(seedTables);

        seedBookings[0].userId = createdUsers[0]._id;
        seedBookings[1].userId = createdUsers[1]._id;
        seedBookings[0].tableId = createdTables[0]._id;
        seedBookings[1].tableId = createdTables[1]._id;

        const updatedBookings = seedBookings.map((booking, index) => ({
			...booking,
			tableId: createdTables[index % createdTables.length]._id, // Assign tableIds properly
		}));
		
		const createdBookings = await Booking.insertMany(updatedBookings);

        const updatedPayments = seedPayments.map((payment, index) => {
			if (createdBookings[index]) {
				return { ...payment, bookingId: createdBookings[index]._id };
			}
			return null;
		}).filter(Boolean);
		
		const createdPayments = updatedPayments.length > 0 ? await Payment.insertMany(updatedPayments) : [];
		
		createdBookings.forEach((booking, index) => {
			const payment = createdPayments.find(p => p.bookingId.toString() === booking._id.toString());
			if (payment) {
				booking.paymentId = payment._id; // ✅ Assign paymentId
			}
		});
		
		await Promise.all(createdBookings.map(booking => Booking.findByIdAndUpdate(booking._id, { paymentId: booking.paymentId })));

		await Event.insertMany(seedEvents);
		await WorkingHours.insertMany(workingHoursData);
		await SpecialHours.insertMany(specialHoursData);
		

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error('Error seeding the database:', error.message);
        process.exit(1);
    } finally {
        mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

importData();
