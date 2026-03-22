import '../styles/schemes.css';
import { SCHEMES, CATS } from '../data';

export default function Schemes({ search, setSearch, cat, setCat, btype, setBtype, user, navigate, onToggleBookmark, showToast }) {
  const btypes = [...new Set(SCHEMES.map(s => s.btype))];

  const filtered = SCHEMES.filter(s => {
    const q = search.toLowerCase();
    if (search && !s.title.toLowerCase().includes(q) && !s.short.toLowerCase().includes(q) && !s.tags.some(t => t.includes(q))) return false;
    if (cat && s.cat !== cat) return false;
    if (btype && s.btype !== btype) return false;
    return true;
  }).sort((a, b) => b.pop - a.pop);

  function handleBookmark(id) {
    if (!user) { showToast('Sign in to bookmark schemes', 'error'); return; }
    onToggleBookmark(id);
  }

  return (
    <div className="schemes-wrapper">
      <h1 className="schemes-title">Explore Government Schemes</h1>
      <p className="schemes-subtitle">Browse all {SCHEMES.length} schemes and find what's right for you</p>

      <div className="card schemes-filters">
        <div className="schemes-filter-row">
          <input className="inp schemes-search" placeholder="Search schemes, keywords..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="inp schemes-select" value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">All Categories</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="inp schemes-select" value={btype} onChange={e => setBtype(e.target.value)}>
            <option value="">All Benefit Types</option>
            {btypes.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="schemes-chips">
          <button className={`chip${!cat ? ' on' : ''}`} onClick={() => setCat('')}>All</button>
          {CATS.map(c => (
            <button key={c} className={`chip${cat === c ? ' on' : ''}`} onClick={() => setCat(cat === c ? '' : c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="schemes-count">Showing {filtered.length} of {SCHEMES.length} schemes</div>

      {filtered.length > 0 ? (
        <div className="schemes-grid">
          {filtered.map(s => {
            const isBm = (user?.bookmarks || []).includes(s.id);
            return (
              <div key={s.id} className="scheme-card">
                <div className="scheme-card-header">
                  <div>
                    <span className="badge b-blue" style={{ marginBottom: '6px', display: 'inline-block' }}>{s.cat}</span>
                    <div className="scheme-card-title">{s.title}</div>
                    <div className="scheme-card-ministry">{s.ministry}</div>
                  </div>
                  <button className="scheme-bookmark-btn" style={{ color: isBm ? 'var(--blue)' : 'var(--text3)' }} onClick={() => handleBookmark(s.id)}>🔖</button>
                </div>
                <p className="scheme-card-short">{s.short}</p>
                <div className="scheme-card-benefits">
                  {s.benefits.slice(0, 2).map(b => (
                    <div key={b} className="scheme-benefit-item">✓ {b}</div>
                  ))}
                </div>
                <div className="scheme-card-footer">
                  <div className="scheme-card-meta">
                    <span className="badge b-gray">{s.btype}</span>
                    {s.deadline !== 'Ongoing' && <span className="badge b-amber">⏰ {s.deadline}</span>}
                  </div>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Apply →</a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3 style={{ marginBottom: '8px' }}>No schemes found</h3>
          <p>Try adjusting your search or filters</p>
          <button className="btn btn-ghost" style={{ marginTop: '12px' }} onClick={() => { setSearch(''); setCat(''); setBtype(''); }}>Clear Filters</button>
        </div>
      )}
    </div>
  );
}
