import express from 'express';
import { postReview, reportUser, getReviewsForUser } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, postReview);
router.post('/report', protect, reportUser);
router.get('/user/:id', getReviewsForUser);

export default router;
