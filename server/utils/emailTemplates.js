/**
 * SkillSphere Email Templates
 */

const baseStyle = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
`;

const headerStyle = `
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: white;
  padding: 30px;
  text-align: center;
`;

const bodyStyle = `
  padding: 30px;
  background: #ffffff;
`;

const footerStyle = `
  background: #f9fafb;
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
`;

const buttonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #4F46E5;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 20px;
`;

/**
 * OTP Email Template
 */
export const otpTemplate = (otp) => `
  <div style="${baseStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0;">Verify Your Email 🔐</h1>
    </div>
    <div style="${bodyStyle}">
      <p>Hi there,</p>
      <p>Thank you for registering with SkillSphere! Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5;">
        ${otp}
      </div>
      <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
    </div>
    <div style="${footerStyle}">
      <p>&copy; 2026 SkillSphere Campus Marketplace. All rights reserved.</p>
    </div>
  </div>
`;

/**
 * Welcome Email Template
 */
export const welcomeTemplate = (name) => `
  <div style="${baseStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0;">Welcome to SkillSphere! 🚀</h1>
    </div>
    <div style="${bodyStyle}">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We're thrilled to have you join the SkillSphere community! You've just unlocked a world of campus opportunities where you can learn, earn, and collaborate with your peers.</p>
      <p>Get started by completing your profile and browsing available gigs in the marketplace.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="${buttonStyle}">Explore Dashboard</a>
      <p style="margin-top: 30px;">Happy collaborating,<br>The SkillSphere Team</p>
    </div>
    <div style="${footerStyle}">
      <p>&copy; 2026 SkillSphere Campus Marketplace. All rights reserved.</p>
    </div>
  </div>
`;

/**
 * Gig Application Notification Template
 */
export const gigApplicationTemplate = (freelancerName, gigTitle) => `
  <div style="${baseStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0;">New Application! 📄</h1>
    </div>
    <div style="${bodyStyle}">
      <p>Hi there,</p>
      <p>Great news! <strong>${freelancerName}</strong> has just applied for your gig: <strong>"${gigTitle}"</strong>.</p>
      <p>Head over to your dashboard to review the proposal and start collaborating.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard/my-gigs" style="${buttonStyle}">Review Proposals</a>
      <p style="margin-top: 30px;">Best regards,<br>The SkillSphere Team</p>
    </div>
    <div style="${footerStyle}">
      <p>&copy; 2026 SkillSphere Campus Marketplace. All rights reserved.</p>
    </div>
  </div>
`;

/**
 * Payment Received Template
 */
export const paymentReceivedTemplate = (amount, gigTitle) => `
  <div style="${baseStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0;">Payment Released! 💰</h1>
    </div>
    <div style="${bodyStyle}">
      <p>Hi there,</p>
      <p>The payment for your work on <strong>"${gigTitle}"</strong> has been released to your wallet.</p>
      <h2 style="color: #10b981;">Amount: ${amount} Credits</h2>
      <p>Thank you for being a part of the SkillSphere economy. Your expertise is what makes this community great!</p>
      <a href="${process.env.FRONTEND_URL}/wallet" style="${buttonStyle}">View Wallet</a>
    </div>
    <div style="${footerStyle}">
      <p>&copy; 2026 SkillSphere Campus Marketplace. All rights reserved.</p>
    </div>
  </div>
`;
