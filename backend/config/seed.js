const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Game = require('../models/Game');

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected.');

        // Clear existing data
        await User.deleteMany({});
        await Booking.deleteMany({});
        await Game.deleteMany({});

        // Seed users (admins and regular users)
        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'password123' },
            { name: 'Regular User', email: 'user@example.com', role: 'user', password: 'password123' },
        ]);
        console.log(`${users.length} users seeded.`);

        // Seed games
        const games = await Game.insertMany([
            { title: 'Catan', genre: 'Strategy', players: 4 },
            { title: 'Chess', genre: 'Classic', players: 2 },
        ]);
        console.log(`${games.length} games seeded.`);

        // Seed bookings
        const bookings = await Booking.insertMany([
            { name: 'Alice', date: new Date(), table: 1, gameId: games[0]._id, userId: users[1]._id },
            { name: 'Bob', date: new Date(), table: 2, gameId: games[1]._id, userId: users[1]._id },
        ]);
        console.log(`${bookings.length} bookings seeded.`);
    } catch (error) {
        console.error('Error seeding the database:', error.message);
    } finally {
        mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

seedDatabase();
