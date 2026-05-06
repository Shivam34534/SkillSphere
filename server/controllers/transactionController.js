import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { sendNotification } from '../server.js';

// @desc    Get user transactions
// @route   GET /api/v1/transactions
// @access  Private
export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Transfer credits
// @route   POST /api/v1/transactions/transfer
// @access  Private
export const transferCredits = async (req, res) => {
  const { receiverEmail, amount, reason } = req.body;

  try {
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const sender = await User.findById(req.user._id);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    if (sender.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Update balances
    sender.walletBalance -= Number(amount);
    receiver.walletBalance += Number(amount);

    await sender.save();
    await receiver.save();

    // Create transaction record
    const transaction = await Transaction.create({
      senderId: sender._id,
      receiverId: receiver._id,
      type: 'CREDITS',
      amount,
      reason,
      status: 'COMPLETED'
    });

    // Notify receiver about the credits
    await sendNotification(receiver._id, {
      title: 'Credits Received! 💰',
      message: `You received ${amount} credits from ${sender.name}.`,
      type: 'WALLET',
      link: '/wallet'
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wallet summary
// @route   GET /api/v1/transactions/summary
// @access  Private
export const getWalletSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const transactions = await Transaction.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    }).sort({ createdAt: -1 }).limit(5);

    const totalEarned = await Transaction.aggregate([
      { $match: { receiverId: req.user._id, status: 'COMPLETED', type: 'CREDITS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSpent = await Transaction.aggregate([
      { $match: { senderId: req.user._id, status: 'COMPLETED', type: 'CREDITS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      balance: user.walletBalance,
      xp: user.xpLevel * 100 + (user.trustScore * 2), // Example XP logic
      totalEarned: totalEarned[0]?.total || 0,
      totalSpent: totalSpent[0]?.total || 0,
      recentTransactions: transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
