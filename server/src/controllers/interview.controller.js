import * as interviewService from '../services/interview.service.js';
import * as recordingService from '../services/recording.service.js';
import * as proctoringService from '../services/proctoring.service.js';
import * as transcriptionService from '../services/transcription.service.js';

export async function startInterview(req, res, next) {
  try {
    const data = await interviewService.startInterview(req.user._id);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getInterview(req, res, next) {
  try {
    const data = await interviewService.getInterviewById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMyInterviews(req, res, next) {
  try {
    const data = await interviewService.getCandidateInterviews(req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getNextQuestion(req, res, next) {
  try {
    const data = await interviewService.getNextQuestion(req.params.id, req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req, res, next) {
  try {
    const data = await interviewService.updateSessionData(
      req.params.id,
      req.user._id,
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function saveResponse(req, res, next) {
  try {
    const data = await interviewService.saveResponseMetadata(
      req.params.id,
      req.user._id,
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function uploadRecording(req, res, next) {
  try {
    const questionIndex = parseInt(req.body.questionIndex, 10);
    const data = await recordingService.uploadRecording(
      req.params.id,
      req.user._id,
      questionIndex,
      req.file
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function finishInterview(req, res, next) {
  try {
    const data = await interviewService.finishInterview(req.params.id, req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function logProctoring(req, res, next) {
  try {
    const data = await proctoringService.logSuspiciousEvent(
      req.params.id,
      req.user._id,
      req.body
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function transcribeInterview(req, res, next) {
  try {
    const data = await transcriptionService.generateTranscript(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
