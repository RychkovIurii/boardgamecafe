const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './back.env' });
const routes = require('../routes');
const app = express();
const errorHandler = require('../middleware/errorHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json());

app.get('/health', (req, res) => { //Only for waking up backend for render
    res.status(200).send('OK');
  });

app.use('/', routes);
app.use(errorHandler);

module.exports = app;
