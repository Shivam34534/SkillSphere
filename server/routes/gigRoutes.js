import { createGig, getOpenGigs, applyForGig, hireFreelancer, completeGig, getClubGigs } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createGig)
  .get(getOpenGigs);

router.get('/my-gigs', protect, getClubGigs);
router.post('/:id/apply', protect, applyForGig);
router.post('/:id/hire', protect, hireFreelancer);
router.post('/:id/complete', protect, completeGig);

export default router;
