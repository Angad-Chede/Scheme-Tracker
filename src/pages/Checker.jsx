import '../styles/checker.css';
import { CATS, STATES, DOCS } from '../data';

const STEPS = ['Basic Info', 'Income & Status', 'Documents', 'Preferences'];

export default function Checker({ step, profile, onUpdate, onNext, onBack, onSubmit, navigate }) {
  function updateP(key, val) { onUpdate({ ...profile, [key]: val }); }
  function toggleDoc(doc) {
    const d = [...(profile.documents || [])];
    const i = d.indexOf(doc);
    if (i >= 0) d.splice(i, 1); else d.push(doc);
    updateP('documents', d);
  }
  function toggleCat(cat) {
    const c = [...(profile.prefCats || [])];
    const i = c.indexOf(cat);
    if (i >= 0) c.splice(i, 1); else c.push(cat);
    updateP('prefCats', c);
  }
  function toggleStatus(key) { updateP(key, !profile[key]); }

  const stepRow = (
    <div className="step-row">
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="step-item">
            <div className="step-dot" style={{
              background: i < step ? 'var(--green)' : i === step ? 'var(--blue)' : 'var(--gray-pale)',
              color: i < step || i === step ? '#fff' : 'var(--text3)'
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <div className="step-label" style={{ color: i === step ? 'var(--blue)' : 'var(--text3)' }}>{s}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div className="step-line" style={{ background: i < step ? 'var(--green)' : 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  );

  let stepContent;
  if (step === 0) {
    stepContent = (
      <div>
        <h3 className="step-section-title">Basic Information</h3>
        <div className="g2">
          <div><label className="lbl">Full Name</label><input className="inp" type="text" placeholder="Your full name" value={profile.fullName || ''} onChange={e => updateP('fullName', e.target.value)} /></div>
          <div><label className="lbl">Age</label><input className="inp" type="number" placeholder="e.g. 25" value={profile.age || ''} onChange={e => updateP('age', e.target.value)} /></div>
          <div>
            <label className="lbl">Gender</label>
            <select className="inp" value={profile.gender || ''} onChange={e => updateP('gender', e.target.value)}>
              <option value="">Select gender</option>
              {['male', 'female', 'other'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Marital Status</label>
            <select className="inp" value={profile.maritalStatus || 'single'} onChange={e => updateP('maritalStatus', e.target.value)}>
              {['single', 'married', 'widowed', 'divorced'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">State</label>
            <select className="inp" value={profile.state || ''} onChange={e => updateP('state', e.target.value)}>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="lbl">District</label><input className="inp" type="text" placeholder="Your district" value={profile.district || ''} onChange={e => updateP('district', e.target.value)} /></div>
          <div>
            <label className="lbl">Occupation</label>
            <select className="inp" value={profile.occupation || ''} onChange={e => updateP('occupation', e.target.value)}>
              <option value="">Select occupation</option>
              {['Student', 'Farmer', 'Private Employee', 'Government Employee', 'Self-employed', 'Business Owner', 'Daily Wage Worker', 'Homemaker', 'Retired', 'Unemployed'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Education Level</label>
            <select className="inp" value={profile.education || ''} onChange={e => updateP('education', e.target.value)}>
              <option value="">Select education</option>
              {['Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Doctorate'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  } else if (step === 1) {
    const statusCards = [
      { key: 'isStudent', emoji: '🎓', label: 'Currently a Student', desc: 'Enrolled in school/college/university' },
      { key: 'isFarmer', emoji: '🌾', label: 'Farmer', desc: 'Engaged in agricultural activities' },
      { key: 'isDisabled', emoji: '♿', label: 'Person with Disability', desc: 'Holding disability certificate' },
      { key: 'isBusiness', emoji: '💼', label: 'Business / MSME Owner', desc: 'Running a registered or unregistered business' },
    ];
    stepContent = (
      <div>
        <h3 className="step-section-title">Income & Status Details</h3>
        <div className="g2" style={{ marginBottom: '20px' }}>
          <div><label className="lbl">Annual Family Income (₹)</label><input className="inp" type="number" placeholder="e.g. 150000" value={profile.income || ''} onChange={e => updateP('income', e.target.value)} /></div>
          <div><label className="lbl">Family Size</label><input className="inp" type="number" placeholder="e.g. 4" value={profile.familySize || ''} onChange={e => updateP('familySize', e.target.value)} /></div>
          <div>
            <label className="lbl">Category / Caste</label>
            <select className="inp" value={profile.category || ''} onChange={e => updateP('category', e.target.value)}>
              <option value="">Prefer not to specify</option>
              {['General', 'OBC', 'SC', 'ST', 'EWS'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {statusCards.map(sc => (
            <div key={sc.key} className={`status-card${profile[sc.key] ? ' active' : ''}`} onClick={() => toggleStatus(sc.key)}>
              <div className="status-card-emoji">{sc.emoji}</div>
              <div className="status-card-label">{sc.label}</div>
              <div className="status-card-desc">{sc.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (step === 2) {
    stepContent = (
      <div>
        <h3 className="step-section-title">Available Documents</h3>
        <p className="step-section-subtitle">Select documents you currently have — this helps show schemes you can apply to immediately</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {DOCS.map(doc => {
            const on = (profile.documents || []).includes(doc);
            return (
              <div key={doc} className={`doc-card${on ? ' active' : ''}`} onClick={() => toggleDoc(doc)}>
                <div className={`doc-checkbox${on ? ' checked' : ''}`}>{on ? '✓' : ''}</div>
                <span className="doc-label">{doc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    stepContent = (
      <div>
        <h3 className="step-section-title">Preferred Scheme Categories</h3>
        <p className="step-section-subtitle">Optional — helps personalise recommendations</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {CATS.map(cat => (
            <button key={cat} className={`chip${(profile.prefCats || []).includes(cat) ? ' on' : ''}`} onClick={() => toggleCat(cat)}>{cat}</button>
          ))}
        </div>
        <div className="profile-summary">
          <div className="profile-summary-heading">🤖 Profile Summary</div>
          <div className="profile-summary-text">
            {(profile.fullName || 'You')}, {profile.age || '?'} years old{profile.state ? ' from ' + profile.state : ''}.
            {profile.isFarmer ? ' Farmer.' : ''}{profile.isStudent ? ' Student.' : ''}{profile.isDisabled ? ' Person with disability.' : ''}{profile.isBusiness ? ' Business owner.' : ''}
            {' '}Income: ₹{(parseInt(profile.income || 0) || 0).toLocaleString()}/year.
            {' '}Documents: {(profile.documents || []).length} available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checker-wrapper">
      <div className="checker-inner">
        <div className="checker-header">
          <h1 className="checker-title">Eligibility Checker</h1>
          <p className="checker-subtitle">Fill your details to discover matching schemes — takes just 3 minutes</p>
        </div>
        {stepRow}
        <div className="card">
          {stepContent}
          <hr />
          <div className="checker-nav">
            <button className="btn btn-ghost" onClick={step > 0 ? onBack : () => navigate('home')}>
              ← {step === 0 ? 'Back to Home' : 'Previous'}
            </button>
            {step < STEPS.length - 1
              ? <button className="btn btn-primary" onClick={onNext}>Next: {STEPS[step + 1]} →</button>
              : <button className="btn btn-primary" onClick={onSubmit}>🚀 Check My Eligibility</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
