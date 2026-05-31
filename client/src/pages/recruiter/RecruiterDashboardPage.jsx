import { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import CandidateTable from '../../components/recruiter/CandidateTable.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import * as recruiterApi from '../../api/recruiter.api.js';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    recruiterApi
      .listInterviews()
      .then(setInterviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <section className="dashboard card">
        <h1>Recruiter dashboard</h1>
        <p className="dashboard__welcome">
          Welcome, <strong>{user.name}</strong>
        </p>
        <p className="dashboard__hint">
          Review candidate interviews, play recordings, and inspect proctoring flags.
        </p>

        {error && <div className="alert alert--error">{error}</div>}
        {loading ? <Spinner label="Loading candidates..." /> : <CandidateTable interviews={interviews} />}
      </section>
    </PageLayout>
  );
}
