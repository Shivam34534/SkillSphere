import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';

// Force IPv4 as priority for all network connections (Fixes Render/Gmail ENETUNREACH)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

/**
 * Reusable Email Service
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  // CRITICAL: This is the ONLY way Gmail works on Render
  family: 4,
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4, verbatim: false }, (err, address, family) => {
      if (err) return callback(err);
      callback(null, address, family);
    });
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 45000
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
