import TeaserCards from "./TeaserCards";
import HowItWorks from "./HowItWorks";

const TRUST = [
  { v: "400k+", l: "vizitatori/lună" },
  { v: "1.8M", l: "afișări/lună" },
  { v: "218k", l: "Facebook" },
  { v: "18k", l: "Instagram" },
  { v: "24k", l: "TikTok" },
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
                <div className="landing-trust-val">{s.v}</div>
                <div className="landing-trust-label">{s.l}</div>
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
