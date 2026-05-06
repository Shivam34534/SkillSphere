import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['VOLUNTEER', 'PAID'], default: 'VOLUNTEER' },
  budget: { type: Number, default: 0 },
  skillsRequired: [{ type: String }],
  category: { type: String, required: true },
  deadline: { type: Date },
  requirements: [{ type: String }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
    appliedAt: { type: Date, default: Date.now },
    resume: { type: String }, // Link to portfolio/resume
    coverLetter: { type: String }
  }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Gig', gigSchema);
