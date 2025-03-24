//Start the server and connect to MongoDB

const app = require('./app');
const connectDB = require('../config/db');

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
	console.error('Server error:', err);
});
