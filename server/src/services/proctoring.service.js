import { SuspiciousEvent } from '../models/SuspiciousEvent.js';
import { Interview } from '../models/Interview.js';
import { AppError } from '../middleware/error.middleware.js';

export async function logSuspiciousEvent(interviewId, candidateId, { type, metadata }) {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError('Interview not found', 404);
  if (interview.candidateId.toString() !== candidateId.toString()) {
    throw new AppError('Access denied', 403);
  }

  const event = await SuspiciousEvent.create({
    interviewId,
    candidateId,
    type,
    timestamp: new Date(),
    metadata: metadata || {},
  });

  return {
    id: event._id,
    type: event.type,
    timestamp: event.timestamp,
    metadata: event.metadata,
  };
}

export async function getSuspiciousEvents(interviewId) {
  return SuspiciousEvent.find({ interviewId })
    .sort({ timestamp: -1 })
    .lean();
}
