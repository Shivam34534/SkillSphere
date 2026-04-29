import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currencyType: {
      type: String,
      enum: ['CASH', 'PLATFORM_CREDITS'],
      default: 'CASH',
    },
    description: {
      type: String,
      required: true,
    },
    relatedGigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'ESCROW'],
      default: 'COMPLETED',
    }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
