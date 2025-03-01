import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';

const transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  // port: 465,
  // secure: true,
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
});


const createConfirmationEmail = (userEmail, confirmationLink, userName) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: userEmail,
    subject: 'Confirm Your Account',
    html: emailTemplate(confirmationLink, userName)
  };

  return mailOptions
}

export const sendConfirmationEmail = async (userEmail, confirmationLink, userName) => {
  try {
    const mailOptions = createConfirmationEmail(userEmail, confirmationLink, userName)
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return true
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false
  }
}

