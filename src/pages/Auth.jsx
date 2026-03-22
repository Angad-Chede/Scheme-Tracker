import { useState } from 'react';
import '../styles/auth.css';
import { DEMO_USERS } from '../data';

export default function Auth({ mode, navigate, onLogin, showToast }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function handleSubmit() {
    if (mode === 'login') {
      const u = DEMO_USERS.find(u => u.email === form.email && u.password === form.password);
      if (u) {
        onLogin({ ...u });
        showToast('Welcome back, ' + u.name + '!', 'success');
        navigate('dashboard');
      } else {
        showToast('Invalid credentials. Try user@demo.com / demo123', 'error');
      }
    } else {
      if (!form.name || !form.email || !form.password) { showToast('Please fill all fields', 'error'); return; }
      onLogin({ id: '' + Date.now(), name: form.name, email: form.email, role: 'user', profile: null, bookmarks: [] });
      showToast('Account created! Welcome to SchemeTracker', 'success');
      navigate('checker');
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2 className="auth-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Sign in to your account' : 'Join thousands discovering their benefits'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="auth-field">
            <label className="lbl">Full Name</label>
            <input className="inp" type="text" placeholder="Ramesh Kumar"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}

        <div className="auth-field">
          <label className="lbl">Email Address</label>
          <input className="inp" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="auth-field-last">
          <label className="lbl">Password</label>
          <input className="inp" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>

        {mode === 'login' && (
          <div className="auth-demo-hint">
            Demo — User: <strong>user@demo.com</strong> / <strong>demo123</strong><br />
            Admin: <strong>admin@demo.com</strong> / <strong>admin123</strong>
          </div>
        )}

        <button className="btn btn-primary auth-submit" onClick={handleSubmit}>
          {mode === 'login' ? '🔑 Sign In' : '🚀 Create Account'}
        </button>

        <div className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-switch-link" onClick={() => navigate(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
