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
