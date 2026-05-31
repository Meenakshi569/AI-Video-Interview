import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { ROLES } from '../../utils/constants.js';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.CANDIDATE);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await register({ name, email, password, role });
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
      <h1 className="auth-form__title">Create account</h1>
      <p className="auth-form__subtitle">Join as a candidate or recruiter</p>

      {error && <div className="alert alert--error">{error}</div>}

      <Input
        id="name"
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
        required
        autoComplete="name"
      />
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
        placeholder="At least 6 characters"
        required
        autoComplete="new-password"
      />

      <div className="form-field">
        <span className="form-field__label">I am a</span>
        <div className="role-picker">
          <label className="role-picker__option">
            <input
              type="radio"
              name="role"
              value={ROLES.CANDIDATE}
              checked={role === ROLES.CANDIDATE}
              onChange={() => setRole(ROLES.CANDIDATE)}
            />
            Candidate
          </label>
          <label className="role-picker__option">
            <input
              type="radio"
              name="role"
              value={ROLES.RECRUITER}
              checked={role === ROLES.RECRUITER}
              onChange={() => setRole(ROLES.RECRUITER)}
            />
            Recruiter
          </label>
        </div>
      </div>

      <Button type="submit" fullWidth disabled={submitting}>
        {submitting ? 'Creating account...' : 'Sign up'}
      </Button>

      <p className="auth-form__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
