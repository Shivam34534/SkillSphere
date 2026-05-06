import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';
import { otpTemplate, welcomeTemplate, resetPasswordTemplate } from '../utils/emailTemplates.js';

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

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified. Please log in.' });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (user && !user.isVerified) {
      // Update existing unverified user
      user.name = name;
      user.password = password;
      user.role = role || 'STUDENT';
      user.mobile = mobile;
      user.collegeName = collegeName;
      user.department = department;
      user.year = year;
      user.skillsToTeach = skillsToTeach || [];
      user.skillsToLearn = skillsToLearn || [];
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      console.log(`[AUTH] Unverified user ${email} updated with new OTP`);
    } else {
      // Create new user
      user = await User.create({ 
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
      console.log(`[AUTH] New user ${email} created`);
    }

    if (user) {
      // 3. Send OTP via Email
      try {
        await sendEmail(user.email, 'Verify Your SkillSphere Account', otpTemplate(otp));
        console.log(`[AUTH] OTP sent successfully to ${email}`);
      } catch (emailError) {
        console.error("CRITICAL: Failed to send OTP email:", emailError);
        return res.status(500).json({ 
          message: 'Failed to send verification email. Please check your SMTP settings.',
          error: emailError.message 
        });
      }
      
      res.status(201).json({
        message: 'Registration successful. Please verify the OTP sent to your email.',
        email: user.email
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

    // If user is already verified, just return success
    if (user.isVerified) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        message: 'Account already verified!'
      });
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

export const forgotPassword = async (req, res) => {
  console.log(`[AUTH] Forgot password request for: ${req.body.email}`);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[AUTH] Forgot password failure: User ${email} not found`);
      return res.status(404).json({ message: 'No student found with this email address.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    console.log(`[AUTH] Reset OTP generated and saved for ${email}`);

    // Send Email
    try {
      console.log(`[AUTH] Attempting to send recovery OTP to ${email}...`);
      const subject = 'SkillSphere Password Reset OTP';
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #6366f1; text-align: center;">SkillSphere Recovery</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Use the following 6-digit OTP to continue:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #6366f1; background: #f3f4f6; padding: 10px 20px; border-radius: 8px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e1e1e1; margin: 20px 0;">
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">SkillSphere Campus Marketplace</p>
        </div>
      `;
      await sendEmail(user.email, subject, html);
      console.log(`[AUTH] Recovery OTP sent successfully to ${email}`);
      res.json({ message: 'A 6-digit verification code has been sent to your email.' });
    } catch (emailError) {
      console.error(`[AUTH] SMTP ERROR sending recovery OTP to ${email}:`, emailError);
      res.status(500).json({ 
        message: 'The email server is currently busy. Please try again in a few minutes.',
        error: emailError.message 
      });
    }
  } catch (error) {
    console.error(`[AUTH] CRITICAL ERROR in forgotPassword for ${req.body.email}:`, error);
    res.status(500).json({ message: 'Internal server error. Please contact campus support.' });
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    res.json({ message: 'OTP verified. You can now reset your password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Session expired. Please request a new code.' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
