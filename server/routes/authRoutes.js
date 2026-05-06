import express from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  forgotPassword, 
  verifyResetOTP, 
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Diagnostic route
router.get('/test-health', (req, res) => {
  res.json({ status: 'Auth routes are active', timestamp: new Date() });
});

export default router;
