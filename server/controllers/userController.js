import User from '../models/User.js';
import { notifyPerfectMatches } from './matchController.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.mobile = req.body.mobile || user.mobile;
      user.collegeName = req.body.collegeName || user.collegeName;
      user.department = req.body.department || user.department;
      user.year = req.body.year || user.year;
      user.skillsToTeach = req.body.skillsToTeach || user.skillsToTeach;
      user.skillsToLearn = req.body.skillsToLearn || user.skillsToLearn;
      
      const updatedUser = await user.save();
      
      // Trigger Smart Match Discovery if skills were updated
      if (req.body.skillsToTeach || req.body.skillsToLearn) {
        notifyPerfectMatches(user._id);
      }
      
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otp -otpExpires'); // Hide sensitive info
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
