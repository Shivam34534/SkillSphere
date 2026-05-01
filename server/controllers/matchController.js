import Match from '../models/Match.js';

export const createMatchRequest = async (req, res) => {
  try {
    const { userBId, skillOfferedByA, skillOfferedByB, exchangeType } = req.body;
    
    // Prevent self-matching
    if (userBId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot match with yourself' });
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
    const matches = await Match.find({
      $or: [{ userAId: req.user._id }, { userBId: req.user._id }]
    })
    .populate('userAId', 'name profilePhoto trustScore')
    .populate('userBId', 'name profilePhoto trustScore');
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
