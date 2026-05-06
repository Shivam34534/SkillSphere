import express from 'express';
import { 
  verifyUser, 
  getSystemStats, 
  getAllUsers, 
  updateUserStatus, 
  getAllReports, 
  resolveReport, 
  moderateGig 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getSystemStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.put('/verify-user/:id', protect, admin, verifyUser);
router.get('/reports', protect, admin, getAllReports);
router.put('/reports/:id/resolve', protect, admin, resolveReport);
router.put('/gigs/:id/moderate', protect, admin, moderateGig);

export default router;
