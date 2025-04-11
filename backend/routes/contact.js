const express = require("express");
const router = express.Router();
const { sendContactFormEmail, sendPaymentConfirmationEmail } = require('../controllers/contactController');

router.post("/send-payment-confirmation-email", sendPaymentConfirmationEmail);
router.post("/send-email", sendContactFormEmail);

module.exports = router;
