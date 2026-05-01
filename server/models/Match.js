import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  userAId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userBId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillOfferedByA: { type: String, required: true },
  skillOfferedByB: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'COMPLETED', 'DECLINED'], default: 'PENDING' },
  exchangeType: { type: String, enum: ['BARTER', 'CREDITS'], default: 'BARTER' },
  scheduledDate: { type: Date },
  meetingLink: { type: String }
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
