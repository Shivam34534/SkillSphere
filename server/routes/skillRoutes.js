import express from 'express';
import { createSkill, getSkills } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createSkill)
  .get(getSkills);

export default router;
