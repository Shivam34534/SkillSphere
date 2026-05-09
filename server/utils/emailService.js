import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';


dotenv.config();

/**
 * Reusable Email Service
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // Use TLS (true for 465, false for 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // Reduced for faster failure feedback
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[EMAIL-SERVICE] Connection Error:', error.message);
  } else {
    console.log('[EMAIL-SERVICE] Server is ready to deliver messages');
  }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SkillSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
