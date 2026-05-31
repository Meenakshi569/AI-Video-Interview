import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import VideoPlayer from '../../components/recruiter/VideoPlayer.jsx';
import TranscriptPanel from '../../components/recruiter/TranscriptPanel.jsx';
import SuspiciousActivityLog from '../../components/recruiter/SuspiciousActivityLog.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import * as recruiterApi from '../../api/recruiter.api.js';

export default function CandidateReviewPage() {
  const { interviewId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recruiterApi.getInterviewDetail(interviewId);
      setDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTranscribe = async () => {
    setGenerating(true);
    try {
      const transcript = await recruiterApi.requestTranscription(interviewId);
      setDetail((d) => ({ ...d, transcript }));
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="page-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (error && !detail) {
    return (
      <PageLayout>
        <div className="alert alert--error">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Link to="/recruiter" className="back-link">
        ← Back to candidates
      </Link>

      <header className="review-header card">
        <h1>{detail.candidate?.name}</h1>
        <p>{detail.candidate?.email}</p>
        <span className={`status-pill status-pill--${detail.status}`}>
          {detail.status.replace(/_/g, ' ')}
        </span>
      </header>

      <div className="review-grid">
        <section className="review-responses">
          <h2>Recorded responses</h2>
          {(detail.responses || []).map((r) => (
            <article key={r.questionIndex} className="card response-card">
              <h3>
                Q{r.questionIndex + 1}: {r.questionText || 'Question'}
              </h3>
              <VideoPlayer
                mediaUrl={r.mediaUrl}
                title={`Response ${r.questionIndex + 1}`}
              />
              {r.localPath && (
                <p className="muted storage-path">Local: {r.localPath}</p>
              )}
            </article>
          ))}
          {!detail.responses?.length && (
            <p className="empty-state">No recordings uploaded yet.</p>
          )}
        </section>

        <aside className="review-sidebar">
          <TranscriptPanel
            transcript={detail.transcript}
            onGenerate={handleTranscribe}
            generating={generating}
          />
          <SuspiciousActivityLog events={detail.suspiciousEvents} />
        </aside>
      </div>
    </PageLayout>
  );
}
