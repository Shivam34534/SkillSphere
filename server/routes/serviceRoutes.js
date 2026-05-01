import express from 'express';
import { createService, getServices, purchaseService } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createService)
  .get(getServices);

router.post('/:id/purchase', protect, purchaseService);

export default router;
