import { Interview } from '../models/Interview.js';
import { Question } from '../models/Question.js';
import { AppError } from '../middleware/error.middleware.js';
import { INTERVIEW_STATUS } from '../utils/interviewStatus.js';

async function getActiveQuestions() {
  return Question.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function startInterview(candidateId) {
  const active = await Interview.findOne({
    candidateId,
    status: { $in: [INTERVIEW_STATUS.PENDING_HARDWARE, INTERVIEW_STATUS.IN_PROGRESS] },
  });

  if (active) {
    return formatInterview(active, await getActiveQuestions());
  }

  const interview = await Interview.create({
    candidateId,
    status: INTERVIEW_STATUS.PENDING_HARDWARE,
    currentQuestionIndex: 0,
    startedAt: new Date(),
  });

  return formatInterview(interview, await getActiveQuestions());
}

export async function getInterviewById(interviewId, userId, userRole) {
  const interview = await Interview.findById(interviewId).populate(
    'candidateId',
    'name email'
  );
  if (!interview) throw new AppError('Interview not found', 404);

  if (
    userRole !== 'recruiter' &&
    userRole !== 'admin' &&
    interview.candidateId._id?.toString() !== userId.toString() &&
    interview.candidateId.toString() !== userId.toString()
  ) {
    throw new AppError('Access denied', 403);
  }

  const questions = await getActiveQuestions();
  return formatInterview(interview, questions);
}

export async function getNextQuestion(interviewId, candidateId) {
  const interview = await assertCandidateInterview(interviewId, candidateId);
  const questions = await getActiveQuestions();

  if (interview.currentQuestionIndex >= questions.length) {
    throw new AppError('No more questions', 404);
  }

  const question = questions[interview.currentQuestionIndex];
  return {
    interviewId: interview._id,
    questionIndex: interview.currentQuestionIndex,
    totalQuestions: questions.length,
    question,
    status: interview.status,
  };
}

export async function updateSessionData(interviewId, candidateId, sessionData) {
  const interview = await assertCandidateInterview(interviewId, candidateId);

  const current = interview.sessionData?.toObject?.() || interview.sessionData || {};
  interview.sessionData = { ...current, ...sessionData };

  if (sessionData.hardwareCheckPassed && interview.status === INTERVIEW_STATUS.PENDING_HARDWARE) {
    interview.status = INTERVIEW_STATUS.IN_PROGRESS;
  }

  await interview.save();
  return formatInterview(interview, await getActiveQuestions());
}

export async function saveResponseMetadata(interviewId, candidateId, payload) {
  const { questionIndex, metadata = {}, advance = false } = payload;
  const interview = await assertCandidateInterview(interviewId, candidateId);
  const questions = await getActiveQuestions();

  if (questionIndex < 0 || questionIndex >= questions.length) {
    throw new AppError('Invalid question index', 400);
  }

  const question = questions[questionIndex];
  const existing = interview.responses.find((r) => r.questionIndex === questionIndex);

  const entry = {
    questionId: question._id,
    questionIndex,
    metadata: { ...metadata },
    answeredAt: new Date(),
  };

  if (existing) {
    Object.assign(existing, entry);
  } else {
    interview.responses.push(entry);
  }

  if (advance) {
    interview.currentQuestionIndex = Math.max(
      interview.currentQuestionIndex,
      questionIndex + 1
    );
  }

  await interview.save();
  return formatInterview(interview, questions);
}

export async function finishInterview(interviewId, candidateId) {
  const interview = await assertCandidateInterview(interviewId, candidateId);
  interview.status = INTERVIEW_STATUS.COMPLETED;
  interview.completedAt = new Date();
  await interview.save();
  return formatInterview(interview, await getActiveQuestions());
}

export async function getCandidateInterviews(candidateId) {
  const interviews = await Interview.find({ candidateId })
    .sort({ createdAt: -1 })
    .lean();
  const questions = await getActiveQuestions();
  return interviews.map((i) => formatInterview(i, questions));
}

async function assertCandidateInterview(interviewId, candidateId) {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError('Interview not found', 404);
  if (interview.candidateId.toString() !== candidateId.toString()) {
    throw new AppError('Access denied', 403);
  }
  return interview;
}

function formatInterview(interview, questions = []) {
  const doc = interview.toObject ? interview.toObject() : { ...interview };
  const candidate = doc.candidateId;
  return {
    id: doc._id,
    candidateId: candidate?._id || candidate,
    candidate: candidate?.name
      ? { id: candidate._id, name: candidate.name, email: candidate.email }
      : undefined,
    status: doc.status,
    currentQuestionIndex: doc.currentQuestionIndex,
    sessionData: doc.sessionData,
    responses: doc.responses || [],
    totalQuestions: questions.length,
    startedAt: doc.startedAt,
    completedAt: doc.completedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
