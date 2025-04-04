const express = require("express");
const router = express.Router();
const { sendContactFormEmail } = require('../controllers/contactController');



router.post("/send-email", sendContactFormEmail)
module.exports = router;
