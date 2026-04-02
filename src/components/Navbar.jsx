import '../styles/navbar.css';

export default function Navbar({ page, user, navigate, onSignOut }) {
  const links = [
    ['home', 'Home'],
    ['checker', 'Eligibility Checker'],
    ['schemes', 'Schemes'],
    ['results', 'My Results'],
    ...(user ? [['dashboard', 'Dashboard']] : []),
    ...(user?.role === 'admin' ? [['admin', 'Admin']] : []),
  ];

  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => navigate('home')}>Scheme<span className="nav-brand-blue">Tracker</span></div>

      <div className="nav-links">
        {links.map(([pg, label]) => (
          <button
            key={pg}
            className={`nav-link${page === pg ? ' active' : ''}`}
            onClick={() => navigate(pg)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user-greeting">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-crazy-ghost" onClick={onSignOut}><span>↩ Sign out</span></button>
          </>
        ) : (
          <>
            <button className="btn-crazy-ghost" onClick={() => navigate('login')}><span>Sign in</span></button>
            <button className="btn-crazy-primary" onClick={() => navigate('signup')}>Sign up</button>
          </>
        )}
      </div>
    </nav>
  );
}
