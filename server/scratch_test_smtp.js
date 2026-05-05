import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  console.log("Testing SMTP with:", process.env.EMAIL_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP Connection SUCCESSFUL!");
    
    // Try sending a test mail to the same user
    const info = await transporter.sendMail({
      from: `"SkillSphere Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test",
      text: "If you see this, email is working!",
    });
    console.log("Test email sent:", info.messageId);
    process.exit(0);
  } catch (error) {
    console.error("SMTP Connection FAILED:", error);
    process.exit(1);
  }
};

testEmail();
