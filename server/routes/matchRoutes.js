import express from 'express';
import { createMatchRequest, getMyMatches, respondToMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMatchRequest)
  .get(protect, getMyMatches);

router.post('/:id/respond', protect, respondToMatch);

export default router;
