import User from '../models/User.js';

export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isVerified = true;
    await user.save();
    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    // More complex aggregations could go here
    res.json({ totalUsers: userCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
