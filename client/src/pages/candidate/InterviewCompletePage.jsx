import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import Button from '../../components/common/Button.jsx';

export default function InterviewCompletePage() {
  const { interviewId } = useParams();

  return (
    <PageLayout centered>
      <section className="card complete-page">
        <h1>Interview complete</h1>
        <p>Thank you. Your responses have been submitted for review.</p>
        <p className="muted">Session ID: {interviewId}</p>
        <Link to="/candidate">
          <Button>Back to dashboard</Button>
        </Link>
      </section>
    </PageLayout>
  );
}
