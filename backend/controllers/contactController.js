
const nodemailer = require('nodemailer');

// Function to handle sending email when the contact form is submitted
const sendContactFormEmail = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  console.log(req.body)

  // Create a transporter using Gmail service
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'boardgamecafe.varia@gmail.com',
      pass: 'adminVaria123',
    },
  });

  // Define email options
  let mailOptions = {
    from: email,  // Sender's email address (user's email)
    to: 'boardgamecafe.varia@gmail.com',  // Receiver's email address (admin's email)
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
