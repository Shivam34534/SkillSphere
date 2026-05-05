import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['WORKSHOP', 'FEST', 'SEMINAR', 'COMPETITION'], default: 'WORKSHOP' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
