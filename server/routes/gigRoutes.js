import express from 'express';
import { createGig, getOpenGigs, applyForGig, hireFreelancer } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createGig)
  .get(getOpenGigs);

router.post('/:id/apply', protect, applyForGig);
router.post('/:id/hire', protect, hireFreelancer);

export default router;
