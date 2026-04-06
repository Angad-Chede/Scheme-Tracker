import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/results.css';
import { checkEligibility } from '../data';
import { getAllActiveSchemes } from '../lib/schemeService';
import {
  ClipboardList,
  Loader,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ExternalLink,
  Check
} from 'lucide-react';

export default function Results({ user, resultFilter, setResultFilter, onToggleBookmark }) {
  const navigate = useNavigate();
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
      <div className="res-empty-wrapper">
        <div className="res-empty-state">
          <div className="res-empty-icon"><ClipboardList size={48} strokeWidth={1} color="#94a3b8" /></div>
          <h3 className="res-empty-title">No profile found</h3>
          <p className="res-empty-desc">Please fill out your details to see personalized scheme matches.</p>
          <button className="res-apply-link" style={{ marginTop: '20px', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/checker')}>
            Fill Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="res-empty-wrapper">
        <div className="res-empty-state">
          <div className="res-empty-icon animate-spin"><Loader size={48} strokeWidth={1} color="#4f46e5" /></div>
          <h3 className="res-empty-title">Analyzing Eligibility...</h3>
          <p className="res-empty-desc">Matching your profile against government databases.</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="res-empty-wrapper">
        <div className="res-empty-state">
          <div className="res-empty-icon"><AlertTriangle size={48} strokeWidth={1} color="#ef4444" /></div>
          <h3 className="res-empty-title">Couldn't load schemes</h3>
          <p className="res-empty-desc">{fetchError}</p>
          <button className="res-apply-link" style={{ marginTop: '20px', border: 'none', cursor: 'pointer' }} onClick={() => window.location.reload()}>
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
    <div className="res-layout">
      <div className="res-container">
        
        <div className="res-header">
          <div className="res-header-info">
            <h1 className="res-title">Your Eligibility Results</h1>
            <p className="res-subtitle">Analysis for <strong>{profile.fullName || user?.name || ''}</strong></p>
          </div>
          <button className="res-update-btn" onClick={() => navigate('/checker')}>
            Update Profile
          </button>
        </div>

        <div className="res-stats">
          <div className="res-stat-box" onClick={() => setResultFilter('eligible')} style={{ cursor: 'pointer', borderTop: resultFilter === 'eligible' ? '3px solid #10b981' : '1px solid transparent' }}>
            <div className="rsb-num" style={{ color: '#10b981' }}>{eligible.length}</div>
            <div className="rsb-label">Fully Eligible</div>
          </div>
          <div className="res-stat-box" onClick={() => setResultFilter('partial')} style={{ cursor: 'pointer', borderTop: resultFilter === 'partial' ? '3px solid #f59e0b' : '1px solid transparent' }}>
            <div className="rsb-num" style={{ color: '#f59e0b' }}>{partial.length}</div>
            <div className="rsb-label">Partially Eligible</div>
          </div>
          <div className="res-stat-box" onClick={() => setResultFilter('not')} style={{ cursor: 'pointer', borderTop: resultFilter === 'not' ? '3px solid #ef4444' : '1px solid transparent' }}>
            <div className="rsb-num" style={{ color: '#ef4444' }}>{notElig.length}</div>
            <div className="rsb-label">Not Eligible</div>
          </div>
        </div>

        <div className="res-filters">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'eligible', label: 'Eligible', icon: <CheckCircle size={14} /> },
            { id: 'partial', label: 'Partial', icon: <AlertCircle size={14} /> },
            { id: 'not', label: 'Not Eligible', icon: <XCircle size={14} /> }
          ].map((f) => (
            <button
              key={f.id}
              className={`res-filter-pill ${resultFilter === f.id ? 'active' : ''}`}
              onClick={() => setResultFilter(f.id)}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        <div className="res-list">
          {filtered.length === 0 && (
            <div className="res-empty-state" style={{ minHeight: '30vh', border: '1px dashed #cbd5e1' }}>
              <p className="res-empty-desc">No schemes match this filter.</p>
            </div>
          )}

          {filtered.map(({ scheme, result }) => {
            const isEligible = result.status === 'eligible';
            const isPartial = result.status === 'partial';
            const isNot = result.status === 'not-eligible';

            const statusColor = isEligible ? '#10b981' : isPartial ? '#f59e0b' : '#ef4444';
            const statusBg = isEligible ? 'rgba(16, 185, 129, 0.1)' : isPartial ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            
            const isBm = (user?.bookmarks || []).includes(scheme.id);
            const isOpen = openDetails[scheme.id];

            const benefits = Array.isArray(scheme.benefits) ? scheme.benefits : [];

            return (
              <div key={scheme.id} className={`res-item ${isOpen ? 'open' : ''}`}>
                <div className="res-item-main">
                  
                  <div className="res-item-left">
                    <div className="res-item-badges">
                      <span className="res-badge-status" style={{ color: statusColor, background: statusBg }}>
                        {isEligible && <CheckCircle size={12} />}
                        {isPartial && <AlertCircle size={12} />}
                        {isNot && <XCircle size={12} />}
                        {isEligible ? 'Eligible' : isPartial ? 'Partial' : 'Not Eligible'}
                      </span>
                      <span className="res-badge-cat">{scheme.cat}</span>
                    </div>

                    <h3 className="res-item-title">{scheme.title}</h3>
                    <p className="res-item-desc">{scheme.short}</p>

                    <div className="res-item-benefits">
                      {benefits.slice(0, 3).map((b) => (
                        <span key={b} className="rib-tag"><Check size={12} /> {b}</span>
                      ))}
                    </div>
                  </div>

                  <div className="res-item-right">
                    <div className="res-score-block">
                      <div className="rs-val" style={{ color: statusColor }}>{result.score}%</div>
                      <div className="rs-lbl">Eligibility</div>
                    </div>

                    <div className="res-item-actions">
                      <button
                        className="res-icon-btn"
                        style={{ color: isBm ? '#3b82f6' : '#64748b' }}
                        onClick={() => onToggleBookmark(scheme.id)}
                        title={isBm ? "Remove Bookmark" : "Bookmark Scheme"}
                      >
                        <Bookmark size={18} fill={isBm ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        className={`res-details-toggle ${isOpen ? 'active' : ''}`}
                        onClick={() => setOpenDetails((d) => ({ ...d, [scheme.id]: !d[scheme.id] }))}
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isOpen ? 'Less' : 'Details'}
                      </button>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="res-item-expanded">
                    <div className="rie-grid">
                      <div className="rie-col">
                        <h4 className="rie-heading text-met">Criteria Met ({result.matched.length})</h4>
                        {result.matched.length > 0 ? (
                          <ul className="rie-list text-met">
                            {result.matched.map((m) => <li key={m}><CheckCircle size={14} /> {m}</li>)}
                          </ul>
                        ) : (
                          <div className="rie-empty">No criteria met</div>
                        )}
                      </div>

                      <div className="rie-col">
                         <h4 className="rie-heading text-miss">Missing Requirements</h4>
                         {result.missing.length > 0 || result.missingDocs.length > 0 ? (
                           <ul className="rie-list text-miss">
                             {result.missing.map((m) => <li key={m}><XCircle size={14} /> {m}</li>)}
                             {result.missingDocs.map((d) => <li key={d} className="text-warn"><AlertTriangle size={14} /> Doc: {d}</li>)}
                           </ul>
                         ) : (
                           <div className="rie-empty">None detected</div>
                         )}
                      </div>
                    </div>

                    <div className="rie-footer">
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="res-apply-link">
                        Apply on Official Portal <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}