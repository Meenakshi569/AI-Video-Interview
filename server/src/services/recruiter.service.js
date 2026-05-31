import { Interview } from '../models/Interview.js';
import { User } from '../models/User.js';
import { Question } from '../models/Question.js';
import { Transcript } from '../models/Transcript.js';
import { getSuspiciousEvents } from './proctoring.service.js';
import { AppError } from '../middleware/error.middleware.js';

export async function listCandidateInterviews() {
  const interviews = await Interview.find()
    .populate('candidateId', 'name email')
    .sort({ updatedAt: -1 })
    .lean();

  return interviews.map((item) => ({
    id: item._id,
    candidate: item.candidateId
      ? {
          id: item.candidateId._id,
          name: item.candidateId.name,
          email: item.candidateId.email,
        }
      : null,
    status: item.status,
    currentQuestionIndex: item.currentQuestionIndex,
    responseCount: item.responses?.length || 0,
    startedAt: item.startedAt,
    completedAt: item.completedAt,
    updatedAt: item.updatedAt,
  }));
}

export async function getInterviewDetails(interviewId) {
  const interview = await Interview.findById(interviewId).populate(
    'candidateId',
    'name email'
  );
  if (!interview) throw new AppError('Interview not found', 404);

  const questions = await Question.find({ isActive: true }).sort({ order: 1 }).lean();
  const transcript = await Transcript.findOne({ interviewId }).lean();
  const suspiciousEvents = await getSuspiciousEvents(interviewId);
  const responses = (interview.responses || []).map((r) => {
    const question = questions.find(
      (q) => q._id.toString() === r.questionId?.toString() || q.order === r.questionIndex
    );
    return {
      questionIndex: r.questionIndex,
      questionText: question?.text,
      metadata: r.metadata,
      recordingKey: r.recordingKey,
      localPath: r.localPath,
      mediaUrl: r.recordingKey
        ? `/api/media/${interview._id}/${r.questionIndex}`
        : null,
      mimeType: r.mimeType,
      sizeBytes: r.sizeBytes,
      answeredAt: r.answeredAt,
    };
  });

  return {
    id: interview._id,
    candidate: {
      id: interview.candidateId._id,
      name: interview.candidateId.name,
      email: interview.candidateId.email,
    },
    status: interview.status,
    currentQuestionIndex: interview.currentQuestionIndex,
    sessionData: interview.sessionData,
    responses,
    totalQuestions: questions.length,
    startedAt: interview.startedAt,
    completedAt: interview.completedAt,
    transcript: transcript
      ? {
          status: transcript.status,
          fullText: transcript.fullText,
          provider: transcript.provider,
          segments: transcript.segments,
        }
      : { status: 'pending', fullText: '', provider: 'stub', segments: [] },
    suspiciousEvents,
  };
}
