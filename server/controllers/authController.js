import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile, collegeName, department, year, skillsToTeach, skillsToLearn } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || 'STUDENT',
      mobile,
      collegeName,
      department,
      year,
      skillsToTeach: skillsToTeach || [],
      skillsToLearn: skillsToLearn || []
    });

    if (user) {
      res.status(201).json({
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isVerified: user.isVerified,
        mobile: user.mobile,
        collegeName: user.collegeName,
        department: user.department,
        year: user.year,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        walletBalance: user.walletBalance,
        xpLevel: user.xpLevel,
        trustScore: user.trustScore,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isVerified: user.isVerified,
        mobile: user.mobile,
        collegeName: user.collegeName,
        department: user.department,
        year: user.year,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        walletBalance: user.walletBalance,
        xpLevel: user.xpLevel,
        trustScore: user.trustScore,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(401).json({ message: error.message });
  }
};
