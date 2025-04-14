const express = require("express");
const router = express.Router();
const { sendContactFormEmail, sendPaymentConfirmationEmail } = require('../controllers/contactController');
const { contactFormValidation, paymentConfirmationValidation } = require('../utils/emailValidation');
const validateInputs = require('../middleware/validateInputs');

router.post("/send-payment-confirmation-email", paymentConfirmationValidation, validateInputs, sendPaymentConfirmationEmail);
router.post("/send-email", contactFormValidation, validateInputs, sendContactFormEmail);

module.exports = router;
