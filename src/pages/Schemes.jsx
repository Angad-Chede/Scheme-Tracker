import { useState } from 'react';
import '../styles/schemes.css';
import { SCHEMES, CATS } from '../data';

export default function Schemes({ search, setSearch, cat, setCat, btype, setBtype, user, navigate, onToggleBookmark, showToast }) {
  const [expandedId, setExpandedId] = useState(null);
  const btypes = [...new Set(SCHEMES.map(s => s.btype))];

  const filtered = SCHEMES.filter(s => {
    const q = search.toLowerCase();
    if (search && !s.title.toLowerCase().includes(q) && !s.short.toLowerCase().includes(q) && !s.tags.some(t => t.includes(q))) return false;
    if (cat && s.cat !== cat) return false;
    if (btype && s.btype !== btype) return false;
    return true;
  }).sort((a, b) => b.pop - a.pop);

  function handleBookmark(e, id) {
    e.stopPropagation();
    if (!user) { showToast('Sign in to bookmark schemes', 'error'); return; }
    onToggleBookmark(id);
  }

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  function handleClear() {
    setSearch('');
    setCat('');
    setBtype('');
  }

  // Count helper
  const getCount = (c) => SCHEMES.filter(s => s.cat === c).length;

  return (
    <div className="schemes-container page-fade-in">
      <aside className="schemes-sidebar">
        <div className="sidebar-header">
          <h2>Search</h2>
          <button className="btn-clear" onClick={handleClear}>Clear</button>
        </div>

        <div className="sidebar-search-box">
          <input 
            type="text"
            className="sidebar-search-input" 
            placeholder="Search schemes..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          {search && <button className="btn-search-close" onClick={() => setSearch('')}>×</button>}
        </div>

        <div>
          <h3 className="filter-section-title">Categories</h3>
          <ul className="filter-list">
            <li className={`filter-item ${!cat ? 'active' : ''}`} onClick={() => setCat('')}>
              <div className="filter-label-group">
                <div className="filter-checkbox"></div>
                <span>All Categories</span>
              </div>
              <span className="filter-count">{SCHEMES.length}</span>
            </li>
            {CATS.map(c => (
              <li key={c} className={`filter-item ${cat === c ? 'active' : ''}`} onClick={() => setCat(cat === c ? '' : c)}>
                <div className="filter-label-group">
                  <div className="filter-checkbox"></div>
                  <span>{c}</span>
                </div>
                <span className="filter-count">{getCount(c)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 className="filter-section-title">Benefit Type</h3>
          <ul className="filter-list">
            <li className={`filter-item ${!btype ? 'active' : ''}`} onClick={() => setBtype('')}>
              <div className="filter-label-group">
                <div className="filter-checkbox"></div>
                <span>All Benefit Types</span>
              </div>
            </li>
            {btypes.map(b => (
              <li key={b} className={`filter-item ${btype === b ? 'active' : ''}`} onClick={() => setBtype(btype === b ? '' : b)}>
                <div className="filter-label-group">
                  <div className="filter-checkbox"></div>
                  <span>{b}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="schemes-main">
        <div className="main-header">
          <h1 className="main-title">Government Schemes</h1>
          <div className="main-count">{filtered.length} matching programs available</div>
        </div>

        {filtered.length > 0 ? (
          <div className="schemes-list">
            {filtered.map(s => {
              const isBm = (user?.bookmarks || []).includes(s.id);
              const isExpanded = expandedId === s.id;
              return (
                <div key={s.id} className={`scheme-row-container ${isExpanded ? 'expanded' : ''}`}>
                  <div className="scheme-row" onClick={() => toggleExpand(s.id)}>
                    <div className="scheme-icon-box">{s.title.charAt(0)}</div>
                    <div className="scheme-info-col">
                      <div className="scheme-row-title">{s.title}</div>
                      <div className="scheme-row-ministry">{s.ministry}</div>
                    </div>
                    <div className="scheme-badge-group">
                      <span className="badge b-blue">{s.cat}</span>
                      <span className="badge b-gray">{s.btype}</span>
                    </div>
                    <div className="scheme-action-col">
                      <button className="btn btn-ghost btn-sm" onClick={(e) => handleBookmark(e, s.id)}>
                        <span style={{ color: isBm ? 'var(--blue)' : 'var(--text3)' }}>{isBm ? 'Bookmarked' : 'Bookmark'}</span>
                      </button>
                      <span style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                    </div>
                  </div>
                  
                  <div className="scheme-detail-panel">
                    <div className="detail-content">
                      <div className="detail-main">
                        <div className="detail-desc-section">
                          <h4>About the Scheme</h4>
                          <p className="detail-desc">{s.desc}</p>
                        </div>
                        <div className="detail-grid-section">
                          <div className="detail-grid">
                            <div>
                              <h4>Key Benefits</h4>
                              <ul className="detail-item-list">
                                {s.benefits.map(b => <li key={b} className="detail-item">{b}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h4>Required Documents</h4>
                              <ul className="detail-item-list">
                                {s.docs.map(d => <li key={d} className="detail-item">{d}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="detail-footer">
                        <div className="detail-tag-rail">
                          {s.tags.map(t => <span key={t} className="detail-tag">{t}</span>)}
                          <span className="detail-tag">Deadline: {s.deadline}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="btn btn-ghost" onClick={() => toggleExpand(s.id)}>Close</button>
                          <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Visit Official Portal →</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <h3 className="empty-title">No matching schemes discovered</h3>
            <p className="empty-text">Try adjusting your search terms or exploring other categories in the sidebar.</p>
            <button className="btn btn-primary" onClick={handleClear}>Reset Search & Filters</button>
          </div>
        )}
      </main>
    </div>
  );
}

