import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import CountUp from '../components/CountUp';
import { CATS } from '../data';
import { StripeGradientShader } from '../components/ui/stripe-like-gradient-shader';

import imgAgri from '../assets/1Agri.png';
import imgHealth from '../assets/2health.png';
import imgHouse from '../assets/3house.png';
import imgEmploy from '../assets/4employ.png';
import imgEdu from '../assets/5edu.png';
import imgWomen from '../assets/6women.png';
import imgMsme from '../assets/7msme.png';
import imgDisable from '../assets/8disable.png';
import imgPension from '../assets/9pension.png';
import imgWelfare from '../assets/10welfare.png';
import imgInsurance from '../assets/11insurance.png';
import imgFinance from '../assets/12finance.png';

const CATEGORY_IMAGES = {
  Agriculture: imgAgri,
  Healthcare: imgHealth,
  Housing: imgHouse,
  Employment: imgEmploy,
  Education: imgEdu,
  'Women Empowerment': imgWomen,
  'Startups / MSME': imgMsme,
  'Disability Welfare': imgDisable,
  Pension: imgPension,
  Welfare: imgWelfare,
  Insurance: imgInsurance,
  'Financial Inclusion': imgFinance,
};

const FOUNDATION_TABS = [
  {
    id: 'process',
    label: 'Process',
    title: 'Four simple steps to discover and claim your government benefits.',
    items: [
      { title: 'Create Your Profile', desc: 'Share details like age, income, and occupation.', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { title: 'Check Eligibility', desc: 'Our engine scans 30+ schemes instantly.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { title: 'Get Schemes', desc: 'See personalized matches and exact benefits.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    title: 'Everything you need to easily claim your benefits.',
    items: [
      { title: 'Smart Engine', desc: 'AI-powered eligibility matching across criteria.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { title: 'Missing Docs', desc: 'Identify required documents without guesswork.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { title: 'Track Deadlines', desc: 'Never miss an application date or deadline.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },
  {
    id: 'compare',
    label: 'Compare',
    title: 'Why millions choose SchemeTracker over manual search.',
    items: [
      { title: 'Instant Matching', desc: 'Stop missing schemes you actually qualify for.', icon: 'M5 13l4 4L19 7' },
      { title: 'Simple Rules', desc: 'Navigate complex government rules with a unified backend.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
      { title: 'One Dashboard', desc: 'Manage your documents and applications in one place.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    ],
  },
];

const TESTIMONIALS = [
  { quote: 'I had no idea I was eligible for 5 schemes until SchemeTracker matched my profile. Applied for PM Kisan within minutes!', name: 'Rajesh Kumar', role: 'Farmer, Bihar' },
  { quote: 'The missing documents feature saved me weeks of running around. Everything was listed clearly with what I needed to do.', name: 'Priya Sharma', role: 'Small Business Owner, Maharashtra' },
  { quote: 'As a student from a rural area, I found scholarship schemes I never knew existed. This tool should be used by everyone.', name: 'Amit Patel', role: 'Student, Gujarat' },
  { quote: 'Got the Mudra loan scheme details instantly. The eligibility score showed exactly what I was missing. Applied within a week!', name: 'Mohammed Ali', role: 'Small Business Owner, UP' },
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

export default function Home({ setFilter }) {
  const navigate = useNavigate();
  const [sliderIdx, setSliderIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [foundationTab, setFoundationTab] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setFoundationTab((p) => (p + 1) % 3);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  function moveSlider(dir) {
    setSliderIdx((prev) => Math.max(0, Math.min(prev + dir, TESTIMONIALS.length - 1)));
  }

  return (
    <div className="home-root">
      {/* HERO */}
      <section className="hero2">
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.8 }}>
          <StripeGradientShader />
        </div>
        <div className="hero2-bg-glow hero2-bg-glow-1"></div>
        <div className="hero2-bg-glow hero2-bg-glow-2"></div>
        <div className="hero2-grid"></div>

        <div className="hero2-inner">
          <div className="hero2-left">
            <span className="hero2-badge">✦ Smart Government Scheme Discovery</span>

            <h1 className="hero2-title">
              Discover Every
              <br />
              <span className="hero2-title-gradient">Government Scheme</span>
              <br />
              You&apos;re Entitled To
            </h1>

            <p className="hero2-subtitle">
              Stop missing benefits you qualify for. SchemeTracker intelligently matches your
              profile against 30+ government schemes and tells you exactly what you&apos;re
              eligible for — in seconds.
            </p>

            <div className="hero2-actions">
              <button className="btn hero2-btn-primary" onClick={() => navigate('/checker')}>
                Check Eligibility →
              </button>
              <button className="btn hero2-btn-outline" onClick={() => navigate('/schemes')}>
                Explore Schemes
              </button>
            </div>

            <div className="hero2-trust">
              <span className="hero2-trust-badge hero2-trust-green">100% Free</span>
              <span className="hero2-trust-badge hero2-trust-blue">10k+ Users</span>
              <span className="hero2-trust-badge hero2-trust-cyan">Instant Results</span>
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
                ].map((s) => (
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

      {/* STATS STRIP */}
      <section className="stats-strip">
        {[
          { num: 30, suffix: '+', label: 'Schemes Tracked' },
          { num: 10, suffix: 'k+', label: 'Eligibility Checks' },
          { num: 95, suffix: '%', label: 'Faster Discovery' },
          { num: 12, suffix: '+', label: 'Beneficiary Categories' },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <div className="stat-num">
              <CountUp from={0} to={s.num} duration={2} />
              {s.suffix}
            </div>
            <div className="stat-label">{s.label.toUpperCase()}</div>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <div className="home-container" style={{ paddingBottom: '60px' }}>
        <div className="section-label">CATEGORIES</div>
        <h2 className="section-title">Schemes for Every Indian</h2>
        <p className="section-subtitle" style={{ marginBottom: '40px' }}>
          From farmers to students, women to senior citizens
        </p>

        <div className="marquee-container">
          <div className="cat-gallery">
            {[...CATS.slice(0, 12), ...CATS.slice(0, 12)].map((cat, idx) => (
              <div
                key={`${cat}-${idx}`}
                className="cat-gallery-item"
                onClick={() => {
                  setFilter(cat);
                  navigate('/schemes');
                }}
              >
                <img src={CATEGORY_IMAGES[cat] || imgAgri} alt={cat} className="cat-gallery-img" />
                <div className="cat-gallery-overlay">
                  <span className="cat-gallery-title">{cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-container">
        {/* FOUNDATION */}
        <div className="foundation-wrapper" style={{ marginBottom: '80px' }}>
          <div className="section-label">THE SOLUTION</div>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>
            Our foundation for <span className="text-blue">benefit discovery.</span>
          </h2>

          <div className="foundation-card">
            <div className="foundation-bg"></div>

            <div className="foundation-content">
              <div className="foundation-tabs">
                {FOUNDATION_TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    className={`foundation-tab ${foundationTab === idx ? 'active' : ''}`}
                    onClick={() => setFoundationTab(idx)}
                  >
                    {foundationTab === idx && (
                      <span className="foundation-tab-icon">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ marginRight: '4px' }}
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </span>
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>

              <h3 className="foundation-main-title">{FOUNDATION_TABS[foundationTab].title}</h3>

              <div className="foundation-items">
                {FOUNDATION_TABS[foundationTab].items.map((item, i) => (
                  <div key={i} className="foundation-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="foundation-item-text">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <div className="foundation-item-icon">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="foundation-visual">
              <div className="f-globe-container">
                <div className="f-globe"></div>
                <div className="f-globe-glow"></div>
                <div className="f-globe-grid"></div>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEME EXPLORER */}
        <div className="section-label">SCHEME EXPLORER</div>
        <h2 className="section-title">
          Discover Schemes <span className="text-blue">Tailored for You</span>
        </h2>
        <p className="section-subtitle">
          Browse featured government schemes with instant eligibility indicators.
        </p>

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
                {SCHEMES.map((s) => (
                  <tr key={s.name} onClick={() => navigate('/schemes')}>
                    <td className="st-name-cell">
                      <strong>{s.name}</strong>
                      <div className="st-tags">
                        {s.tags.map((t) => (
                          <span key={t} className="st-tag">
                            {t}
                          </span>
                        ))}
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

      {/* TESTIMONIALS */}
      <section className="testimonials-full">
        <div className="tf-bg-container">
          <div className="tf-crazy-glow"></div>
        </div>

        <div className="tf-content">
          <div className="tf-header">
            <div className="tf-label">REAL STORIES</div>
            <h2 className="tf-title">
              A fuller spectrum of benefits.
              <br />
              Powered by everyday people.
            </h2>
          </div>

          <div className="tf-carousel-wrapper">
            <div className="tf-track" style={{ transform: `translateX(calc(-${sliderIdx} * 364px))` }}>
              {TESTIMONIALS.map((t, i) => {
                const parts = t.name.split(' ');
                const first = parts[0] || '';
                const rest = parts.slice(1).join(' ') || '';
                const colors = ['text-orange', 'text-blue', 'text-teal-alt'];
                const colorClass = colors[i % colors.length];

                return (
                  <div key={i} className="tf-card">
                    <div className="tf-card-top">
                      <h3 className="tf-card-name">
                        <span className="tf-name-dark">{first}</span>{' '}
                        <span className={colorClass}>{rest}</span>
                      </h3>
                      <div className="tf-card-badge">
                        <span className="tf-badge-num">100%</span> Match
                      </div>
                    </div>

                    <div className="tf-card-body">{t.quote}</div>
                    <div className="tf-card-role">{t.role}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tf-nav">
            <button className="tf-nav-btn" onClick={() => moveSlider(-1)} disabled={sliderIdx === 0}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              className="tf-nav-btn"
              onClick={() => moveSlider(1)}
              disabled={sliderIdx >= TESTIMONIALS.length - 1}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <div className="home-container">
        {/* FAQ */}
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

        {/* CTA */}
        <div className="cta-banner">
          <h2 className="cta-title">Don&apos;t Miss Schemes You Deserve</h2>
          <p className="cta-subtitle">
            Join thousands of Indians who discovered their government benefits using
            SchemeTracker. It&apos;s free, instant, and private.
          </p>

          <button className="btn btn-lg cta-btn" onClick={() => navigate('/checker')}>
            <span className="cta-btn-label">Check Your Eligibility Now</span>
            <span className="cta-btn-hover">
              <span>Check Your Eligibility Now</span>
              <span className="cta-btn-arrow">→</span>
            </span>
            <span className="cta-btn-dot"></span>
          </button>
        </div>

        {/* FOOTER */}
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
              *For demonstration purposes only. Not affiliated with any government body.
              Always verify from official portals.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}