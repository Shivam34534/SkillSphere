import express from 'express';
import { getMyTransactions, transferCredits, getWalletSummary } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyTransactions);
router.post('/transfer', protect, transferCredits);
router.get('/summary', protect, getWalletSummary);

export default router;
