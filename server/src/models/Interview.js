import mongoose from 'mongoose';
import { INTERVIEW_STATUS } from '../utils/interviewStatus.js';

const responseSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    questionIndex: { type: Number, required: true },
    metadata: {
      durationMs: Number,
      timerUsedSeconds: Number,
      notes: String,
    },
    recordingKey: String,
    localPath: String,
    mimeType: String,
    sizeBytes: Number,
    answeredAt: Date,
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(INTERVIEW_STATUS),
      default: INTERVIEW_STATUS.PENDING_HARDWARE,
    },
    currentQuestionIndex: { type: Number, default: 0 },
    sessionData: {
      hardwareCheckPassed: { type: Boolean, default: false },
      cameraGranted: { type: Boolean, default: false },
      microphoneGranted: { type: Boolean, default: false },
    },
    responses: [responseSchema],
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export const Interview = mongoose.model('Interview', interviewSchema);
