const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const YOUR_DOMAIN = process.env.FRONTEND_URL;

router.post('/create-checkout-session', async (req, res) => {
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
	  });
	
	  res.send({clientSecret: session.client_secret});
	});

router.get('/session-status', async (req, res) => {
	const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
	
	res.send({
		status: session.status,
		customer_email: session.customer_details.email
	});
});

module.exports = router;
