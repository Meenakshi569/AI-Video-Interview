import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import { ROLES } from '../../utils/constants.js';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath =
    user?.role === ROLES.RECRUITER ? '/recruiter' : '/candidate';

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          AI Video Interview
        </Link>
        <nav className="navbar__links">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="navbar__link">
                Dashboard
              </Link>
              <span className="navbar__user">
                {user.name}
                <span className="navbar__role">{user.role}</span>
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">
                Log in
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
