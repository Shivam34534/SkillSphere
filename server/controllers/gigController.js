import Gig from '../models/Gig.js';

export const createGig = async (req, res) => {
  try {
    const { title, description, category, budget, paymentType, deadline } = req.body;
    const gig = await Gig.create({
      requesterId: req.user._id,
      title, description, category, budget, paymentType, deadline
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOpenGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'OPEN' }).populate('requesterId', 'name trustScore');
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    // Prevent requester from applying to their own gig
    if (gig.requesterId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot apply to your own gig' });
    }

    gig.applicants.push({ freelancerId: req.user._id, pitch: req.body.pitch });
    await gig.save();
    res.json({ message: 'Applied successfully', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const hireFreelancer = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    if (gig.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    gig.selectedFreelancer = req.body.freelancerId;
    gig.status = 'IN_PROGRESS';
    await gig.save();
    res.json({ message: 'Freelancer hired successfully', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
