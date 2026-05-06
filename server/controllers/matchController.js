import Match from '../models/Match.js';
import User from '../models/User.js';
import { sendNotification } from '../server.js';

export const createMatchRequest = async (req, res) => {
  try {
    const { userBEmail, skillOfferedByA, skillOfferedByB, exchangeType } = req.body;

    // Find the other user by their email
    const userB = await User.findOne({ email: userBEmail });
    if (!userB) {
      return res.status(404).json({ message: 'No student found with that email address.' });
    }

    const userBId = userB._id.toString();

    // Prevent self-matching
    if (userBId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot match with yourself.' });
    }

    const match = await Match.create({
      userAId: req.user._id,
      userBId,
      skillOfferedByA,
      skillOfferedByB,
      exchangeType
    });

    // Notify user B
    await sendNotification(userBId, {
      title: 'New Skill Match Request! 🤝',
      message: `${req.user.name} wants to exchange ${skillOfferedByA} for your ${skillOfferedByB}.`,
      type: 'MATCH',
      link: '/dashboard'
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyMatches = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User context missing' });
    }

    const matches = await Match.find({
      $or: [{ userAId: req.user._id }, { userBId: req.user._id }]
    })
      .populate('userAId', 'name profilePhoto trustScore email')
      .populate('userBId', 'name profilePhoto trustScore email');

    // Filter out any matches where population failed (user deleted)
    const validMatches = matches.filter(m => m.userAId && m.userBId);

    res.json(validMatches);
  } catch (error) {
    console.error('Error in getMyMatches:', error);
    res.status(500).json({ message: 'Error fetching matches: ' + error.message });
  }
};

export const respondToMatch = async (req, res) => {
  try {
    const { status } = req.body; // 'ACCEPTED' or 'DECLINED'
    const match = await Match.findById(req.params.id);

    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Only the receiver (userB) can accept or decline
    if (match.userBId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this match' });
    }

    match.status = status;
    if (status === 'ACCEPTED') {
      // Simulate generating a meeting link
      match.meetingLink = 'https://meet.skillsphere.local/' + match._id;
    }

    await match.save();

    // Notify user A about the response
    const userAId = match.userAId.toString();
    await sendNotification(userAId, {
      title: status === 'ACCEPTED' ? 'Match Accepted! 🎉' : 'Match Declined 😔',
      message: `${req.user.name} has ${status.toLowerCase()} your skill exchange request.`,
      type: 'MATCH',
      link: '/dashboard'
    });

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (match.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Match already completed' });
    }

    // Only participants can complete
    if (match.userAId.toString() !== req.user._id.toString() && match.userBId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = 'COMPLETED';
    await match.save();

    // Reward both users with XP
    const userA = await User.findById(match.userAId);
    const userB = await User.findById(match.userBId);

    // Increment XP Points
    userA.xpPoints += 50;
    userB.xpPoints += 50;

    // Logic for User Levels (Every 500 XP = 1 Level)
    userA.xpLevel = Math.floor(userA.xpPoints / 500) + 1;
    userB.xpLevel = Math.floor(userB.xpPoints / 500) + 1;

    userA.trustScore = Math.min(100, userA.trustScore + 5);
    userB.trustScore = Math.min(100, userB.trustScore + 5);

    // Badge System Check
    const checkBadges = (user) => {
      const existingBadges = user.badges.map(b => b.name);

      if (user.xpPoints >= 1000 && !existingBadges.includes('Campus Expert')) {
        user.badges.push({ name: 'Campus Expert', icon: '👑' });
      }
      if (user.xpPoints >= 500 && !existingBadges.includes('Top Mentor')) {
        user.badges.push({ name: 'Top Mentor', icon: '⭐' });
      }
      if (user.isVerified && !existingBadges.includes('Verified Student')) {
        user.badges.push({ name: 'Verified Student', icon: '🛡️' });
      }
    };

    checkBadges(userA);
    checkBadges(userB);

    await userA.save();
    await userB.save();

    res.json({ message: 'Session completed! +50 XP and Trust Score updated.', match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ userAId: req.params.id }, { userBId: req.params.id }],
      status: 'COMPLETED'
    })
    .populate('userAId', 'name profilePhoto')
    .populate('userBId', 'name profilePhoto')
    .limit(5);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMatchSuggestions = async (req, res) => {
  try {
    const { skillsToTeach, skillsToLearn } = req.user;

    // Find users who want to learn what you teach AND can teach what you want to learn
    const suggestions = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { skillsToLearn: { $in: skillsToTeach } }, // They want what you have
        { skillsToTeach: { $in: skillsToLearn } }  // They have what you want
      ]
    }).select('name email profilePhoto trustScore skillsToTeach skillsToLearn xpLevel');

    // Score the suggestions
    const scoredSuggestions = suggestions.map(s => {
      let score = 0;
      const mutualInterest = s.skillsToLearn.filter(skill => skillsToTeach.includes(skill));
      const mutualOffer = s.skillsToTeach.filter(skill => skillsToLearn.includes(skill));
      
      if (mutualInterest.length > 0 && mutualOffer.length > 0) score += 100; // Perfect Match
      score += mutualInterest.length * 20;
      score += mutualOffer.length * 20;
      
      return { ...s.toObject(), score, mutualInterest, mutualOffer };
    }).sort((a, b) => b.score - a.score).filter(s => s.score > 0);

    res.json(scoredSuggestions || []);
  } catch (error) {
    console.error('Error in getMatchSuggestions:', error);
    res.status(500).json({ message: 'Error generating suggestions: ' + error.message });
  }
};

export const getBarterHistory = async (req, res) => {
  try {
    const history = await Match.find({
      $or: [{ userAId: req.user._id }, { userBId: req.user._id }],
      status: 'COMPLETED'
    })
    .populate('userAId', 'name profilePhoto')
    .populate('userBId', 'name profilePhoto')
    .sort({ updatedAt: -1 });

    res.json(history || []);
  } catch (error) {
    console.error('Error in getBarterHistory:', error);
    res.status(500).json({ message: 'Error fetching history: ' + error.message });
  }
};
