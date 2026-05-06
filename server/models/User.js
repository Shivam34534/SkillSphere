import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['STUDENT', 'FREELANCER', 'CLUB', 'ADMIN'], default: 'STUDENT' },
    mobile: { type: String },
    collegeName: { type: String },
    department: { type: String },
    year: { type: String },
    profilePhoto: { type: String, default: '' },
    skillsToTeach: [{ type: String }],
    skillsToLearn: [{ type: String }],
    walletBalance: { type: Number, default: 0 },
    xpPoints: { type: Number, default: 0 },
    xpLevel: { type: Number, default: 1 },
    trustScore: { type: Number, default: 50 },
    isVerified: { type: Boolean, default: false },
    accountStatus: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    completedGigs: { type: Number, default: 0 },
    badges: [{ 
      name: String, 
      icon: String, 
      awardedAt: { type: Date, default: Date.now } 
    }],
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
