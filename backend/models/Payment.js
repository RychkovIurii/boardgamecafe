const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', // References the Booking model
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bancontact', 'eps', 'klarna'],
        required: [true, 'Payment method is required'],
    },
    transactionId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        unique: true,
    },
	stripePaymentIntentId: {
        type: String,
        required: [true, 'Stripe Payment Intent ID is required'],
        unique: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
