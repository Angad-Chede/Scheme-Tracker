import '../styles/dashboard.css';
import { SCHEMES, checkEligibility } from '../data';

export default function Dashboard({ user, navigate, onRemoveBookmark }) {
  if (!user) {
    return (
      <div className="empty" style={{ padding: '80px 20px' }}>
        <div className="empty-icon">🔒</div>
        <h3>Please sign in</h3>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('login')}>Sign In</button>
      </div>
    );
  }

  const profile = user.profile;
  const pctFields = profile
    ? ['age', 'gender', 'state', 'income', 'occupation', 'education', 'familySize'].filter(k => profile[k]).length
      + ((profile.documents || []).length > 0 ? 1 : 0)
    : 0;
  const pct = Math.round(pctFields / 8 * 100);

  const results = profile ? SCHEMES.map(s => ({ s, r: checkEligibility(s, profile) })) : [];
  const eligible = results.filter(x => x.r.status === 'eligible');
  const partial = results.filter(x => x.r.status === 'partial');
  const bookmarked = SCHEMES.filter(s => (user.bookmarks || []).includes(s.id));
  const missingDocsSuggestion = partial.length > 0
    ? [...new Set(partial.flatMap(x => x.r.missingDocs || []))].slice(0, 3)
    : [];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-email">{user.email}</div>
          {profile?.state && <div className="sidebar-user-location">📍 {profile.state}</div>}
        </div>
        {[
          ['Overview', () => {}],
          ['My Results', () => navigate('results')],
          ['Explore Schemes', () => navigate('schemes')],
          ['Check Eligibility', () => navigate('checker')],
        ].map(([label, fn]) => (
          <div key={label} className="si" onClick={fn}>{label}</div>
        ))}
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        <h1 className="dashboard-greeting">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="dashboard-meta">Here's your scheme eligibility overview</p>

        {/* Profile completion */}
        {pct < 100 && (
          <div className="card profile-completion-card">
            <div className="profile-completion-header">
              <div className="profile-completion-label">Complete your profile for better results</div>
              <span className="badge b-blue">{pct}% complete</span>
            </div>
            <div className="pbar profile-completion-bar">
              <div className="pfill" style={{ width: `${pct}%`, background: 'var(--blue)' }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('checker')}>Complete Profile</button>
          </div>
        )}

        {/* Stats */}
        <div className="g4 dashboard-stats">
          <div className="stat" style={{ borderTop: '3px solid var(--green)' }}>
            <div className="stat-n" style={{ color: 'var(--green)' }}>{eligible.length}</div>
            <div className="stat-l">Eligible Schemes</div>
          </div>
          <div className="stat" style={{ borderTop: '3px solid var(--amber)' }}>
            <div className="stat-n" style={{ color: 'var(--amber)' }}>{partial.length}</div>
            <div className="stat-l">Partially Eligible</div>
          </div>
          <div className="stat">
            <div className="stat-n">{bookmarked.length}</div>
            <div className="stat-l">Saved Schemes</div>
          </div>
          <div className="stat">
            <div className="stat-n">{(profile?.documents || []).length}</div>
            <div className="stat-l">Documents Ready</div>
          </div>
        </div>

        {/* Top eligible schemes */}
        {eligible.length > 0 && (
          <div className="card dashboard-eligible-card">
            <div className="dashboard-eligible-header">
              <h3 className="dashboard-eligible-title">✅ Top Eligible Schemes</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('results')}>View All</button>
            </div>
            <div className="eligible-list">
              {eligible.slice(0, 4).map(({ s }) => (
                <div key={s.id} className="eligible-item">
                  <div>
                    <div className="eligible-item-name">{s.title}</div>
                    <div className="eligible-item-benefit">{s.benefits[0]}</div>
                  </div>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Apply</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks */}
        {bookmarked.length > 0 && (
          <div className="card bookmarks-card">
            <h3 className="bookmarks-title"> Saved Schemes</h3>
            <div className="bookmarks-list">
              {bookmarked.map(s => (
                <div key={s.id} className="bookmark-item">
                  <div>
                    <div className="bookmark-item-name">{s.title}</div>
                    <div className="bookmark-item-meta">{s.cat} · {s.ministry}</div>
                  </div>
                  <div className="bookmark-item-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => onRemoveBookmark(s.id)}>Remove</button>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Apply</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Assistant / Empty state */}
        {profile ? (
          <div className="card ai-card">
            <div className="ai-card-inner">
              <div className="ai-icon">🤖</div>
              <div>
                <h3 className="ai-title">AI Assistant</h3>
                <div className="ai-text">
                  Based on your profile, you qualify for {eligible.length} scheme{eligible.length !== 1 ? 's' : ''} and are partially eligible for {partial.length} more.
                  {missingDocsSuggestion.length > 0 && ` To unlock more benefits, arrange: ${missingDocsSuggestion.join(', ')}.`}
                  {eligible.length === 0 && !profile.age ? ' Complete your profile to see personalised results.' : ''}
                </div>
                <button className="btn btn-sm ai-btn" onClick={() => navigate('results')}>See Full Analysis →</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty dashboard-empty-prompt">
            <div className="empty-icon">📋</div>
            <h3 style={{ marginBottom: '6px' }}>Fill your profile to get personalised results</h3>
            <p>Answer a few questions to discover all schemes you qualify for</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('checker')}>Start Eligibility Check</button>
          </div>
        )}
      </div>
    </div>
  );
}
