import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailService.js';
import { otpTemplate, welcomeTemplate } from '../utils/emailTemplates.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  console.log("Registration Request Body:", req.body);
  try {
    const { name, email, password, role, mobile, collegeName, department, year, skillsToTeach, skillsToLearn } = req.body;
    // 1. Validate Campus Email (Relaxed for development/testing)
    const campusEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!campusEmailRegex.test(email)) {
      return res.status(400).json({ message: 'Please use a valid email address.' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

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
      skillsToLearn: skillsToLearn || [],
      otp,
      otpExpires
    });

    if (user) {
      // 3. Send OTP via Email
      try {
        await sendEmail(user.email, 'Verify Your SkillSphere Account', otpTemplate(otp));
        console.log(`[AUTH] OTP sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        // We still return 201 because the user was created, but we notify about the email failure
      }
      
      res.status(201).json({
        message: 'Registration successful. Please verify the OTP sent to your email.',
        email: user.email,
        testOtp: process.env.NODE_ENV === 'development' ? otp : undefined 
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("CRITICAL REGISTRATION ERROR:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map(val => val.message).join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }
    res.status(500).json({ message: 'Internal server error during registration. Check server logs.' });
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

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send Welcome Email
    try {
      await sendEmail(user.email, 'Welcome to SkillSphere!', welcomeTemplate(user.name));
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
      message: 'Email verified successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
