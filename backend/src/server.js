const app = require('./app');
const connectDB = require('../config/db');

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("JWT_SECRET: ", process.env.JWT_SECRET)
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
