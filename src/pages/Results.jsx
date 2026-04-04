import { useEffect, useMemo, useState } from 'react';
import '../styles/results.css';
import { checkEligibility } from '../data';
import { getAllActiveSchemes } from '../lib/schemeService';

export default function Results({ user, navigate, resultFilter, setResultFilter, onToggleBookmark }) {
  const [openDetails, setOpenDetails] = useState({});
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const profile = user?.profile;

  useEffect(() => {
    async function loadSchemes() {
      try {
        setLoading(true);
        setFetchError('');

        const data = await getAllActiveSchemes();
        setSchemes(data);
      } catch (err) {
        console.error('Results fetch error:', err);
        setFetchError('Failed to load schemes. Please try again.');
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    }

    loadSchemes();
  }, []);

  if (!profile) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3 style={{ marginBottom: '8px' }}>No profile found</h3>
          <p>Please fill your details first</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('checker')}>
            Fill Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="results-wrapper">
        <div className="empty">
          <div className="empty-icon">⏳</div>
          <h3 style={{ marginBottom: '8px' }}>Loading your schemes...</h3>
          <p>Fetching schemes from the database and checking your eligibility.</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="results-wrapper">
        <div className="empty">
          <div className="empty-icon">⚠️</div>
          <h3 style={{ marginBottom: '8px' }}>Couldn’t load schemes</h3>
          <p>{fetchError}</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const results = schemes
    .map((s) => ({ scheme: s, result: checkEligibility(s, profile) }))
    .sort((a, b) => b.result.score - a.result.score);

  const eligible = results.filter((r) => r.result.status === 'eligible');
  const partial = results.filter((r) => r.result.status === 'partial');
  const notElig = results.filter((r) => r.result.status === 'not-eligible');

  const filtered =
    resultFilter === 'eligible'
      ? eligible
      : resultFilter === 'partial'
      ? partial
      : resultFilter === 'not'
      ? notElig
      : results;

  return (
    <div className="results-wrapper">
      <div className="results-header">
        <div>
          <h1 className="results-title">Your Eligibility Results</h1>
          <p className="results-subtitle">Based on your profile — {profile.fullName || user?.name || ''}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('checker')}>
          Update Profile
        </button>
      </div>

      <div className="g3 results-stats">
        <div className="stat" style={{ borderTop: '3px solid var(--green)' }}>
          <div className="stat-n" style={{ color: 'var(--green)' }}>{eligible.length}</div>
          <div className="stat-l">Fully Eligible</div>
        </div>
        <div className="stat" style={{ borderTop: '3px solid var(--amber)' }}>
          <div className="stat-n" style={{ color: 'var(--amber)' }}>{partial.length}</div>
          <div className="stat-l">Partially Eligible</div>
        </div>
        <div className="stat" style={{ borderTop: '3px solid var(--red)' }}>
          <div className="stat-n" style={{ color: 'var(--red)' }}>{notElig.length}</div>
          <div className="stat-l">Not Eligible</div>
        </div>
      </div>

      <div className="results-filters">
        {[['all', 'All Results'], ['eligible', '✅ Eligible'], ['partial', '⚠️ Partial'], ['not', '❌ Not Eligible']].map(([k, l]) => (
          <button key={k} className={`chip${resultFilter === k ? ' on' : ''}`} onClick={() => setResultFilter(k)}>
            {l}
          </button>
        ))}
      </div>

      <div className="results-list">
        {filtered.map(({ scheme, result }) => {
          const bdrColor =
            result.status === 'eligible'
              ? 'var(--green)'
              : result.status === 'partial'
              ? 'var(--amber)'
              : 'var(--red)';

          const scoreColor =
            result.score >= 80
              ? 'var(--green)'
              : result.score >= 50
              ? 'var(--amber)'
              : 'var(--red)';

          const isBm = (user?.bookmarks || []).includes(scheme.id);
          const isOpen = openDetails[scheme.id];

          const benefits = Array.isArray(scheme.benefits) ? scheme.benefits : [];

          const statusBadge =
            result.status === 'eligible'
              ? <span className="badge b-green">✅ Eligible</span>
              : result.status === 'partial'
              ? <span className="badge b-amber">⚠️ Partially Eligible</span>
              : <span className="badge b-red">❌ Not Eligible</span>;

          return (
            <div key={scheme.id} className="card" style={{ borderLeft: `4px solid ${bdrColor}` }}>
              <div className="result-card">
                <div className="result-card-left">
                  <div className="result-card-badges">
                    {statusBadge}
                    <span className="badge b-blue">{scheme.cat}</span>
                    <span className="badge b-gray">{scheme.ministry}</span>
                  </div>

                  <h3 className="result-card-title">{scheme.title}</h3>
                  <p className="result-card-short">{scheme.short}</p>

                  <div>
                    {benefits.slice(0, 3).map((b) => (
                      <span key={b} className="tag">✓ {b}</span>
                    ))}
                  </div>
                </div>

                <div className="result-card-right">
                  <div style={{ textAlign: 'center' }}>
                    <div className="result-score-number" style={{ fontSize: '30px', fontWeight: 800, color: scoreColor }}>
                      {result.score}%
                    </div>
                    <div className="result-score-label">eligibility</div>
                  </div>

                  <div className="result-card-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: isBm ? 'var(--blue)' : 'var(--text3)' }}
                      onClick={() => onToggleBookmark(scheme.id)}
                    >
                      🔖 {isBm ? 'Saved' : 'Save'}
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setOpenDetails((d) => ({ ...d, [scheme.id]: !d[scheme.id] }))}
                    >
                      {isOpen ? '▲ Less' : '▼ Details'}
                    </button>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="result-details">
                  <div className="g2 result-details-grid">
                    <div>
                      <div className="result-detail-heading-met">Criteria Met ({result.matched.length})</div>
                      {result.matched.length > 0
                        ? result.matched.map((m) => <div key={m} className="result-detail-item">✓ {m}</div>)
                        : <div style={{ fontSize: '13px', color: 'var(--text3)' }}>No restrictions</div>
                      }
                    </div>

                    <div>
                      {result.missing.length > 0 && (
                        <>
                          <div className="result-detail-heading-miss">❌ Missing Criteria</div>
                          {result.missing.map((m) => <div key={m} className="result-detail-item">✗ {m}</div>)}
                        </>
                      )}

                      {result.missingDocs.length > 0 && (
                        <>
                          <div className="result-detail-heading-docs">Missing Documents</div>
                          {result.missingDocs.map((d) => <div key={d} className="result-detail-item">⚠ {d}</div>)}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="result-apply-row">
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      🔗 Apply Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}