import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/checker.css';
import { CATS, STATES, DOCS } from '../data';

const STEPS = ['Basic Info', 'Income & Status', 'Documents', 'Preferences'];

export default function Checker({ step, profile, onUpdate, onNext, onBack, onSubmit }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  function updateP(key, val) {
    onUpdate({ ...profile, [key]: val });
    if (errors[key]) setErrors({ ...errors, [key]: null });
  }

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

  function validateStep() {
    const newErrors = {};
    if (step === 0) {
      if (!profile.fullName?.trim()) newErrors.fullName = 'Full name is required';
      if (!profile.age) newErrors.age = 'Age is required';
      else if (profile.age < 0 || profile.age > 120) newErrors.age = 'Enter a valid age';
      if (!profile.gender) newErrors.gender = 'Gender is required';
      if (!profile.state) newErrors.state = 'State is required';
      if (!profile.district?.trim()) newErrors.district = 'District is required';
      if (!profile.occupation) newErrors.occupation = 'Occupation is required';
      if (!profile.education) newErrors.education = 'Education level is required';
    } else if (step === 1) {
      if (profile.income === undefined || profile.income === '') newErrors.income = 'Annual income is required';
      if (!profile.familySize) newErrors.familySize = 'Family size is required';
      if (!profile.category) newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep()) {
      onNext();
      window.scrollTo(0, 0);
    }
  }

  const stepRow = (
    <div className="step-row">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <div className="step-label">{s}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div className="step-line-container">
              <div className="step-line-fill" style={{ width: i < step ? '100%' : '0%' }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  let stepContent;
  if (step === 0) {
    stepContent = (
      <div className="page-fade-in">
        <h3 className="step-section-title">Basic Information</h3>
        <p className="step-section-subtitle">Please provide your personal details for accurate matching.</p>
        <div className="g2">
          <div className={`field-group ${errors.fullName ? 'has-error' : ''}`}>
            <label className="lbl">Full Name</label>
            <input className={`inp ${errors.fullName ? 'inp-error' : ''}`} type="text" placeholder="Your full name" value={profile.fullName || ''} onChange={e => updateP('fullName', e.target.value)} />
            {errors.fullName && <div className="error-msg">⚠ {errors.fullName}</div>}
          </div>
          <div className={`field-group ${errors.age ? 'has-error' : ''}`}>
            <label className="lbl">Age</label>
            <input className={`inp ${errors.age ? 'inp-error' : ''}`} type="number" placeholder="e.g. 25" value={profile.age || ''} onChange={e => updateP('age', e.target.value)} />
            {errors.age && <div className="error-msg">⚠ {errors.age}</div>}
          </div>
          <div className={`field-group ${errors.gender ? 'has-error' : ''}`}>
            <label className="lbl">Gender</label>
            <select className={`inp ${errors.gender ? 'inp-error' : ''}`} value={profile.gender || ''} onChange={e => updateP('gender', e.target.value)}>
              <option value="">Select gender</option>
              {['male', 'female', 'other'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
            {errors.gender && <div className="error-msg">⚠ {errors.gender}</div>}
          </div>
          <div className={`field-group`}>
            <label className="lbl">Marital Status</label>
            <select className="inp" value={profile.maritalStatus || 'single'} onChange={e => updateP('maritalStatus', e.target.value)}>
              {['single', 'married', 'widowed', 'divorced'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
          <div className={`field-group ${errors.state ? 'has-error' : ''}`}>
            <label className="lbl">State</label>
            <select className={`inp ${errors.state ? 'inp-error' : ''}`} value={profile.state || ''} onChange={e => updateP('state', e.target.value)}>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <div className="error-msg">⚠ {errors.state}</div>}
          </div>
          <div className={`field-group ${errors.district ? 'has-error' : ''}`}>
            <label className="lbl">District</label>
            <input className={`inp ${errors.district ? 'inp-error' : ''}`} type="text" placeholder="Your district" value={profile.district || ''} onChange={e => updateP('district', e.target.value)} />
            {errors.district && <div className="error-msg">⚠ {errors.district}</div>}
          </div>
          <div className={`field-group ${errors.occupation ? 'has-error' : ''}`}>
            <label className="lbl">Occupation</label>
            <select className={`inp ${errors.occupation ? 'inp-error' : ''}`} value={profile.occupation || ''} onChange={e => updateP('occupation', e.target.value)}>
              <option value="">Select occupation</option>
              {['Student', 'Farmer', 'Private Employee', 'Government Employee', 'Self-employed', 'Business Owner', 'Daily Wage Worker', 'Homemaker', 'Retired', 'Unemployed'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.occupation && <div className="error-msg">⚠ {errors.occupation}</div>}
          </div>
          <div className={`field-group ${errors.education ? 'has-error' : ''}`}>
            <label className="lbl">Education Level</label>
            <select className={`inp ${errors.education ? 'inp-error' : ''}`} value={profile.education || ''} onChange={e => updateP('education', e.target.value)}>
              <option value="">Select education</option>
              {['Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Doctorate'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.education && <div className="error-msg">⚠ {errors.education}</div>}
          </div>
        </div>
      </div>
    );
  } else if (step === 1) {
    const statusCards = [
      { key: 'isStudent', label: 'Currently a Student', desc: 'Enrolled in school, college or university' },
      { key: 'isFarmer', label: 'Farmer / Agriculture', desc: 'Engaged in primary agricultural activities' },
      { key: 'isDisabled', label: 'Person with Disability', desc: 'Holding a valid disability certificate' },
      { key: 'isBusiness', label: 'Business / MSME Owner', desc: 'Running a registered or small business' },
    ];
    stepContent = (
      <div className="page-fade-in">
        <h3 className="step-section-title">Income & Status Details</h3>
        <p className="step-section-subtitle">Financial and social status helps us find targeted benefits.</p>
        <div className="g2" style={{ marginBottom: '24px' }}>
          <div className={`field-group ${errors.income ? 'has-error' : ''}`}>
            <label className="lbl">Annual Family Income (₹)</label>
            <input className={`inp ${errors.income ? 'inp-error' : ''}`} type="number" placeholder="e.g. 150000" value={profile.income || ''} onChange={e => updateP('income', e.target.value)} />
            {errors.income && <div className="error-msg">⚠ {errors.income}</div>}
          </div>
          <div className={`field-group ${errors.familySize ? 'has-error' : ''}`}>
            <label className="lbl">Family Size</label>
            <input className={`inp ${errors.familySize ? 'inp-error' : ''}`} type="number" placeholder="e.g. 4" value={profile.familySize || ''} onChange={e => updateP('familySize', e.target.value)} />
            {errors.familySize && <div className="error-msg">⚠ {errors.familySize}</div>}
          </div>
          <div className={`field-group ${errors.category ? 'has-error' : ''}`}>
            <label className="lbl">Category / Caste</label>
            <select className={`inp ${errors.category ? 'inp-error' : ''}`} value={profile.category || ''} onChange={e => updateP('category', e.target.value)}>
              <option value="">Select category</option>
              {['General', 'OBC', 'SC', 'ST', 'EWS'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.category && <div className="error-msg">⚠ {errors.category}</div>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {statusCards.map(sc => (
            <div key={sc.key} className={`status-card ${profile[sc.key] ? 'active' : ''}`} onClick={() => toggleStatus(sc.key)}>
              <div className="status-card-label">{sc.label}</div>
              <div className="status-card-desc">{sc.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (step === 2) {
    stepContent = (
      <div className="page-fade-in">
        <h3 className="step-section-title">Available Documents</h3>
        <p className="step-section-subtitle">Select documents you currently possess to find immediately applicable schemes.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {DOCS.map(doc => {
            const on = (profile.documents || []).includes(doc);
            return (
              <div key={doc} className={`doc-card ${on ? 'active' : ''}`} onClick={() => toggleDoc(doc)}>
                <div className="doc-checkbox">{on ? '✓' : ''}</div>
                <span className="doc-label">{doc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    stepContent = (
      <div className="page-fade-in">
        <h3 className="step-section-title">Preferred Categories</h3>
        <p className="step-section-subtitle">Optional: Choose categories you are most interested in for better ranking.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
          {CATS.map(cat => (
            <button key={cat} className={`chip ${(profile.prefCats || []).includes(cat) ? 'on' : ''}`} onClick={() => toggleCat(cat)}>{cat}</button>
          ))}
        </div>
        <div className="profile-summary">
          <div className="profile-summary-heading">✨ Profile Ready for Matching</div>
          <div className="profile-summary-text">
            <strong>{profile.fullName || 'User'}</strong>, {profile.age || 'N/A'} years old from {profile.state || 'N/A'}. 
            {profile.isFarmer && ' Verified Farmer status.'} {profile.isStudent && ' Currently a student.'}
            {' Annual income stated as ₹' + (parseInt(profile.income) || 0).toLocaleString() + '.'} 
            {' You have ' + (profile.documents || []).length + ' documents ready.'}
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
          <p className="checker-subtitle">Takes just 3 minutes to find your matching benefits</p>
        </div>
        {stepRow}
        <div className="card" style={{ padding: '32px' }}>
          {stepContent}
          <hr style={{ margin: '32px 0 0px' }} />
          <div className="checker-nav">
            <button className="btn btn-ghost" onClick={step > 0 ? onBack : () => navigate('/')}>
              {step === 0 ? '← Exit to Home' : '← Previous Step'}
            </button>
            {step < STEPS.length - 1
              ? <button className="btn btn-primary btn-nav-next" onClick={handleNext}>Continue to Next →</button>
              : <button className="btn btn-primary btn-nav-next" onClick={onSubmit}>Discover Schemes</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

