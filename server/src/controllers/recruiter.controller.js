import * as recruiterService from '../services/recruiter.service.js';
import * as transcriptionService from '../services/transcription.service.js';

export async function listInterviews(req, res, next) {
  try {
    const data = await recruiterService.listCandidateInterviews();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getInterviewDetail(req, res, next) {
  try {
    const data = await recruiterService.getInterviewDetails(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTranscript(req, res, next) {
  try {
    const data = await transcriptionService.getTranscript(req.params.id);
    res.json({ success: true, data });
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
