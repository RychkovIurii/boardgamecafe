## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone the repository (**ONLY for collaborators**):
	```sh
	git clone git@github.com:RychkovIurii/boardgamecafe.git
	cd boardgamecafe/backend
	```

2. Clone the repository (**for users**):
	```sh
	git clone https://github.com/RychkovIurii/boardgamecafe.git
	cd boardgamecafe/backend
	```

3. Install dependencies:
	```sh
	npm install
	```

4. Use `back.env.example` file in the `backend` directory, remove ".example" and add your environment variables:
	```env
	MONGODB_URI=your_mongodb_uri
	```

### Database Setup
1. Seed the database (optional):
	```sh
	npm run seed
	```

### Running the Application
1. Start the server:
	```sh
	npm start
	```

2. The server will be running at `http://localhost:your_port`


### Project Structure

backend/  
├── config/  
│   ├── db.js            # Database connection setup  
│   ├── seed.js          # Database seeding script  
├── models/  
│   ├── Booking.js       # Mongoose schema for bookings  
│   ├── Game.js          # Mongoose schema for games  
│   └── User.js          # (Optional) Schema for user accounts  
├── routes/  
│   ├── bookings.js      # Routes related to bookings  
│   ├── games.js         # Routes related to games  
│   └── index.js         # Aggregates all routes  
├── controllers/  
│   ├── bookingsController.js  # Logic for booking operations  
│   ├── gamesController.js     # Logic for game operations  
│   └── usersController.js     # Logic for user operations  
├── middlewares/  
│   ├── validate.js      # Input validation middleware  
│   └── errorHandler.js  # Global error handling middleware  
├── src/  
│   ├── app.js               # Main Express application setup  
│   └── server.js            # Starts the server  
├── utils/  
│   ├── logger.js        # Logging utility  
│   └── helpers.js       # Helper functions  
├── .env                 # Environment variables  
└── package.json         # Project dependencies  
