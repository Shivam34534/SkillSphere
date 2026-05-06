import express from 'express';
import { getUserProfile, updateUserProfile, getPublicProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/:id', getPublicProfile);

export default router;
