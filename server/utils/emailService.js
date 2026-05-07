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
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: 465, // Explicitly try 465 with secure: true
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  // Aggressive IPv4 forcing is still key
  family: 4,
  localAddress: '0.0.0.0', 
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4, verbatim: false }, (err, address, family) => {
      if (err) return callback(err);
      console.log(`[SMTP DNS] Resolved ${hostname} to ${address} (family: ${family})`);
      callback(null, address, family);
    });
  },
  logger: true,
  debug: true,
  connectionTimeout: 40000,
  greetingTimeout: 40000,
  socketTimeout: 60000
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
