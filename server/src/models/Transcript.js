import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
    },
    fullText: { type: String, default: '' },
    segments: [
      {
        questionIndex: Number,
        text: String,
        start: Number,
        end: Number,
      },
    ],
    provider: { type: String, default: 'stub' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: String,
  },
  { timestamps: true }
);

export const Transcript = mongoose.model('Transcript', transcriptSchema);
