jest.setTimeout(30000);
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
process.env.USE_COOKIE_AUTH = process.env.USE_COOKIE_AUTH || 'false';
