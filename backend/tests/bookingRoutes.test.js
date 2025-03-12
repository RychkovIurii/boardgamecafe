const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Booking = require('../models/Booking');
const moment = require('moment-timezone');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await Booking.deleteMany();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /bookings', () => {
    test("rejects booking starting after 23:30", async () => {
		const response = await request(app)
			.post("/bookings")
			.send({
				date: "2025-03-21",
				startTime: "23:35", // Now correctly rejected
				duration: 60,
				tableNumber: "20",
				players: 4,
				gameId: "679b55131b5b9256a1458cf1",
				userId: "679b55131b5b9256a1458ced",
				contactName: "John Doe",
				contactPhone: "123-456-7890",
			});
	
		expect(response.status).toBe(400);
		expect(response.body.message).toBe(
			"Last booking shift is at 23:30. Please choose an earlier start time."
		);
	});
});
