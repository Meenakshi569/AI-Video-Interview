import path from 'path';
import { getStorage } from '../services/storage/index.js';
import { Interview } from '../models/Interview.js';
import { AppError } from '../middleware/error.middleware.js';
import { env } from '../config/env.js';

export async function serveMedia(req, res, next) {
  try {
    const { interviewId, questionIndex } = req.params;
    const interview = await Interview.findById(interviewId);
    if (!interview) throw new AppError('Interview not found', 404);

    const isOwner = interview.candidateId.toString() === req.user._id.toString();
    const isRecruiter = ['recruiter', 'admin'].includes(req.user.role);
    if (!isOwner && !isRecruiter) {
      throw new AppError('Access denied', 403);
    }

    const idx = parseInt(questionIndex, 10);
    const response = (interview.responses || []).find((r) => r.questionIndex === idx);
    if (!response?.recordingKey) throw new AppError('Recording not found', 404);

    const storage = getStorage();
    const buffer = await storage.get(response.recordingKey);
    const ext = path.extname(response.recordingKey).toLowerCase();
    const mime = response.mimeType ||
      (ext === '.mp4' ? 'video/mp4' : ext === '.webm' ? 'video/webm' : 'application/octet-stream');

    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Length', buffer.length);
    if (env.storageDriver === 'local' && response.localPath) {
      res.setHeader('X-Storage-Path', response.localPath);
    }
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
