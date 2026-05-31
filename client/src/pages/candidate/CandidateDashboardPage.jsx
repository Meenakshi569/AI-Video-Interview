import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import * as interviewApi from '../../api/interview.api.js';
import { INTERVIEW_STATUS } from '../../utils/constants.js';

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    interviewApi
      .getMyInterviews()
      .then(setInterviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    setError('');
    try {
      const interview = await interviewApi.startInterview();
      if (interview.sessionData?.hardwareCheckPassed) {
        navigate(`/candidate/interview/${interview.id}`);
      } else {
        navigate(`/candidate/hardware/${interview.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  };

  const resume = (item) => {
    if (item.status === INTERVIEW_STATUS.COMPLETED) {
      navigate(`/candidate/complete/${item.id}`);
      return;
    }
    if (item.sessionData?.hardwareCheckPassed) {
      navigate(`/candidate/interview/${item.id}`);
    } else {
      navigate(`/candidate/hardware/${item.id}`);
    }
  };

  const active = interviews.find(
    (i) =>
      i.status === INTERVIEW_STATUS.PENDING_HARDWARE ||
      i.status === INTERVIEW_STATUS.IN_PROGRESS
  );

  return (
    <PageLayout>
      <section className="dashboard card">
        <h1>Candidate dashboard</h1>
        <p className="dashboard__welcome">
          Welcome, <strong>{user.name}</strong>
        </p>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="dashboard__actions">
          {active ? (
            <Button onClick={() => resume(active)}>Resume interview</Button>
          ) : (
            <Button onClick={handleStart} disabled={starting}>
              {starting ? 'Starting...' : 'Start new interview'}
            </Button>
          )}
        </div>

        {loading ? (
          <Spinner label="Loading interviews..." />
        ) : (
          <div className="dashboard__list">
            <h2>Your interviews</h2>
            {interviews.length === 0 ? (
              <p className="muted">No interviews yet. Start one above.</p>
            ) : (
              <ul className="interview-list">
                {interviews.map((item) => (
                  <li key={item.id}>
                    <span className={`status-pill status-pill--${item.status}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    <span>{new Date(item.updatedAt).toLocaleString()}</span>
                    <button type="button" className="link-btn" onClick={() => resume(item)}>
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <ul className="dashboard__checklist">
          <li className="done">JWT authentication</li>
          <li className="done">Hardware check</li>
          <li className="done">Video recording &amp; upload</li>
          <li className="done">Proctoring logs</li>
        </ul>
      </section>
    </PageLayout>
  );
}
