import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import QuestionDisplay from '../../components/candidate/QuestionDisplay.jsx';
import InterviewTimer from '../../components/candidate/InterviewTimer.jsx';
import RecordingControls from '../../components/candidate/RecordingControls.jsx';
import VideoPreview from '../../components/candidate/VideoPreview.jsx';
import ProctoringMonitor from '../../components/proctoring/ProctoringMonitor.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { useInterviewTimer } from '../../hooks/useInterviewTimer.js';
import { useMediaRecorder } from '../../hooks/useMediaRecorder.js';
import { useProctoring } from '../../hooks/useProctoring.js';
import * as interviewApi from '../../api/interview.api.js';
import { INTERVIEW_STATUS } from '../../utils/constants.js';

export default function InterviewPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [questionData, setQuestionData] = useState(null);

  useProctoring(interviewId, true);

  const {
    recording,
    previewUrl,
    blob,
    error: recorderError,
    startRecording,
    stopRecording,
    clearPreview,
  } = useMediaRecorder(streamRef.current);

  const duration = questionData?.question?.durationSeconds || 120;
  const { formatted, expired, secondsLeft } = useInterviewTimer(duration, Boolean(questionData));

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const interview = await interviewApi.getInterview(interviewId);
      if (!interview.sessionData?.hardwareCheckPassed) {
        navigate(`/candidate/hardware/${interviewId}`, { replace: true });
        return;
      }
      if (interview.status === INTERVIEW_STATUS.COMPLETED) {
        navigate(`/candidate/complete/${interviewId}`, { replace: true });
        return;
      }
      const next = await interviewApi.getNextQuestion(interviewId);
      setQuestionData(next);
      clearPreview();
    } catch (err) {
      if (err.message?.includes('No more questions')) {
        navigate(`/candidate/complete/${interviewId}`, { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [interviewId, navigate, clearPreview]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  useEffect(() => {
    let stream;
    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
          await liveVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        setError(err.message || 'Camera access required');
      }
    };
    init();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  const handleSubmit = async () => {
    if (!blob || !questionData) return;
    setSubmitting(true);
    setError('');
    const idx = questionData.questionIndex;
    const timerUsed = duration - secondsLeft;

    try {
      await interviewApi.uploadRecording(interviewId, idx, blob);
      await interviewApi.saveResponseMetadata(interviewId, {
        questionIndex: idx,
        metadata: { durationMs: blob.size, timerUsedSeconds: timerUsed },
        advance: true,
      });

      try {
        await interviewApi.getNextQuestion(interviewId);
        await loadQuestion();
      } catch {
        await interviewApi.finishInterview(interviewId);
        try {
          await interviewApi.requestTranscription(interviewId);
        } catch {
          /* optional */
        }
        navigate(`/candidate/complete/${interviewId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="page-center">
          <Spinner label="Loading question..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="interview-room">
        <ProctoringMonitor />

        {error && <div className="alert alert--error">{error}</div>}
        {recorderError && <div className="alert alert--error">{recorderError}</div>}

        <div className="interview-room__grid">
          <section className="interview-room__main card">
            <QuestionDisplay
              question={questionData?.question}
              questionIndex={questionData?.questionIndex ?? 0}
              totalQuestions={questionData?.totalQuestions ?? 0}
            />
            <InterviewTimer formatted={formatted} expired={expired} secondsLeft={secondsLeft} />

            <div className="interview-room__live">
              <video ref={liveVideoRef} autoPlay muted playsInline className="interview-room__video" />
            </div>

            <RecordingControls
              recording={recording}
              hasPreview={Boolean(previewUrl)}
              onStart={startRecording}
              onStop={stopRecording}
              onClear={clearPreview}
              disabled={submitting}
            />

            <VideoPreview previewUrl={previewUrl} />

            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={!blob || submitting}
            >
              {submitting ? 'Uploading...' : 'Submit answer & continue'}
            </Button>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
