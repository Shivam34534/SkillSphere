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
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT == '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Professional SMTP settings
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  tls: {
    rejectUnauthorized: false
  },
  // Critical for cloud environments (Render/Railway)
  family: 4,
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4, verbatim: false }, (err, address, family) => {
      if (err) return callback(err);
      console.log(`[EMAIL-SERVICE] DNS Resolved ${hostname} -> ${address}`);
      callback(null, address, family);
    });
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000
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
