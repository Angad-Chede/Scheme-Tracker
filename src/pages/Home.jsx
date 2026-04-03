import { useState } from 'react';
import '../styles/home.css';
import CountUp from '../components/CountUp';
import { CATS } from '../data';
import { StripeGradientShader } from '../components/ui/stripe-like-gradient-shader';

const TESTIMONIALS = [
  { color: 'green', quote: 'I had no idea I was eligible for 5 schemes until SchemeTracker matched my profile. Applied for PM Kisan within minutes!', name: 'Rajesh Kumar', role: 'Farmer, Bihar' },
  { color: 'dark', quote: 'The missing documents feature saved me weeks of running around. Everything was listed clearly with what I needed to do.', name: 'Priya Sharma', role: 'Small Business Owner, Maharashtra' },
  { color: 'dark', quote: 'As a student from a rural area, I found scholarship schemes I never knew existed. This tool should be used by everyone.', name: 'Amit Patel', role: 'Student, Gujarat' },
  { color: 'green', quote: 'Got the Mudra loan scheme details instantly. The eligibility score showed exactly what I was missing. Applied within a week!', name: 'Mohammed Ali', role: 'Small Business Owner, UP' },
];

const FEATURES = [
  { image: '', tag: 'CORE', title: 'Smart Eligibility Engine', desc: 'AI-powered matching analyzes your profile against complex eligibility criteria across all schemes simultaneously.' },
  { image: '', tag: 'SMART', title: 'Missing Documents Detection', desc: 'Instantly identify which documents you need to complete your application — no guesswork.' },
  { image: '', tag: 'AI', title: 'Personalized Recommendations', desc: 'Get scheme suggestions ranked by relevance to your unique profile and circumstances.' },
  { image: '', tag: 'TRACK', title: 'Deadlines & Benefits', desc: 'Track application deadlines and understand exact benefits for each scheme you qualify for.' },
  { image: '', tag: 'ORGANIZER', title: 'Bookmark & Track', desc: 'Save schemes of interest and track your application progress in one dashboard.' },
  { image: '', tag: 'ADMIN', title: 'Admin Management', desc: 'Comprehensive admin tools for managing schemes, categories, and user analytics.' },
];

const SCHEMES = [
  { cat: 'AGRICULTURE', name: 'PM Kisan Samman Nidhi', benefit: '₹6,000/year', tags: ['Farmer', 'Land Owner'], status: 'eligible' },
  { cat: 'HEALTHCARE', name: 'Ayushman Bharat', benefit: '₹5L Coverage', tags: ['Below Poverty Line', 'Health'], status: 'eligible' },
  { cat: 'HOUSING', name: 'PM Awas Yojana', benefit: '₹2.67L Subsidy', tags: ['Urban', 'Low Income'], status: 'docs' },
  { cat: 'BUSINESS', name: 'Mudra Loan Scheme', benefit: 'Up to ₹10L Loan', tags: ['Entrepreneur', 'MSME'], status: 'eligible' },
];

const FAQ_ITEMS = [
  { q: 'Is this an official government portal?', a: 'No, SchemeTracker is an independent platform that helps you discover and understand government schemes. Always verify eligibility from official government portals before applying.' },
  { q: 'How accurate is the eligibility check?', a: 'Our rule engine is based on official eligibility criteria from government notifications. We aim for 95%+ accuracy, but recommend verifying with official sources.' },
  { q: 'What documents do I need?', a: 'Documents vary by scheme. After checking eligibility, we show you a personalized document checklist for each scheme you qualify for.' },
  { q: 'Can I save schemes for later?', a: 'Yes! Create a free account to bookmark schemes, track your application progress, and get deadline reminders.' },
  { q: 'Is my data secure?', a: 'Absolutely. We never share your personal data with third parties. Your profile is stored securely and used only for eligibility matching.' },
];

export default function Home({ navigate, setFilter }) {
  const [sliderIdx, setSliderIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  function moveSlider(dir) {
    setSliderIdx(prev => Math.max(0, Math.min(prev + dir, TESTIMONIALS.length - 2)));
  }

  return (
    <div className="home-root">
      {/* ── SHADER BACKGROUND WRAPPER (Hero + Stats + Categories) ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <StripeGradientShader className="!h-full" />
        </div>

        {/* ── HERO ── */}
        <section className="hero2" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero2-inner" style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero2-left">
              <span className="hero2-badge">✦ Smart Government Scheme Discovery</span>
              <h1 className="hero2-title">
                Discover Every
                <br />
                <span className="hero2-title-gradient">Government Scheme</span>
                <br />
                You're Entitled To
              </h1>
              <p className="hero2-subtitle">
                Stop missing benefits you qualify for. SchemeTracker intelligently
                matches your profile against 30+ government schemes and tells you
                exactly what you're eligible for — in seconds.
              </p>
              <div className="hero2-actions">
                <button className="btn hero2-btn-primary" onClick={() => navigate('checker')}>
                  Check Eligibility →
                </button>
                <button className="btn hero2-btn-outline" onClick={() => navigate('schemes')}>
                  Explore Schemes
                </button>
              </div>
              <div className="hero2-trust">
                <span>
                  <div className="mockup-floating mockup-f1">100% Free</div></span>
                <span>
                  <div className="mockup-floating mockup-f2">10k+ Users</div></span>
                <span>
                  <div className="mockup-floating mockup-f3">Instant Results</div></span>
              </div>
            </div>

            <div className="hero2-right">
              <div className="hero2-mockup">
                <div className="mockup-bar">
                  <span className="mockup-dot red"></span>
                  <span className="mockup-dot yellow"></span>
                  <span className="mockup-dot green"></span>
                  <span className="mockup-title">SchemeTracker Dashboard</span>
                </div>
                <div className="mockup-body">
                  {[
                    { name: 'PM Kisan Samman Nidhi', sub: '₹6,000/year • Agriculture', badge: 'Eligible', badgeClass: 'badge-green' },
                    { name: 'Ayushman Bharat', sub: '₹5L Coverage • Health', badge: 'Eligible', badgeClass: 'badge-blue' },
                    { name: 'PM Awas Yojana', sub: 'Housing Subsidy • Urban', badge: '95% Match', badgeClass: 'badge-amber' },
                  ].map(s => (
                    <div key={s.name} className="mockup-row">
                      <div>
                        <div className="mockup-row-name">{s.name}</div>
                        <div className="mockup-row-sub">{s.sub}</div>
                      </div>
                      <span className={`mockup-badge ${s.badgeClass}`}>{s.badge}</span>
                    </div>
                  ))}

                  <div className="mockup-progress-row">
                    <div className="mockup-progress-bar">
                      <div className="mockup-progress-fill"></div>
                    </div>
                    <span className="mockup-progress-label">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="stats-strip" style={{ position: 'relative', zIndex: 1 }}>
          {[
            { num: 30, suffix: '+', label: 'Schemes Tracked' },
            { num: 10, suffix: 'k+', label: 'Eligibility Checks' },
            { num: 95, suffix: '%', label: 'Faster Discovery' },
            { num: 12, suffix: '+', label: 'Beneficiary Categories' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-num">
                <CountUp from={0} to={s.num} duration={2} />
                {s.suffix}
              </div>
              <div className="stat-label">{s.label.toUpperCase()}</div>
            </div>
          ))}
        </section>

        {/* ── CATEGORIES ── */}
        <div className="home-container" style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
          <div className="section-label">CATEGORIES</div>
          <h2 className="section-title">Schemes for Every Indian</h2>
          <p className="section-subtitle">From farmers to students, women to senior citizens</p>
          <div className="cat-grid">
            {CATS.map(cat => (
              <div
                key={cat}
                className="cat-card"
                onClick={() => {
                  setFilter(cat);
                  navigate('schemes');
                }}
              >
                <span className="cat-name">{cat}</span>
                <span className="cat-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-container">
        {/* ── HOW IT WORKS ── */}
        <div className="section-label">PROCESS</div>
        <h2 className="section-title">
          How <span className="text-blue">SchemeTracker</span> Works
        </h2>
        <p className="section-subtitle">Four simple steps to discover your benefits</p>

        <div className="how-timeline">
          <div className="how-timeline-line"></div>
          {[
            { title: 'Create Your Profile', desc: 'Share basic details like age, income, occupation, and location.' },
            { title: 'Check Eligibility', desc: 'Our engine scans 30+ schemes and matches them to your profile instantly.' },
            { title: 'Get Personalized Schemes', desc: 'See which schemes you qualify for with benefits, deadlines, and requirements.' },
            { title: 'Complete Documents', desc: 'Know exactly which documents are missing and how to get them.' },
          ].map((step, i) => (
            <div key={i} className={`how-step ${i % 2 === 0 ? 'how-step-left' : 'how-step-right'}`}>
              <div className="how-step-card">
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
              </div>
              <div className="how-step-dot"></div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <div className="section-label">FEATURES</div>
        <h2 className="section-title">
          Everything You Need to <span className="text-blue">Claim Your Benefits</span>
        </h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`feature-item ${i % 2 === 0 ? 'feature-item-left' : 'feature-item-right'}`}>
              <div className="feature-card">
                <div className="feature-tag-row">

                  <span className="feature-tag">{f.tag}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
              <div className="feature-visual">
                <img src={f.image} alt={f.title} className="feature-visual-img" />
              </div>
            </div>
          ))}
        </div>

        {/* ── SCHEME EXPLORER ── */}
        <div className="section-label">SCHEME EXPLORER</div>
        <h2 className="section-title">
          Discover Schemes <span className="text-blue">Tailored for You</span>
        </h2>
        <p className="section-subtitle">Browse featured government schemes with instant eligibility indicators.</p>
        <div className="home-table-wrapper">
          <div className="home-table-gradient"></div>
          <div className="home-table-container">
            <table className="home-scheme-table">
              <thead>
                <tr>
                  <th>Scheme Name</th>
                  <th>Category</th>
                  <th>Key Benefits</th>
                  <th>Your Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {SCHEMES.map(s => (
                  <tr key={s.name} onClick={() => navigate('schemes')}>
                    <td className="st-name-cell">
                      <strong>{s.name}</strong>
                      <div className="st-tags">
                        {s.tags.map(t => <span key={t} className="st-tag">{t}</span>)}
                      </div>
                    </td>
                    <td className="st-cat-cell">{s.cat}</td>
                    <td className="st-benefit-cell">{s.benefit}</td>
                    <td className="st-status-cell">
                      <span className={`st-badge ${s.status === 'docs' ? 'st-badge-warn' : 'st-badge-success'}`}>
                        {s.status === 'docs' ? '⚠ Action Needed' : '✓ Eligible'}
                      </span>
                    </td>
                    <td className="st-action-cell">
                      <button className="btn btn-ghost btn-sm st-view-btn">View →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="compare-section">
        <div className="section-label white">THE PROBLEM &amp; SOLUTION</div>
        <h2 className="compare-title">
          Why Millions Miss Their <span className="text-teal">Entitled Benefits</span>
        </h2>
        <div className="compare-grid">
          <div className="compare-col">
            <div className="compare-col-head red">WITHOUT SCHEMETRACKER</div>
            {[
              'You miss schemes you actually qualify for',
              'Eligibility rules are complex and confusing',
              'Documents scattered across departments',
              'Government portals are hard to navigate',
            ].map(t => (
              <div key={t} className="compare-row compare-row-bad">
                <span className="compare-x">✕</span>
                {t}
              </div>
            ))}
          </div>
          <div className="compare-col">
            <div className="compare-col-head green">WITH SCHEMETRACKER</div>
            {[
              'Instant matching against 30+ schemes',
              'Simple profile-based eligibility engine',
              'Missing document detection & guidance',
              'One unified, intuitive dashboard',
            ].map(t => (
              <div key={t} className="compare-row compare-row-good">
                <span className="compare-check">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="home-container">
        {/* ── TESTIMONIALS ── */}
        <div className="section-label">TESTIMONIALS</div>
        <div className="testimonials-section">
          <div className="testimonials-left">
            <h2 className="testimonials-heading">
              TRUSTED BY
              <br />
              THOUSANDS
            </h2>
            <p className="testimonials-sub">See the stories of people who discovered their government benefits.</p>
            <div className="testimonials-navs">
              <button className={`t-nav-btn ${sliderIdx > 0 ? 't-nav-active' : ''}`} onClick={() => moveSlider(-1)}>
                ←
              </button>
              <button
                className={`t-nav-btn ${sliderIdx < TESTIMONIALS.length - 2 ? 't-nav-active' : ''}`}
                onClick={() => moveSlider(1)}
              >
                →
              </button>
            </div>
          </div>
          <div className="testimonials-cards-area">
            <div className="testimonials-track" style={{ transform: `translateX(calc(-${sliderIdx} * (50% + 10px)))` }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} className={`t-card t-card--${t.color}`}>
                  <div className="t-card-logo">▶</div>
                  <p className="t-card-quote">"{t.quote}"</p>
                  <div className="t-card-name">{t.name}</div>
                  <div className="t-card-role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="section-label">FAQ</div>
        <h2 className="section-title">
          Common <span className="text-blue">Questions</span>
        </h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <span className="faq-chevron">{openFaq === i ? '∧' : '∨'}</span>
              </button>
              {openFaq === i && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>

        {/* ── CTA BANNER ── */}
        <div className="cta-banner">
          <h2 className="cta-title">Don't Miss Schemes You Deserve</h2>
          <p className="cta-subtitle">
            Join thousands of Indians who discovered their government benefits using SchemeTracker. It's free, instant, and private.
          </p>
          <button className="btn btn-lg cta-btn" onClick={() => navigate('checker')}>
            <span className="cta-btn-label">Check Your Eligibility Now</span>
            <span className="cta-btn-hover">
              <span>Check Your Eligibility Now</span>
              <span className="cta-btn-arrow">→</span>
            </span>
            <span className="cta-btn-dot"></span>
          </button>
        </div>

        {/* ── FOOTER ── */}
        <footer className="home-footer2">
          <div className="footer-top">
            <div className="footer-brand-col">
              <div className="footer-brand">
                Scheme<span>Tracker</span>
              </div>
              <p className="footer-brand-desc">
                Helping every Indian citizen discover and claim the government benefits they deserve.
              </p>
            </div>
            <div className="footer-links-col">
              <div className="footer-col-title">Product</div>
              <a className="footer-link" href="#">Features</a>
              <a className="footer-link" href="#">How It Works</a>
              <a className="footer-link" href="#">Schemes</a>
              <a className="footer-link" href="#">Pricing</a>
            </div>
            <div className="footer-links-col">
              <div className="footer-col-title">Support</div>
              <a className="footer-link" href="#">Help Center</a>
              <a className="footer-link" href="#">Contact Us</a>
              <a className="footer-link" href="#">Privacy Policy</a>
              <a className="footer-link" href="#">Terms of Service</a>
            </div>
            <div className="footer-links-col">
              <div className="footer-col-title">Resources</div>
              <a className="footer-link" href="#">Blog</a>
              <a className="footer-link" href="#">Documentation</a>
              <a className="footer-link" href="#">Government Links</a>
              <a className="footer-link" href="#">FAQ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2024 SchemeTracker. All rights reserved.</span>
            <span className="footer-disclaimer">
              *For demonstration purposes only. Not affiliated with any government body. Always verify from official portals.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}