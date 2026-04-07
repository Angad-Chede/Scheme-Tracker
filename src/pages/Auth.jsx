import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/auth.css';
import { supabase } from '../lib/supabase';

export default function Auth({ mode, onLogin, showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      showToast('Please fill all fields', 'error');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) {
          showToast(error.message || 'Invalid credentials', 'error');
          return;
        }

        const sbUser = data.user;

        const appUser = {
          id: sbUser.id,
          name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'User',
          email: sbUser.email,
          role: sbUser.user_metadata?.role || 'user',
          profile: null,
          bookmarks: [],
        };

        onLogin(appUser);
        showToast('Welcome back, ' + appUser.name + '!', 'success');
        navigate(from, { replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: form.name,
              role: 'user',
            },
          },
        });

        if (error) {
          showToast(error.message || 'Signup failed', 'error');
          return;
        }

        const sbUser = data.user;

        const appUser = {
          id: sbUser?.id || '' + Date.now(),
          name: form.name,
          email: form.email,
          role: 'user',
          profile: null,
          bookmarks: [],
        };

        onLogin(appUser);

        if (data.session) {
          showToast('Account created! Welcome to SchemeTracker', 'success');
          navigate(from === '/result' ? '/result' : '/checker', { replace: true });
        } else {
          showToast('Signup successful! Please verify your email before logging in.', 'success');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h2 className="auth-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>

          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to your account'
              : 'Join thousands discovering their benefits'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="auth-field">
            <label className="lbl">Full Name</label>
            <input
              className="inp"
              type="text"
              placeholder="Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        )}

        <div className="auth-field">
          <label className="lbl">Email Address</label>
          <input
            className="inp"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="auth-field-last">
          <label className="lbl">Password</label>
          <input
            className="inp"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          className="btn btn-primary auth-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? mode === 'login'
              ? 'Signing In...'
              : 'Creating Account...'
            : mode === 'login'
            ? 'Sign In'
            : 'Create Account'}
        </button>

        <div className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span
            className="auth-switch-link"
            onClick={() => navigate(mode === 'login' ? '/signup' : '/login', { state: { from } })}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}