import { Interview } from '../models/Interview.js';
import { Transcript } from '../models/Transcript.js';
import { AppError } from '../middleware/error.middleware.js';
import { getTranscriptionProvider } from './transcription/index.js';

export async function generateTranscript(interviewId) {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError('Interview not found', 404);

  const mediaKeys = (interview.responses || [])
    .map((r) => r.recordingKey)
    .filter(Boolean);

  let transcript = await Transcript.findOne({ interviewId });
  if (!transcript) {
    transcript = await Transcript.create({ interviewId, status: 'processing' });
  } else {
    transcript.status = 'processing';
    await transcript.save();
  }

  try {
    const provider = getTranscriptionProvider();
    const result = await provider.transcribe({ interviewId, mediaKeys });

    transcript.fullText = result.fullText;
    transcript.segments = result.segments || [];
    transcript.provider = result.provider || provider.name;
    transcript.status = 'completed';
    await transcript.save();

    return {
      interviewId,
      status: transcript.status,
      fullText: transcript.fullText,
      provider: transcript.provider,
      segments: transcript.segments,
    };
  } catch (err) {
    transcript.status = 'failed';
    transcript.errorMessage = err.message;
    await transcript.save();
    throw new AppError(`Transcription failed: ${err.message}`, 500);
  }
}

export async function getTranscript(interviewId) {
  const transcript = await Transcript.findOne({ interviewId }).lean();
  if (!transcript) {
    return { status: 'pending', fullText: '', provider: 'stub', segments: [] };
  }
  return transcript;
}
