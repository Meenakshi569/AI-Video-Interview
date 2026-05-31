import path from 'path';
import { Interview } from '../models/Interview.js';
import { Question } from '../models/Question.js';
import { AppError } from '../middleware/error.middleware.js';
import { getStorage } from './storage/index.js';
import { buildRecordingKey } from '../utils/recordingKey.js';
import { env } from '../config/env.js';

export async function uploadRecording(interviewId, candidateId, questionIndex, file) {
  if (!file?.buffer?.length) {
    throw new AppError('Recording file is required', 400);
  }

  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError('Interview not found', 404);
  if (interview.candidateId.toString() !== candidateId.toString()) {
    throw new AppError('Access denied', 403);
  }

  const questions = await Question.find({ isActive: true }).sort({ order: 1 });
  if (questionIndex < 0 || questionIndex >= questions.length) {
    throw new AppError('Invalid question index', 400);
  }

  const ext = mimeToExt(file.mimetype);
  const key = buildRecordingKey(interviewId, questionIndex, ext);
  const storage = getStorage();

  await storage.save(key, file.buffer, { contentType: file.mimetype });

  const localPath = path.join(path.resolve(env.storageLocalPath), key);
  const question = questions[questionIndex];

  let response = interview.responses.find((r) => r.questionIndex === questionIndex);
  const entry = {
    questionId: question._id,
    questionIndex,
    recordingKey: key,
    localPath,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    answeredAt: new Date(),
    metadata: response?.metadata || {},
  };

  if (response) {
    Object.assign(response, entry);
  } else {
    interview.responses.push(entry);
  }

  await interview.save();

  return {
    questionIndex,
    recordingKey: key,
    localPath,
    mediaUrl: `/api/media/${interviewId}/${questionIndex}`,
    sizeBytes: file.size,
  };
}

function mimeToExt(mime) {
  if (mime?.includes('mp4')) return 'mp4';
  if (mime?.includes('webm')) return 'webm';
  if (mime?.includes('ogg')) return 'ogg';
  return 'webm';
}
