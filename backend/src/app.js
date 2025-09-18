const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { csrfMiddleware, publishCsrfToken } = require('../middleware/csrf');

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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-XSRF-TOKEN'],
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json());

if (process.env.USE_COOKIE_AUTH === 'true') {
  app.use(csrfMiddleware);
  app.get('/csrf-token', publishCsrfToken);
}

app.get('/health', (req, res) => { //Only for waking up backend for render
    res.status(200).send('OK');
  });

app.use('/', routes);
app.use(errorHandler);

module.exports = app;
