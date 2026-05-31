import mongoose from 'mongoose';

const EVENT_TYPES = [
  'tab_switch',
  'page_hidden',
  'page_visible',
  'window_blur',
  'window_focus',
  'camera_lost',
  'camera_restored',
];

const suspiciousEventSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: { type: String, enum: EVENT_TYPES, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const SuspiciousEvent = mongoose.model('SuspiciousEvent', suspiciousEventSchema);
export { EVENT_TYPES };
