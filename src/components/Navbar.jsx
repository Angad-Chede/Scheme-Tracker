import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar({ user, onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mapping paths to logical names
  const pathname = location.pathname.replace('/', '') || 'home';

  const links = [
    ['home', 'Home', '/'],
    ['schemes', 'Schemes', '/schemes'],
    ['checker', 'Eligibility Checker', '/checker'],
    ['about', 'About Us', '/#about'],
    
    ...(user?.role === 'admin' ? [['admin', 'Admin', '/admin']] : []),
  ];

  const handleNavigate = (path) => {
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      if (location.pathname === '/' || location.pathname === basePath) {
        navigate(basePath);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
      // Auto scroll to top on non-hash navigation
      window.scrollTo(0, 0);
    }
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
            <div className="nav-user-info" style={{ textAlign: 'right', marginRight: '4px' }}>
              <span className="nav-user-welcome">Welcome back,</span>
              <span className="nav-user-greeting">{user.name.split(' ')[0]}</span>
            </div>
            
            <div className="nav-avatar-dropdown-container" ref={dropdownRef}>
              <div 
                className="nav-user-avatar nav-avatar-clickable"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
              </div>

              {isProfileDropdownOpen && (
                <div className="nav-profile-dropdown">
                  <button 
                    className="nav-dropdown-item" 
                    onClick={() => { handleNavigate('/dashboard'); setIsProfileDropdownOpen(false); }}
                  >
                    Dashboard
                  </button>
                  <button 
                    className="nav-dropdown-item" 
                    onClick={() => { handleNavigate('/result'); setIsProfileDropdownOpen(false); }}
                  >
                    My Results
                  </button>
                  <div className="nav-dropdown-divider"></div>
                  <button 
                    className="nav-dropdown-item text-red" 
                    onClick={() => { onSignOut(); setIsProfileDropdownOpen(false); }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
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
              <div className="nav-mobile-profile">
                <div className="nav-user-avatar">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-welcome">Welcome back,</span>
                  <span className="nav-mobile-greeting">{user.name}</span>
                </div>
              </div>

              <button 
                className={`nav-mobile-link${pathname === 'dashboard' ? ' active' : ''}`} 
                onClick={() => handleNavigate('/dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-mobile-link${pathname === 'result' ? ' active' : ''}`} 
                onClick={() => handleNavigate('/result')}
              >
                My Results
              </button>

              <div className="nav-mobile-divider" style={{ margin: '8px 0' }}></div>
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
