import dotenv from 'dotenv';

dotenv.config();

/**
 * Send an email using SendGrid HTTP API (bypasses Render SMTP block)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject
          }
        ],
        // MUST match the exact email you verified on SendGrid
        from: {
          email: process.env.EMAIL_USER, 
          name: 'SkillSphere'
        },
        content: [
          {
            type: 'text/html',
            value: html
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid Error Response:', errorText);
      throw new Error(`SendGrid API Error: ${response.status} ${errorText}`);
    }

    console.log('Message sent successfully via SendGrid API');
    return { success: true };
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    throw error;
  }
};
