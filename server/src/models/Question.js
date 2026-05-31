import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    durationSeconds: { type: Number, default: 120 },
    category: { type: String, default: 'general' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

questionSchema.index({ order: 1 });

export const Question = mongoose.model('Question', questionSchema);
