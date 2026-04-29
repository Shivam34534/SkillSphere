import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Skill title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Coding', 'Design', 'Academics', 'Video Editing', 'Music', 'Fitness', 'Other'],
    },
    description: {
      type: String,
      required: true,
    },
    pricingMode: {
      type: String,
      enum: ['FIXED', 'HOURLY', 'CREDITS'],
      default: 'FIXED',
    },
    price: {
      type: Number,
      required: true,
    },
    portfolioImages: [String], // Array of image URLs
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
