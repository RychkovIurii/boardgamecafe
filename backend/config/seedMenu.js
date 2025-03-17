const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');

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

const importMenuData = async () => {
    try {
        await connectDB();

        await MenuItem.deleteMany();

        const { menuData } = await import('../../frontend/cafe-front/assets/image_assets/menuData.js');

		await MenuItem.insertMany(menuData);

        console.log('Menu Data Imported!');
        process.exit();
    } catch (error) {
        console.error('Error seeding the database:', error.message);
        process.exit(1);
    } finally {
        mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

importMenuData();
