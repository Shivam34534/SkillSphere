import Gig from '../models/Gig.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';
import { gigApplicationTemplate } from '../utils/emailTemplates.js';
import { sendNotification } from '../server.js';

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
      skillsRequired,
      category: req.body.category || 'General',
      deadline: req.body.deadline,
      requirements: req.body.requirements
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOpenGigs = async (req, res) => {
  try {
    const query = { status: 'OPEN' };
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    if (req.query.type && req.query.type !== 'All') {
      query.type = req.query.type;
    }

    const gigs = await Gig.find(query).populate('clubId', 'name trustScore profilePhoto');
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClubGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ clubId: req.user._id }).populate('applicants.userId', 'name email');
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

    // Notify the club owner via real-time notification
    await sendNotification(gig.clubId, {
      title: 'New Gig Applicant! 🚀',
      message: `${req.user.name} has applied for "${gig.title}".`,
      type: 'GIG',
      link: '/dashboard'
    });

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

    // Notify the student that they were hired
    await sendNotification(req.body.userId, {
      title: 'You are Hired! 🎉',
      message: `The club has accepted your application for "${gig.title}".`,
      type: 'GIG',
      link: '/dashboard'
    });

    res.json({ message: 'User hired successfully', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    if (gig.clubId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the accepted applicant
    const hiredApplicant = gig.applicants.find(a => a.status === 'ACCEPTED');
    if (!hiredApplicant) {
      return res.status(400).json({ message: 'No hired freelancer found for this gig' });
    }

    const studentId = hiredApplicant.userId;
    const clubId = gig.clubId;

    const student = await User.findById(studentId);
    const club = await User.findById(clubId);

    if (gig.type === 'PAID') {
      // Currency Logic
      if (club.walletBalance < gig.budget) {
        return res.status(400).json({ message: 'Insufficient club balance to pay freelancer' });
      }
      club.walletBalance -= gig.budget;
      student.walletBalance += gig.budget;
      student.xpPoints += 100; // Standard XP for paid work
    } else {
      // Volunteer Logic (No money, more XP)
      student.xpPoints += 300;
      club.trustScore = Math.min(100, club.trustScore + 5); // Club trust grows
    }

    // Update Student Level
    student.xpLevel = Math.floor(student.xpPoints / 500) + 1;
    student.completedGigs += 1;

    // Club Leader Badge Check
    const clubExistingBadges = club.badges.map(b => b.name);
    club.completedGigs += 1;
    if (club.completedGigs >= 5 && !clubExistingBadges.includes('Club Leader')) {
      club.badges.push({ name: 'Club Leader', icon: '💎' });
    }

    gig.status = 'COMPLETED';
    await Promise.all([
      gig.save(),
      student.save(),
      club.save()
    ]);

    // Notify the student that the gig is completed and rewards are added
    await sendNotification(studentId, {
      title: 'Gig Completed! 🏁',
      message: `"${gig.title}" has been closed. Rewards (XP/Credits) added to your wallet.`,
      type: 'GIG',
      link: '/wallet'
    });

    res.json({ message: 'Gig completed and rewards distributed!', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('clubId', 'name trustScore bio profilePhoto')
      .populate('applicants.userId', 'name email profilePhoto');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    if (!gig.savedBy.includes(req.user._id)) {
      gig.savedBy.push(req.user._id);
      await gig.save();
    }
    res.json({ message: 'Gig saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    gig.savedBy = gig.savedBy.filter(id => id.toString() !== req.user._id.toString());
    await gig.save();
    res.json({ message: 'Gig unsaved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ savedBy: req.user._id }).populate('clubId', 'name trustScore');
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const gigs = await Gig.find({ 'applicants.userId': req.user._id }).populate('clubId', 'name trustScore');
    const applications = gigs.map(gig => {
      const app = gig.applicants.find(a => a.userId.toString() === req.user._id.toString());
      return {
        _id: gig._id,
        title: gig.title,
        clubId: gig.clubId,
        status: app.status,
        appliedAt: app.appliedAt,
        gigStatus: gig.status
      };
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
