import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  pricing: {
    type: { type: String, enum: ['FREE', 'CREDITS', 'CASH'], default: 'CASH' },
    amount: { type: Number, default: 0 }
  },
  deliveryTimeDays: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  ratings: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 },
    review: String
  }]
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
