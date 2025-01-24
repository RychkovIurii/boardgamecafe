//Set up the main Express application

const express = require('express');
const dotenv = require('dotenv');
const routes = require('../routes');
const cors = require('cors');

dotenv.config({ path: './back.env' });

const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow only specific frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies or Authorization headers
}));

app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api', routes);

module.exports = app;
