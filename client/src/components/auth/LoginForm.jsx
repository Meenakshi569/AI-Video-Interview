import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { ROLES } from '../../utils/constants.js';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      navigate(user.role === ROLES.RECRUITER ? '/recruiter' : '/candidate', {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form card" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">Log in</h1>
      <p className="auth-form__subtitle">Continue to your interview dashboard</p>

      {error && <div className="alert alert--error">{error}</div>}

      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      <Button type="submit" fullWidth disabled={submitting}>
        {submitting ? 'Signing in...' : 'Log in'}
      </Button>

      <p className="auth-form__footer">
        No account? <Link to="/register">Sign up</Link>
      </p>
    </form>
  );
}
