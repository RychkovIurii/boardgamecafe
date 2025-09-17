const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const MenuItem = require('../models/MenuItem');

const envPath = path.resolve(__dirname, '..', 'back.env');
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	dotenv.config();
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importMenuData = async () => {
    try {
        await connectDB();

        const existingCount = await MenuItem.estimatedDocumentCount();
        if (existingCount > 0) {
		console.log('Menu already seeded, skipping import.');
		return;
	}

        const menuData = require('./menuData');
	await MenuItem.insertMany(menuData);

        console.log('Menu Data Imported!');
    } catch (error) {
        console.error('Error seeding the database:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

importMenuData();
