import express from 'express';
import { verifyUser, getSystemStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/verify-user/:id', protect, admin, verifyUser);
router.get('/stats', protect, admin, getSystemStats);

export default router;
