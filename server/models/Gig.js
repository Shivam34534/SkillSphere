import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['VOLUNTEER', 'PAID'], default: 'VOLUNTEER' },
  budget: { type: Number, default: 0 },
  skillsRequired: [{ type: String }],
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED'], default: 'OPEN' },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Gig', gigSchema);
