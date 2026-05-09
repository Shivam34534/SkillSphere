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
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  // CRITICAL: Force IPv4 for both the connection and the DNS lookup
  family: 4,
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, (err, address, family) => {
      if (err) return callback(err);
      callback(null, address, family);
    });
  }
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
