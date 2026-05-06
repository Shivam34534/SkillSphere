import User from '../models/User.js';

// @desc    Get leaderboard data
// @route   GET /api/v1/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const topEarners = await User.find({ role: { $ne: 'ADMIN' } })
      .sort({ walletBalance: -1 })
      .limit(10)
      .select('name profilePhoto walletBalance role xpLevel') || [];

    const topTeachers = await User.find({ role: { $in: ['STUDENT', 'FREELANCER'] } })
      .sort({ xpPoints: -1 })
      .limit(10)
      .select('name profilePhoto xpPoints role xpLevel badges') || [];

    const topClubs = await User.find({ role: 'CLUB' })
      .sort({ trustScore: -1 })
      .limit(10)
      .select('name profilePhoto trustScore completedGigs') || [];

    res.json({
      topEarners: topEarners || [],
      topTeachers: topTeachers || [],
      topClubs: topClubs || []
    });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
