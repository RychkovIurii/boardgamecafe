const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './back.env' });
const routes = require('../routes');
const app = express();
const errorHandler = require('../middleware/errorHandler');

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/', routes);
app.use(errorHandler);

module.exports = app;
