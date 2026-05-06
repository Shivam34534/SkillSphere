import express from 'express';
import { registerUser, loginUser, verifyOTP, forgotPassword, resetPassword } from '../controllers/authController.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/test-email', async (req, res) => {
  try {
    await sendEmail(process.env.EMAIL_USER, 'SkillSphere SMTP Test', '<h1>It Works! 🚀</h1><p>If you see this, your email settings are correct.</p>');
    res.json({ message: 'Test email sent successfully to your own address!' });
  } catch (error) {
    res.status(500).json({ message: 'Email test failed', error: error.message });
  }
});

export default router;
