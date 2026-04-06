import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar({ user, onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mapping paths to logical names
  const pathname = location.pathname.replace('/', '') || 'home';

  const links = [
    ['home', 'Home', '/'],
    ['checker', 'Eligibility Checker', '/checker'],
    ['schemes', 'Schemes', '/schemes'],
    ['results', 'My Results', '/results'],
    ...(user ? [['dashboard', 'Dashboard', '/dashboard']] : []),
    ...(user?.role === 'admin' ? [['admin', 'Admin', '/admin']] : []),
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => handleNavigate('/')}>Scheme<span className="nav-brand-blue">Tracker</span></div>

      {/* Desktop Links */}
      <div className="nav-links desktop-only">
        {links.map(([pg, label, path]) => (
          <button
            key={pg}
            className={`nav-link${pathname === pg ? ' active' : ''}`}
            onClick={() => handleNavigate(path)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="nav-right">
        {user ? (
          <div className="nav-user-area desktop-only">
            <span className="nav-user-greeting">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-nav-outline" onClick={onSignOut}>Sign out</button>
          </div>
        ) : (
          <div className="nav-auth-btns desktop-only">
            <button className="nav-signin-link" onClick={() => handleNavigate('/login')}>Sign in</button>
            <button className="btn-nav-primary" onClick={() => handleNavigate('/signup')}>Sign up</button>
          </div>
        )}

        {/* Mobile Toggle Button */}
        <button 
          className="nav-mobile-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-mobile-links">
          {links.map(([pg, label, path]) => (
            <button
              key={pg}
              className={`nav-mobile-link${pathname === pg ? ' active' : ''}`}
              onClick={() => handleNavigate(path)}
            >
              {label}
            </button>
          ))}
          <div className="nav-mobile-divider"></div>
          {user ? (
            <div className="nav-mobile-user">
              <span className="nav-mobile-greeting">Hi, {user.name}</span>
              <button className="nav-mobile-btn sign-out-minimal" onClick={onSignOut}>Sign out</button>
            </div>
          ) : (
            <div className="nav-mobile-auth">
              <button className="nav-mobile-btn sign-in-minimal" onClick={() => handleNavigate('/login')}>Sign in</button>
              <button className="btn-nav-primary mobile-wide" onClick={() => handleNavigate('/signup')}>Sign up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
