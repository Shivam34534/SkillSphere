import express from 'express';
import { 
  createGig, 
  getOpenGigs, 
  applyForGig, 
  hireFreelancer, 
  completeGig, 
  getClubGigs, 
  getGigById, 
  saveGig, 
  unsaveGig, 
  getSavedGigs, 
  getMyApplications 
} from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createGig)
  .get(getOpenGigs);

router.get('/my-gigs', protect, getClubGigs);
router.get('/saved', protect, getSavedGigs);
router.get('/applications', protect, getMyApplications);
router.get('/:id', getGigById);
router.post('/:id/apply', protect, applyForGig);
router.post('/:id/hire', protect, hireFreelancer);
router.post('/:id/complete', protect, completeGig);
router.post('/:id/save', protect, saveGig);
router.post('/:id/unsave', protect, unsaveGig);

export default router;
