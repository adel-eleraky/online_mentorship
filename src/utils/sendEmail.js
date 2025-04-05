import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { emailTemplate } from './emailTemplate.js';  // Confirmation Email Template
import { resetPasswordEmailTemplate } from './resetEmailTemplate.js';  // Reset Password Template

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail or another email provider
  auth: {
    user: process.env.NODEMAILER_EMAIL, 
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Allow unauthorized access to the server
  },
});

// Send an email function with dynamic template selection
async function sendEmail(email, subject, url, type = 'confirm', name = 'User') {
  try {
    // Choose the appropriate email template based on the type of email
    const template =
      type === 'reset' ? resetPasswordEmailTemplate(url, name) : emailTemplate(url, name);

    // Send the email using the transporter
    const info = await transporter.sendMail({
      from: process.env.SEND_EMAIL_ADDRESS, // Your sending email address
      to: email, // Receiver's email
      subject: subject, // Email subject
      text: '', // Optional: Add a plain-text version if necessary
      html: template, // The HTML content, dynamically selected
    });

    console.log('📧 Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Error occurred while sending email:', error);
  }
}

export { sendEmail };
