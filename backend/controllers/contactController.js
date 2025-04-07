
const nodemailer = require('nodemailer');

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

module.exports = { sendContactFormEmail };  // Export the function to be used in routes
