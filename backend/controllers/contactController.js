const nodemailer = require('nodemailer');
const User = require('../models/User');

// Function to handle sending email when the contact form is submitted
const sendContactFormEmail = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  // console.log(req.body)

  // Create a transporter using Gmail service
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_APP_PASS,
    },
  });

  // Define email options
  let mailOptions = {
    from: email,  // Sender's email address (user's email)
    to: process.env.CONTACT_EMAIL,  // Receiver's email address (admin's email)
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,  // Subject
    text: `Message from: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,  // Email body text
  };


  try {
    // Attempt to send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully!' });  // Send success response
  } catch (error) {
    // Handle errors during email sending
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Error sending email' });  // Send failure response
  }
};

const sendPaymentConfirmationEmail = async (req, res) => {
    const { email } = req.body;
  
    try {
        let userName = "Customer";
    
        // Try to look up the user for personalization.
        // If the user doesn't exist, we default to "Customer".
        try {
          const user = await User.findOne({ email });
          if (user && user.name) {
            userName = user.name;
          }
        } catch (userErr) {
          console.warn('User lookup failed, using default name', userErr);
        }
    
        // Create the transporter using Gmail settings.
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.CONTACT_EMAIL,
            pass: process.env.CONTACT_APP_PASS,
          },
        });
    
        let mailOptions = {
          from: process.env.CONTACT_EMAIL,
          to: email,
          subject: 'Payment Confirmation - BoardGameCafe',
          text: `Hello ${userName},\n\nThank you for your payment. Your transaction has been successfully processed.\n\nBest regards,\nBoardGameCafe Team`
        };
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Confirmation email sent successfully' });
      } catch (error) {
        console.error('Error sending payment confirmation email:', error);
        res.status(500).json({ message: 'Failed to send confirmation email' });
      }
    };
  

module.exports = { sendContactFormEmail, sendPaymentConfirmationEmail };  // Export the function to be used in routes
