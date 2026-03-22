import '../styles/home.css';
import { CATS, CAT_EMOJI, CAT_COLORS } from '../data';

export default function Home({ navigate, setFilter }) {
  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="badge b-blue hero-badge">🇮🇳 Government Scheme Eligibility Platform</span>
            <h1 className="hero-title">Discover Every Scheme You Deserve</h1>
            <p className="hero-subtitle">
              Stop missing out on government benefits. Answer a few questions and instantly discover
              all central &amp; state schemes you qualify for — with required documents and application links.
            </p>
            <div className="hero-actions">
              <button className="btn btn-lg hero-btn-primary" onClick={() => navigate('checker')}>Check My Eligibility</button>
              <button className="btn btn-lg hero-btn-outline" onClick={() => navigate('schemes')}>Explore All Schemes</button>
            </div>
            <div className="hero-stats">
              {[['30+', 'Govt. Schemes'], ['₹10L+', 'Avg. Benefits/Year'], ['95%', 'Accuracy Rate']].map(([n, l]) => (
                <div key={l}>
                  <div className="hero-stat-number">{n}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="home-container">
        {/* Categories */}
        <h2 className="section-title">Schemes for Every Indian</h2>
        <p className="section-subtitle">From farmers to students, women to senior citizens</p>
        <div className="cat-grid">
          {CATS.map(cat => (
            <div
              key={cat}
              className="cat-card"
              style={{ background: CAT_COLORS[cat] || '#f1f5f9' }}
              onClick={() => { setFilter(cat); navigate('schemes'); }}
            >
              <div className="cat-icon">{CAT_EMOJI[cat] || '📌'}</div>
              <div className="cat-name">{cat}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Three simple steps to discover your benefits</p>
        <div className="g3 how-grid">
          {[
            [1, 'Fill Your Profile', 'Enter your age, income, state & status — takes 3 minutes'],
            [2, 'Run Eligibility Check', 'Our rule engine matches you against 30+ schemes instantly'],
            [3, 'View & Apply', 'See eligible schemes, missing docs, and official apply links'],
          ].map(([n, title, desc]) => (
            <div key={n} className="card how-card">
              <div className="how-number">{n}</div>
              <h3 className="how-title">{title}</h3>
              <p className="how-desc">{desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="section-title">What People Say</h2>
        <p className="section-subtitle">Real stories from SchemeTracker users</p>
        <div className="g3 testimonial-grid">
          {[
            ['Tanish Salunke', 'Farmer, Gujarat', 'I was unaware of PM-KISAN. SchemeTracker showed me I was eligible and helped me apply. I now receive ₹6,000/year directly in my account!'],
            ['Sunita Devi', 'Student, Bihar', 'Found 3 scholarships I qualify for. The document checklist was so helpful — I knew exactly what to arrange before applying.'],
            ['Mohammed Ali', 'Small Business Owner', 'Got the Mudra loan details instantly. The eligibility score showed me exactly what I was missing. Applied within a week!'],
          ].map(([name, role, text]) => (
            <div key={name} className="card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"{text}"</p>
              <div className="testimonial-name">{name}</div>
              <div className="testimonial-role">{role}</div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="cta-banner">
          <h2 className="cta-title">Start Checking Your Eligibility Now</h2>
          <p className="cta-subtitle">It's free, private, and takes less than 3 minutes</p>
          <button className="btn btn-lg cta-btn" onClick={() => navigate('checker')}>Get Started Free →</button>
        </div>

        {/* Footer */}
        <div className="home-footer">
          <div className="home-footer-brand">SchemeTracker</div>
          <p>*For demonstration purposes only. Always verify eligibility from official government portals. Not affiliated with any government body.</p>
        </div>
      </div>
    </div>
  );
}
