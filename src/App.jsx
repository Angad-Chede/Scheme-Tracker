import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import Toast from './components/Toast';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Checker from './pages/Checker';
import Results from './pages/result/Result';
import Schemes from './pages/Schemes';
import Dashboard from './pages/dashboard/Dashboard';
import Admin from './pages/Admin';
import { supabase } from './lib/supabase';
import {
  ensureUserProfile,
  getUserProfile,
  saveUserBookmarks,
  saveUserProfileData,
} from './lib/profileService';

const DEFAULT_PROFILE = {
  fullName: '',
  age: '',
  gender: '',
  state: '',
  district: '',
  income: '',
  occupation: '',
  education: '',
  isStudent: false,
  isFarmer: false,
  isDisabled: false,
  isBusiness: false,
  familySize: '',
  maritalStatus: 'single',
  category: '',
  documents: [],
  prefCats: [],
};

function mapSupabaseUserToAppUser(sbUser) {
  if (!sbUser) return null;

  return {
    id: sbUser.id,
    name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email,
    role: sbUser.user_metadata?.role || 'user',
    profile: null,
    bookmarks: [],
  };
}

const ProtectedRoute = ({ children, user, authLoading, redirectTo = '/login' }) => {
  if (authLoading) return null; // Let the global loading screen handle this visually
  if (!user) return <Navigate to={redirectTo} replace />;
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [checkerStep, setCheckerStep] = useState(0);
  const [checkerProfile, setCheckerProfile] = useState({ ...DEFAULT_PROFILE });
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeCat, setSchemeCat] = useState('');
  const [schemeBtype, setSchemeBtype] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [authLoading, setAuthLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  async function hydrateProfileData(baseUser) {
    try {
      await ensureUserProfile(baseUser);
      const dbProfile = await getUserProfile(baseUser.id);

      const restoredProfile =
        dbProfile?.profile_data && Object.keys(dbProfile.profile_data).length > 0
          ? dbProfile.profile_data
          : null;

      const restoredBookmarks = Array.isArray(dbProfile?.bookmarks)
        ? dbProfile.bookmarks
        : [];

      setUser((prev) => ({
        ...(prev || baseUser),
        ...baseUser,
        name: dbProfile?.name || baseUser.name,
        email: dbProfile?.email || baseUser.email,
        role: dbProfile?.role || baseUser.role,
        profile: restoredProfile,
        bookmarks: restoredBookmarks,
      }));

      if (restoredProfile) {
        setCheckerProfile(restoredProfile);
      }
    } catch (err) {
      console.error('Profile hydration error:', err);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('Session restore error:', error);

        const sbUser = data?.session?.user || null;
        if (!isMounted) return;

        if (sbUser) {
          const baseUser = mapSupabaseUserToAppUser(sbUser);
          setUser(baseUser);
          setAuthLoading(false);
          hydrateProfileData(baseUser);
        } else {
          setUser(null);
          setAuthLoading(false);
        }
      } catch (err) {
        console.error('Unexpected initSession error:', err);
        if (isMounted) setAuthLoading(false);
      }
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sbUser = session?.user || null;
      if (!sbUser) {
        setUser(null);
        setCheckerProfile({ ...DEFAULT_PROFILE });
        setAuthLoading(false);
        return;
      }
      const baseUser = mapSupabaseUserToAppUser(sbUser);
      setUser(baseUser);
      setAuthLoading(false);
      hydrateProfileData(baseUser);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Page Transition Loading
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500); // 1.5 second cinematic loading
    return () => clearTimeout(timer);
  }, [location.pathname]);

  function showToast(msg, type = 'info') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleLogin(u) {
    setUser((prev) => ({
      ...(prev || {}),
      ...u,
      profile: prev?.profile || u.profile || null,
      bookmarks: prev?.bookmarks || u.bookmarks || [],
    }));

    try {
      if (u?.id) {
        await ensureUserProfile(u);
        const dbProfile = await getUserProfile(u.id);

        setUser((prev) => ({
          ...(prev || {}),
          ...u,
          name: dbProfile?.name || u.name,
          email: dbProfile?.email || u.email,
          role: dbProfile?.role || u.role || 'user',
          profile:
            dbProfile?.profile_data && Object.keys(dbProfile.profile_data).length > 0
              ? dbProfile.profile_data
              : prev?.profile || u.profile || null,
          bookmarks: Array.isArray(dbProfile?.bookmarks)
            ? dbProfile.bookmarks
            : prev?.bookmarks || u.bookmarks || [],
        }));

        if (dbProfile?.profile_data && Object.keys(dbProfile.profile_data).length > 0) {
          setCheckerProfile(dbProfile.profile_data);
        }
      }
    } catch (err) {
      console.error('handleLogin profile sync error:', err);
    }
  }

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast('Failed to sign out. Please try again.', 'error');
        return;
      }
      setUser(null);
      setCheckerProfile({ ...DEFAULT_PROFILE });
      setCheckerStep(0);
      navigate('/');
      showToast('Signed out successfully', 'success');
    } catch (err) {
      showToast('Something went wrong while signing out', 'error');
    }
  }

  async function toggleBookmark(id) {
    if (!user) return;
    const bm = user.bookmarks || [];
    const newBm = bm.includes(id) ? bm.filter((x) => x !== id) : [...bm, id];
    setUser({ ...user, bookmarks: newBm });
    try {
      await saveUserBookmarks(user.id, newBm);
      showToast(bm.includes(id) ? 'Removed from saved' : 'Scheme saved! ✓', 'success');
    } catch (err) {
      setUser({ ...user, bookmarks: bm });
      showToast('Could not update saved schemes', 'error');
    }
  }

  async function removeBookmark(id) {
    if (!user) return;
    const oldBm = user.bookmarks || [];
    const newBm = oldBm.filter((x) => x !== id);
    setUser({ ...user, bookmarks: newBm });
    try {
      await saveUserBookmarks(user.id, newBm);
      showToast('Removed from saved', 'success');
    } catch (err) {
      setUser({ ...user, bookmarks: oldBm });
      showToast('Could not remove saved scheme', 'error');
    }
  }

  async function handleCheckerSubmit() {
    const profile = {
      ...checkerProfile,
      age: parseInt(checkerProfile.age) || 0,
      income: parseInt(checkerProfile.income) || 0,
      familySize: parseInt(checkerProfile.familySize) || 0,
    };
    
    setCheckerProfile(profile);

    if (!user) {
      showToast('Please sign in to view your eligibility results', 'info');
      navigate('/login', { state: { from: '/result' } });
      return;
    }

    setUser((prev) => ({ ...(prev || {}), profile }));

    if (user?.id) {
      try {
        await saveUserProfileData(user.id, profile);
      } catch (err) {
        showToast('Profile saved locally, but failed to sync to cloud', 'error');
      }
    }

    setCheckerStep(0);
    showToast('Profile saved! Showing your eligibility results.', 'success');
    navigate('/result');
  }

  return (
    <>
      <ScrollToTop />
      <LoadingScreen isVisible={isPageLoading || authLoading} />
      <Navbar user={user} onSignOut={handleSignOut} />
      <div className={`page ${isPageLoading || authLoading ? 'page-hidden' : ''}`} key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home setFilter={setSchemeCat} />} />
          <Route path="/login" element={<Auth mode="login" onLogin={handleLogin} showToast={showToast} />} />
          <Route path="/signup" element={<Auth mode="signup" onLogin={handleLogin} showToast={showToast} />} />
          
          <Route 
            path="/checker" 
            element={
              <Checker
                step={checkerStep}
                profile={checkerProfile}
                onUpdate={setCheckerProfile}
                onNext={() => setCheckerStep((s) => s + 1)}
                onBack={() => setCheckerStep((s) => s - 1)}
                onSubmit={handleCheckerSubmit}
              />
            } 
          />
          
          <Route 
            path="/schemes" 
            element={
              <Schemes
                search={schemeSearch}
                setSearch={setSchemeSearch}
                cat={schemeCat}
                setCat={setSchemeCat}
                btype={schemeBtype}
                setBtype={setSchemeBtype}
                user={user}
                onToggleBookmark={toggleBookmark}
                showToast={showToast}
              />
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/result" 
            element={
              <ProtectedRoute user={user} authLoading={authLoading}>
                <Results
                  user={user}
                  resultFilter={resultFilter}
                  setResultFilter={setResultFilter}
                  onToggleBookmark={toggleBookmark}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user} authLoading={authLoading}>
                <Dashboard user={user} onRemoveBookmark={removeBookmark} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} authLoading={authLoading} redirectTo="/">
                {user?.role === 'admin' ? <Admin user={user} showToast={showToast} /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toast toast={toast} />
    </>
  );
}