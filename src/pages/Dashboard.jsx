import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { checkEligibility } from '../data';
import { getAllActiveSchemes } from '../lib/schemeService';
import { Lock, FileText, CheckCircle, Clock, Bookmark, Sparkles, ChevronRight, User, MapPin, Mail, ClipboardList } from 'lucide-react';

export default function Dashboard({ user, onRemoveBookmark }) {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    async function loadSchemes() {
      try {
        setLoading(true);
        setFetchError('');
        const data = await getAllActiveSchemes();
        setSchemes(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setFetchError('Failed to load dashboard data.');
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  if (!user) {
    return (
      <div className="dash-empty" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', justifyContent: 'center' }}>
        <div className="dash-empty-icon"><Lock size={48} strokeWidth={1} /></div>
        <h3 className="dash-empty-title">Please sign in</h3>
        <p className="dash-empty-desc">You need to be signed in to view your dashboard.</p>
        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/login')}>
          Sign In
        </button>
      </div>
    );
  }

  const profile = user.profile;

  const pctFields = profile
    ? ['age', 'gender', 'state', 'income', 'occupation', 'education', 'familySize'].filter((k) => profile[k]).length +
      ((profile.documents || []).length > 0 ? 1 : 0)
    : 0;

  const pct = Math.round((pctFields / 8) * 100);

  const results = profile
    ? schemes.map((s) => ({ s, r: checkEligibility(s, profile) }))
    : [];

  const eligible = results.filter((x) => x.r.status === 'eligible');
  const partial = results.filter((x) => x.r.status === 'partial');
  const bookmarked = schemes.filter((s) => (user.bookmarks || []).includes(s.id));

  const missingDocsSuggestion =
    partial.length > 0
      ? [...new Set(partial.flatMap((x) => x.r.missingDocs || []))].slice(0, 3)
      : [];

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <div className="dash-sidebar">
        <div className="dash-sidebar-header">
          <div className="dash-avatar">
            <User size={24} />
          </div>
          <div className="dash-user-info">
            <div className="dash-user-name">{user.name}</div>
            <div className="dash-user-detail"><Mail size={12} /> {user.email}</div>
            {profile?.state && <div className="dash-user-detail"><MapPin size={12} /> {profile.state}</div>}
          </div>
        </div>

        <div className="dash-nav">
          <div className="dash-nav-item active" onClick={() => {}}>Overview</div>
          <div className="dash-nav-item" onClick={() => navigate('/results')}>My Results</div>
          <div className="dash-nav-item" onClick={() => navigate('/schemes')}>Explore Schemes</div>
          <div className="dash-nav-item" onClick={() => navigate('/checker')}>Check Eligibility</div>
        </div>
      </div>

      {/* Main content */}
      <div className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="dash-meta">Here is your scheme eligibility overview</p>
          </div>
        </div>

        {loading && (
          <div className="dash-card">
            <div style={{ color: '#64748b' }}>Loading dashboard data...</div>
          </div>
        )}

        {fetchError && (
          <div className="dash-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ color: '#ef4444' }}>{fetchError}</div>
          </div>
        )}

        {/* Profile completion */}
        {pct < 100 && !loading && !fetchError && (
          <div className="dash-profile-banner">
            <div className="dpb-content">
              <div className="dpb-label">Complete your profile for better results</div>
              <div className="dpb-track">
                <div className="dpb-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="dpb-pct">{pct}% complete</div>
            </div>
            <button className="dpb-btn" onClick={() => navigate('/checker')}>
              Complete Profile
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="dash-stats">
          <div className="dash-stat-box">
            <div className="dsb-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}><CheckCircle size={20} /></div>
            <div className="dsb-info">
              <div className="dsb-num">{eligible.length}</div>
              <div className="dsb-label">Eligible Schemes</div>
            </div>
          </div>
          <div className="dash-stat-box">
            <div className="dsb-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}><Clock size={20} /></div>
            <div className="dsb-info">
              <div className="dsb-num">{partial.length}</div>
              <div className="dsb-label">Partially Eligible</div>
            </div>
          </div>
          <div className="dash-stat-box">
            <div className="dsb-icon" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}><Bookmark size={20} /></div>
            <div className="dsb-info">
              <div className="dsb-num">{bookmarked.length}</div>
              <div className="dsb-label">Saved Schemes</div>
            </div>
          </div>
          <div className="dash-stat-box">
            <div className="dsb-icon" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}><FileText size={20} /></div>
            <div className="dsb-info">
              <div className="dsb-num">{(profile?.documents || []).length}</div>
              <div className="dsb-label">Documents Ready</div>
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        {profile ? (
          <div className="dash-ai-panel">
            <div className="dai-glow"></div>
            <div className="dai-content">
              <div className="dai-icon">
                <Sparkles size={24} color="#4f46e5" />
              </div>
              <div className="dai-text-wrap">
                <h3 className="dai-title">AI Assistant Analysis</h3>
                <p className="dai-text">
                  Based on your profile, you tightly match <strong style={{ color: '#0f172a' }}>{eligible.length} scheme{eligible.length !== 1 ? 's' : ''}</strong> and are partially eligible for <strong style={{ color: '#0f172a' }}>{partial.length} more</strong>.
                  {missingDocsSuggestion.length > 0 && ` To unlock more benefits, consider arranging: ${missingDocsSuggestion.join(', ')}.`}
                  {eligible.length === 0 && !profile.age ? ' Complete your profile parameters to see personalized scheme results.' : ''}
                </p>
              </div>
              <button className="dai-btn" onClick={() => navigate('/results')}>
                Full Analysis <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="dash-empty">
            <div className="dash-empty-icon"><ClipboardList size={40} strokeWidth={1.5} color="#94a3b8" /></div>
            <h3 className="dash-empty-title">Profile Incomplete</h3>
            <p className="dash-empty-desc">Answer a few quick questions to discover all the government schemes you qualify for.</p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/checker')}>
              Start Eligibility Check
            </button>
          </div>
        )}

        <div className="dash-grid-2">
          {/* Top Eligible */}
          {eligible.length > 0 && (
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h3 className="dash-panel-title">Top Eligible Schemes</h3>
                <button className="dash-ghost-btn" onClick={() => navigate('/results')}>View All</button>
              </div>
              <div className="dash-list">
                {eligible.slice(0, 4).map(({ s }) => {
                  const benefits = Array.isArray(s.benefits) ? s.benefits : [];
                  return (
                    <div key={s.id} className="dash-list-item">
                      <div className="dli-info">
                        <div className="dli-name">{s.title}</div>
                        <div className="dli-meta">{benefits[0] || 'Benefit available'}</div>
                      </div>
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="dash-apply-btn">
                        Apply
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bookmarked */}
          {bookmarked.length > 0 && (
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h3 className="dash-panel-title">Saved Schemes</h3>
                <button className="dash-ghost-btn" onClick={() => navigate('/schemes')}>Explore</button>
              </div>
              <div className="dash-list">
                {bookmarked.map((s) => (
                  <div key={s.id} className="dash-list-item">
                    <div className="dli-info">
                      <div className="dli-name">{s.title}</div>
                      <div className="dli-meta">{s.cat} • {s.ministry}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="dash-action-btn" onClick={() => onRemoveBookmark(s.id)}>Remove</button>
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="dash-apply-btn">
                        Apply
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}