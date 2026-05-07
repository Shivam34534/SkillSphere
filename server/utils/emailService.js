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
  pool: true,
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT == '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    // Add ciphers to help with some cloud environment restrictions
    ciphers: 'SSLv3'
  },
  // Keep the IPv4 forcing which is critical for Render/Gmail connectivity
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
  family: 4, 
  logger: true,
  debug: true,
  connectionTimeout: 30000, // Increase timeouts for slow cloud networks
  greetingTimeout: 30000,
  socketTimeout: 45000
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
