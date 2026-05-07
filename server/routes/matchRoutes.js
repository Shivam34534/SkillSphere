import express from 'express';
import { 
  createMatchRequest, 
  getMyMatches, 
  respondToMatch, 
  completeMatch, 
  getUserMatches,
  getMatchSuggestions,
  getBarterHistory,
  getPublicRequests,
  claimMatchRequest
} from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMatchRequest)
  .get(protect, getMyMatches);

router.get('/suggestions', protect, getMatchSuggestions);
router.get('/history', protect, getBarterHistory);
router.post('/:id/respond', protect, respondToMatch);
router.post('/:id/complete', protect, completeMatch);
router.get('/user-history/:id', getUserMatches);
router.get('/public', protect, getPublicRequests);
router.post('/:id/claim', protect, claimMatchRequest);

export default router;
