import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend HTTP API (bypasses Render SMTP block)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: 'SkillSphere <onboarding@resend.dev>', // Free tier requires using this sender
      to,
      subject,
      html,
    });
    console.log('Message sent via Resend API: %s', data.id);
    return data;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
};
