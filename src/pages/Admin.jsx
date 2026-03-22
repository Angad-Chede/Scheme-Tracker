import { useState } from 'react';
import '../styles/admin.css';
import { SCHEMES, CATS } from '../data';

export default function Admin({ user, navigate, showToast }) {
  const [tab, setTab] = useState('overview');
  const [adminSchemes, setAdminSchemes] = useState([...SCHEMES]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="empty" style={{ padding: '80px' }}>
        <div className="empty-icon">🔒</div>
        <h3>Admin access required</h3>
      </div>
    );
  }

  const catDist = CATS.map(c => ({ c, n: SCHEMES.filter(s => s.cat === c).length })).sort((a, b) => b.n - a.n);
  const maxCatN = Math.max(...catDist.map(x => x.n));

  let content;

  if (tab === 'overview') {
    content = (
      <div>
        <h1 className="admin-overview-title">Admin Overview</h1>
        <p className="admin-overview-subtitle">Platform statistics and management</p>

        <div className="g4 admin-overview-stats">
          <div className="stat" style={{ borderTop: '3px solid var(--blue)' }}>
            <div className="stat-n" style={{ color: 'var(--blue)' }}>{adminSchemes.length}</div>
            <div className="stat-l">Total Schemes</div>
          </div>
          <div className="stat" style={{ borderTop: '3px solid var(--green)' }}>
            <div className="stat-n" style={{ color: 'var(--green)' }}>{adminSchemes.filter(s => s.active).length}</div>
            <div className="stat-l">Active Schemes</div>
          </div>
          <div className="stat" style={{ borderTop: '3px solid var(--amber)' }}>
            <div className="stat-n" style={{ color: 'var(--amber)' }}>{CATS.length}</div>
            <div className="stat-l">Categories</div>
          </div>
          <div className="stat">
            <div className="stat-n">1,247</div>
            <div className="stat-l">Mock Users</div>
          </div>
        </div>

        <div className="g2">
          {/* Popularity chart */}
          <div className="card">
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Top Schemes by Popularity</h3>
            {[...adminSchemes].sort((a, b) => b.pop - a.pop).slice(0, 6).map(s => (
              <div key={s.id} className="popularity-item">
                <div className="popularity-item-info">
                  <div className="popularity-item-name">{s.title}</div>
                  <div className="pbar">
                    <div className="pfill" style={{ width: `${s.pop}%`, background: 'var(--blue)' }} />
                  </div>
                </div>
                <div className="popularity-item-pct">{s.pop}%</div>
              </div>
            ))}
          </div>

          {/* Category distribution */}
          <div className="card">
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Category Distribution</h3>
            {catDist.map(({ c, n }) => (
              <div key={c} className="cat-dist-row">
                <span className="cat-dist-name">{c}</span>
                <div className="cat-dist-right">
                  <div className="cat-dist-bar-track">
                    <div className="cat-dist-bar-fill" style={{ width: `${Math.round(n / maxCatN * 100)}%` }} />
                  </div>
                  <span className="badge b-gray">{n}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  } else if (tab === 'schemes') {
    content = (
      <div>
        <div className="admin-manage-header">
          <h1 className="admin-manage-title">Manage Schemes</h1>
          <button className="btn btn-primary" onClick={() => showToast('Add scheme form (demo mode)', 'success')}>＋ Add New Scheme</button>
        </div>
        <div className="card admin-table-card">
          <table>
            <thead>
              <tr>
                {['Title', 'Category', 'Benefit Type', 'Popularity', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {adminSchemes.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, maxWidth: '200px' }}>{s.title}</td>
                  <td><span className="badge b-blue">{s.cat}</span></td>
                  <td><span className="badge b-gray">{s.btype}</span></td>
                  <td>{s.pop}%</td>
                  <td><span className={`badge ${s.active ? 'b-green' : 'b-red'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="table-action-cell">
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast('Edit: ' + s.title + ' (demo)', 'success')}>✏️</button>
                      <button className="btn btn-sm btn-delete" onClick={() => {
                        setAdminSchemes(prev => prev.filter(x => x.id !== s.id));
                        showToast('Scheme deleted', 'error');
                      }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  } else if (tab === 'analytics') {
    content = (
      <div>
        <h1 className="admin-analytics-title">Analytics</h1>
        <div className="card analytics-stats-card">
          <h3 className="analytics-stats-title">Platform Statistics (Mock Data)</h3>
          <div className="g3">
            {[
              ['Total Users', '12,847', '+12% this month', 'var(--blue)'],
              ['Eligibility Checks', '48,230', '+23% this month', 'var(--green)'],
              ['Applications Started', '3,142', '+8% this month', 'var(--amber)'],
              ['Most Popular', 'Ayushman Bharat', '9,201 checks', 'var(--red)'],
              ['Avg. Eligible/User', '4.2', 'schemes per check', 'var(--gray)'],
              ['Top State', 'Uttar Pradesh', '18% of users', 'var(--blue)'],
            ].map(([label, val, sub, color]) => (
              <div key={label} className="stat">
                <div className="analytics-stat-label">{label}</div>
                <div className="stat-n analytics-stat-value" style={{ color }}>{val}</div>
                <div className="analytics-stat-sub">{sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card analytics-placeholder">
          <div className="analytics-placeholder-icon">📊</div>
          <h3 style={{ marginBottom: '8px' }}>Advanced Analytics Charts</h3>
          <p className="analytics-placeholder-text">
            In production, this section shows live charts for user growth, scheme popularity trends,
            state-wise distribution, and application conversion rates.
          </p>
        </div>
      </div>
    );

  } else {
    content = (
      <div>
        <h1 className="admin-settings-title">Settings</h1>
        <div className="card">
          <h3 className="settings-card-title">Platform Configuration</h3>
          {['Enable new user registration', 'Show scheme deadlines prominently', 'Enable AI eligibility assistant', 'Email notifications for new schemes', 'Allow document uploads'].map((setting, i) => {
            const on = i % 2 === 0;
            return (
              <div key={setting} className="settings-row">
                <span className="settings-row-label">{setting}</span>
                <div
                  className="toggle"
                  style={{ background: on ? 'var(--green)' : 'var(--text3)' }}
                  onClick={() => showToast('Setting updated (demo)', 'success')}
                >
                  <div className="toggle-knob" style={{ right: on ? '2px' : '22px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">⚙️ Admin Panel</div>
          <div className="admin-sidebar-subtitle">SchemeTracker Management</div>
        </div>
        {[['overview', '📊 Overview'], ['schemes', '📋 Manage Schemes'], ['analytics', '📈 Analytics'], ['settings', '⚙️ Settings']].map(([id, label]) => (
          <div key={id} className={`si${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{label}</div>
        ))}
      </div>

      {/* Main content */}
      <div className="admin-main">
        {content}
      </div>
    </div>
  );
}
