import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROLES } from '../utils/constants.js';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath =
    user?.role === ROLES.RECRUITER ? '/recruiter' : '/candidate';

  return (
    <PageLayout>
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">Phase 1 — Foundation</span>
          <h1 className="hero__title">
            AI-powered video interviews that scale
          </h1>
          <p className="hero__text">
            Automate first-round screening with recorded responses, real-time
            proctoring, and recruiter dashboards — built for async hiring at
            scale.
          </p>
          <div className="hero__actions">
            {isAuthenticated ? (
              <Link to={dashboardPath}>
                <Button>Go to dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button>Get started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Log in</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero__features">
          <article className="feature-card">
            <h3>Candidate flow</h3>
            <p>Hardware check, guided questions, and chunked video capture.</p>
          </article>
          <article className="feature-card">
            <h3>Recruiter dashboard</h3>
            <p>Review transcripts, playback, and integrity flags in one view.</p>
          </article>
          <article className="feature-card">
            <h3>Cloud-ready storage</h3>
            <p>Local disk today; swap to S3/R2 when you scale.</p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
