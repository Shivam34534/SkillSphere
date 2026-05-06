import User from '../models/User.js';
import Report from '../models/Report.js';
import Gig from '../models/Gig.js';
import Match from '../models/Match.js';
import Transaction from '../models/Transaction.js';

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
    const [totalUsers, totalGigs, totalMatches, totalVolume] = await Promise.all([
      User.countDocuments(),
      Gig.countDocuments(),
      Match.countDocuments({ status: 'COMPLETED' }),
      Transaction.aggregate([{ $group: { _id: null, sum: { $sum: "$amount" } } }])
    ]);

    const activeReports = await Report.countDocuments({ status: 'PENDING' });

    res.json({
      totalUsers,
      totalGigs,
      totalMatches,
      totalVolume: totalVolume[0]?.sum || 0,
      activeReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., active, suspended, banned
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.accountStatus = status; // Add this field to User model if not exists
    await user.save();
    res.json({ message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email')
      .populate('targetUserId', 'name email accountStatus')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { status } = req.body; // RESOLVED or DISMISSED
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const moderateGig = async (req, res) => {
  try {
    const { status } = req.body; // OPEN, CLOSED, REMOVED
    const gig = await Gig.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const grantCredits = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += Number(amount);
    await user.save();

    await Transaction.create({
      senderId: req.user._id, // Admin
      receiverId: user._id,
      type: 'CREDITS',
      amount,
      reason: reason || 'Admin Grant',
      status: 'COMPLETED'
    });

    res.json({ message: `Granted ${amount} credits to ${user.name}`, balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
