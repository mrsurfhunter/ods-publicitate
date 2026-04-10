import TeaserCards from "./TeaserCards";
import HowItWorks from "./HowItWorks";

const IconEye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconFB = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IconIG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const IconTT = () => (
  <svg width="18" height="20" viewBox="0 0 448 512" fill="currentColor">
    <path d="M448 209.91a210.06 210.06 0 01-122.77-39.25v178.72A162.55 162.55 0 11185 188.31v89.89a74.62 74.62 0 1052.23 71.18V0h88a121 121 0 00122.77 121v88.91z"/>
  </svg>
);

const TRUST = [
  { v: "400k+", l: "vizitatori/lună", icon: IconEye },
  { v: "1.8M", l: "afișări/lună", icon: IconChart },
  { v: "218k", l: "Facebook", icon: IconFB },
  { v: "18k", l: "Instagram", icon: IconIG },
  { v: "24k", l: "TikTok", icon: IconTT },
];

export default function LandingView({ onConsult, onAnunturi, onCatalog }) {
  return (
    <div className="view-enter">
      {/* Hero */}
      <div className="landing-hero">
        <div className="container-narrow">
          <div className="landing-eyebrow">Cea mai citită publicație din Sibiu</div>
          <h1 className="heading-xl landing-headline">Fă-ți afacerea vizibilă în Sibiu</h1>
          <p className="landing-sub">
            Spune-ne despre afacerea ta și îți creăm o strategie de promovare personalizată. În 2 minute.
          </p>
          <div className="landing-cta">
            <button className="btn btn-primary" onClick={onConsult}>
              Începe consultarea gratuită
            </button>
            <button className="btn btn-ghost" onClick={onAnunturi}>
              Mică Publicitate
            </button>
          </div>
          <div className="landing-trust">
            {TRUST.map((s, i) => (
              <div key={i} className="landing-trust-item">
                <div className="landing-trust-icon"><s.icon /></div>
                <div className="landing-trust-text">
                  <div className="landing-trust-val">{s.v}</div>
                  <div className="landing-trust-label">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="landing-secondary-link" onClick={onCatalog}>
            Vezi toate pachetele →
          </button>
        </div>
      </div>

      {/* Social proof */}
      <div className="social-proof-bar">
        <div className="social-proof-item"><div className="social-proof-dot" /> 17 ani experiență</div>
        <div className="social-proof-item"><div className="social-proof-dot" /> Trafic auditat BRAT</div>
        <div className="social-proof-item"><div className="social-proof-dot" /> Peste 1.000 clienți</div>
      </div>

      {/* Teaser packages */}
      <TeaserCards onConsult={onConsult} />

      {/* How it works */}
      <div style={{ background: "var(--c-card)", borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)" }}>
        <HowItWorks />
      </div>

      {/* Final CTA */}
      <div className="final-cta">
        <h2 className="heading-lg">Gata să începi?</h2>
        <button className="btn btn-primary" onClick={onConsult}>Descoperă pachetul potrivit</button>
        <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="final-cta-link">
          Sau scrie-ne pe WhatsApp
        </a>
      </div>
    </div>
  );
}
