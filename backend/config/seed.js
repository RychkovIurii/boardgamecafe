const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Game = require('../models/Game');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Table = require('../models/Table');
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

const seedGames = [
    {
        title: 'Catan',
        genre: 'Strategy',
        minPlayers: 3,
        maxPlayers: 4,
        availability: true,
        copies: 3,
    },
    {
        title: 'Monopoly',
        genre: 'Family',
        minPlayers: 2,
        maxPlayers: 6,
        availability: true,
        copies: 5,
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
        gameId: null, // This will be updated after games are seeded
    },
];

const seedPayments = [
    {
        bookingId: null, // This will be updated after bookings are seeded
        amount: 50.00,
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'txn_1234567890',
        stripePaymentIntentId: 'pi_1234567890',
        stripeCustomerId: 'cus_1234567890',
    },
    {
        bookingId: null, // This will be updated after bookings are seeded
        amount: 75.00,
        status: 'pending',
        paymentMethod: 'paypal',
        transactionId: 'txn_0987654321',
        stripePaymentIntentId: 'pi_0987654321',
        stripeCustomerId: 'cus_0987654321',
    },
];

const importData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Game.deleteMany();
        await Booking.deleteMany();
        await Payment.deleteMany();
        await Table.deleteMany();

        const createdUsers = await Promise.all(seedUsers.map(user => User.create(user)));
        const createdGames = await Game.insertMany(seedGames);
        const createdTables = await Table.insertMany(seedTables);

        seedBookings[0].userId = createdUsers[0]._id;
        seedBookings[1].userId = createdUsers[1]._id;
        seedBookings[0].gameId = createdGames[0]._id;
        seedBookings[1].gameId = createdGames[1]._id;
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
