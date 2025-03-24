const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const YOUR_DOMAIN = process.env.FRONTEND_URL;

router.post('/create-checkout-session', async (req, res) => {
	const { bookingId } = req.body;
	const session = await stripe.checkout.sessions.create({
		ui_mode: 'embedded',
		line_items: [
		  {
			// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
			price: 'price_1R5PzKANeM0unLcDdaZLfICh',
			quantity: 1,
		  },
		],
		mode: 'payment',
		return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
		metadata: {
			bookingId,
		}
	  });
	
	  res.send({clientSecret: session.client_secret});
	});

router.get('/session-status', async (req, res) => {
	try {
		const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
		const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
		const bookingId = session.metadata?.bookingId || null;

		// 🛡 Check if the payment was already saved
		const existingPayment = await Payment.findOne({ stripePaymentIntentId: session.payment_intent });

		if (!existingPayment) {
			const newPayment = await Payment.create({
				bookingId,
				amount: paymentIntent.amount / 100,
				status: session.status === 'complete' ? 'completed' : 'pending',
				paymentMethod: paymentIntent.payment_method_types[0],
				transactionId: session.id,
				stripePaymentIntentId: session.payment_intent
			});

			// 🔗 Link payment to booking
			if (bookingId) {
				await Booking.findByIdAndUpdate(bookingId, {
					paymentId: newPayment._id
				});
			}
		}

		res.send({
			status: session.status,
			customer_email: session.customer_details?.email
		});
	} catch (err) {
		console.error('Error handling session-status:', err);
		res.status(500).send({ error: 'Failed to retrieve session status.' });
	}
});
	

module.exports = router;
