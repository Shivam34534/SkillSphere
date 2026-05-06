import express from 'express';
import { createMatchRequest, getMyMatches, respondToMatch, completeMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMatchRequest)
  .get(protect, getMyMatches);

router.post('/:id/respond', protect, respondToMatch);
router.post('/:id/complete', protect, completeMatch);

export default router;
