import Gig from '../models/Gig.js';
import { sendEmail } from '../utils/emailService.js';
import { gigApplicationTemplate } from '../utils/emailTemplates.js';
import User from '../models/User.js';

export const createGig = async (req, res) => {
  try {
    const { title, description, type, budget, skillsRequired } = req.body;
    
    if (req.user.role !== 'CLUB') {
      return res.status(403).json({ message: 'Only clubs can post gigs' });
    }

    const gig = await Gig.create({
      clubId: req.user._id,
      title, 
      description, 
      type, 
      budget, 
      skillsRequired
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOpenGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'OPEN' }).populate('clubId', 'name trustScore');
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    // Prevent club from applying to their own gig
    if (gig.clubId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot apply to your own gig' });
    }

    gig.applicants.push({ userId: req.user._id });
    await gig.save();

    // Notify the club owner via email
    try {
      const club = await User.findById(gig.clubId);
      if (club && club.email) {
        await sendEmail(
          club.email, 
          'New Application for your Gig!', 
          gigApplicationTemplate(req.user.name, gig.title)
        );
      }
    } catch (emailError) {
      console.error("Failed to send application notification email:", emailError);
    }
    res.json({ message: 'Applied successfully', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const hireFreelancer = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    if (gig.clubId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Find the applicant and accept them
    const applicant = gig.applicants.find(a => a.userId.toString() === req.body.userId);
    if (applicant) {
      applicant.status = 'ACCEPTED';
    }
    
    gig.status = 'IN_PROGRESS';
    await gig.save();
    res.json({ message: 'User hired successfully', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
