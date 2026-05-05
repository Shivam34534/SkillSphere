import express from 'express';
import { createEvent, getAllEvents, getClubEvents } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllEvents)
  .post(protect, createEvent);

router.get('/my-events', protect, getClubEvents);

export default router;
