import Review from '../models/Review.js';
import User from '../models/User.js';
import Report from '../models/Report.js';

const calculateTrustScore = async (userId) => {
  const user = await User.findById(userId);
  const reviews = await Review.find({ revieweeId: userId });
  const reports = await Report.countDocuments({ targetUserId: userId, status: 'RESOLVED' });

  let avgRating = 5;
  if (reviews.length > 0) {
    const sum = reviews.reduce((a, b) => a + b.rating, 0);
    avgRating = sum / reviews.length;
  }

  // Base score from ratings (0-50)
  let score = avgRating * 10;
  
  // Bonus from completions (max 30 points)
  const activityBonus = Math.min(30, (user.completedGigs + (user.xpPoints / 100)) * 2);
  score += activityBonus;

  // Penalty from reports
  score -= (reports * 15);

  // Verification bonus
  if (user.isVerified) score += 10;

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const postReview = async (req, res) => {
  try {
    const { revieweeId, rating, comment, gigId, matchId } = req.body;
    
    const review = await Review.create({
      reviewerId: req.user._id,
      revieweeId,
      rating,
      comment,
      gigId,
      matchId
    });

    // Update trust score
    const newTrustScore = await calculateTrustScore(revieweeId);
    await User.findByIdAndUpdate(revieweeId, { trustScore: newTrustScore });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const reportUser = async (req, res) => {
  try {
    const { targetUserId, reason, details } = req.body;
    const report = await Report.create({
      reporterId: req.user._id,
      targetUserId,
      reason,
      details
    });
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.id })
      .populate('reviewerId', 'name profilePhoto');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
