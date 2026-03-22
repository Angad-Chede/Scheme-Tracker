import { useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Checker from './pages/Checker';
import Results from './pages/Results';
import Schemes from './pages/Schemes';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const DEFAULT_PROFILE = {
  fullName: '', age: '', gender: '', state: '', district: '', income: '',
  occupation: '', education: '', isStudent: false, isFarmer: false,
  isDisabled: false, isBusiness: false, familySize: '', maritalStatus: 'single',
  category: '', documents: [], prefCats: [],
};

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [checkerStep, setCheckerStep] = useState(0);
  const [checkerProfile, setCheckerProfile] = useState({ ...DEFAULT_PROFILE });
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeCat, setSchemeCat] = useState('');
  const [schemeBtype, setSchemeBtype] = useState('');
  const [resultFilter, setResultFilter] = useState('all');

  function navigate(pg) {
    if ((pg === 'dashboard' || pg === 'results') && !user) { setPage('login'); window.scrollTo(0, 0); return; }
    if (pg === 'admin' && user?.role !== 'admin') { showToast('Admin access required', 'error'); return; }
    setPage(pg);
    window.scrollTo(0, 0);
  }

  function showToast(msg, type = 'info') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleLogin(u) { setUser(u); }

  function handleSignOut() { setUser(null); setPage('home'); window.scrollTo(0, 0); }

  function toggleBookmark(id) {
    if (!user) return;
    const bm = user.bookmarks || [];
    const newBm = bm.includes(id) ? bm.filter(x => x !== id) : [...bm, id];
    setUser({ ...user, bookmarks: newBm });
    showToast(bm.includes(id) ? 'Removed from saved' : 'Scheme saved! ✓', 'success');
  }

  function removeBookmark(id) {
    if (!user) return;
    setUser({ ...user, bookmarks: (user.bookmarks || []).filter(x => x !== id) });
    showToast('Removed from saved', 'success');
  }

  function handleCheckerSubmit() {
    const profile = {
      ...checkerProfile,
      age: parseInt(checkerProfile.age) || 0,
      income: parseInt(checkerProfile.income) || 0,
    };
    setUser(prev => ({ ...prev, profile }));
    setCheckerStep(0);
    showToast('Profile saved! Showing your eligibility results.', 'success');
    setPage('results');
    window.scrollTo(0, 0);
  }

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home navigate={navigate} setFilter={setSchemeCat} />;
      case 'login':
        return <Auth mode="login" navigate={navigate} onLogin={handleLogin} showToast={showToast} />;
      case 'signup':
        return <Auth mode="signup" navigate={navigate} onLogin={handleLogin} showToast={showToast} />;
      case 'checker':
        return (
          <Checker
            step={checkerStep}
            profile={checkerProfile}
            onUpdate={setCheckerProfile}
            onNext={() => setCheckerStep(s => s + 1)}
            onBack={() => setCheckerStep(s => s - 1)}
            onSubmit={handleCheckerSubmit}
            navigate={navigate}
          />
        );
      case 'results':
        return (
          <Results
            user={user}
            navigate={navigate}
            resultFilter={resultFilter}
            setResultFilter={setResultFilter}
            onToggleBookmark={toggleBookmark}
          />
        );
      case 'schemes':
        return (
          <Schemes
            search={schemeSearch} setSearch={setSchemeSearch}
            cat={schemeCat} setCat={setSchemeCat}
            btype={schemeBtype} setBtype={setSchemeBtype}
            user={user} navigate={navigate}
            onToggleBookmark={toggleBookmark} showToast={showToast}
          />
        );
      case 'dashboard':
        return <Dashboard user={user} navigate={navigate} onRemoveBookmark={removeBookmark} />;
      case 'admin':
        return <Admin user={user} navigate={navigate} showToast={showToast} />;
      default:
        return <Home navigate={navigate} setFilter={setSchemeCat} />;
    }
  };

  return (
    <>
      <Navbar page={page} user={user} navigate={navigate} onSignOut={handleSignOut} />
      <div className="page" key={page}>
        {renderPage()}
      </div>
      <Toast toast={toast} />
    </>
  );
}
