const { validateOverlappingBookings } = require('../utils/validateOverlappingBookings');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

describe('validateOverlappingBookings', () => {
    test('rejects overlapping booking', async () => {
        const tableId = "679b55131b5b9256a1458cf4";
        const startUTCtime = new Date("2025-03-21T16:00:00Z");
        const endUTCtime = new Date("2025-03-21T17:00:00Z");

        await Booking.create({
            tableId,
            date: startUTCtime,
            startTime: startUTCtime,
            endTime: endUTCtime,
            players: 4,
            contactName: "John Doe",
            contactPhone: "+358466554400"
        });

        const hasOverlap = await validateOverlappingBookings(tableId, startUTCtime, endUTCtime);
        expect(hasOverlap).toBe(true);
    });

    test('allows non-overlapping booking', async () => {
        const tableId = "679b55131b5b9256a1458cf4";
        const startUTCtime = new Date("2025-03-21T18:00:00Z");
        const endUTCtime = new Date("2025-03-21T19:00:00Z");

        await Booking.create({
            tableId,
            date: new Date("2025-03-21T16:00:00Z"),
            startTime: new Date("2025-03-21T16:00:00Z"),
            endTime: new Date("2025-03-21T18:00:00Z"),
            players: 4,
            contactName: "John Doe",
            contactPhone: "+358466554400"
        });

        const hasOverlap = await validateOverlappingBookings(tableId, startUTCtime, endUTCtime);
        expect(hasOverlap).toBe(false);
    });

    test('allows non-overlapping booking with different times', async () => {
        const tableId = "679b55131b5b9256a1458cf4";
        const startUTCtime = new Date("2025-03-21T19:00:00Z");
        const endUTCtime = new Date("2025-03-21T20:00:00Z");

        await Booking.create({
            tableId,
            date: new Date("2025-03-21T16:00:00Z"),
            startTime: new Date("2025-03-21T16:00:00Z"),
            endTime: new Date("2025-03-21T17:00:00Z"),
            players: 4,
            contactName: "John Doe",
            contactPhone: "+358466554400"
        });

        const hasOverlap = await validateOverlappingBookings(tableId, startUTCtime, endUTCtime);
        expect(hasOverlap).toBe(false);
    });

    test('rejects overlapping booking with different times', async () => {
        const tableId = "679b55131b5b9256a1458cf4";
        const startUTCtime = new Date("2025-03-21T19:00:00Z");
        const endUTCtime = new Date("2025-03-21T23:00:00Z");

        await Booking.create({
            tableId,
            date: new Date("2025-03-21T20:00:00Z"),
            startTime: new Date("2025-03-21T20:00:00Z"),
            endTime: new Date("2025-03-21T21:00:00Z"),
            players: 4,
            contactName: "John Doe",
            contactPhone: "+358466554400"
        });

        const hasOverlap = await validateOverlappingBookings(tableId, startUTCtime, endUTCtime);
        expect(hasOverlap).toBe(true);
    });
});
