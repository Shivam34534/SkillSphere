import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['MATCH', 'GIG', 'REMINDER', 'WALLET', 'INVITATION', 'REVIEW', 'SYSTEM'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Where clicking the notification should take you
    }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
