import Match from '../models/Match.js';
import User from '../models/User.js';

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
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
