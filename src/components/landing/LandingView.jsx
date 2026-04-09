const TRUST = [
  { v: "400k+", l: "vizitatori/luna" },
  { v: "1.8M", l: "afisari/luna" },
  { v: "218k", l: "Facebook" },
  { v: "18k", l: "Instagram" },
  { v: "24k", l: "TikTok" },
];

export default function LandingView({ onConsult, onAnunturi, onCatalog }) {
  return (
    <div className="view-enter">
      <div className="landing-hero">
        <div className="container-narrow">
          <h1 className="heading-xl landing-headline">Promoveaza-ti afacerea in Sibiu</h1>
          <p className="landing-sub">
            Spune-ne cateva lucruri despre afacerea ta si iti recomandam cel mai bun pachet de promovare pe cea mai citita publicatie din Sibiu.
          </p>
          <div className="landing-cta">
            <button className="btn btn-primary" style={{ fontSize: 17, padding: '16px 36px' }} onClick={onConsult}>
              Hai sa gasim pachetul potrivit
            </button>
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,.06)', color: '#fff', borderColor: 'rgba(255,255,255,.15)' }} onClick={onAnunturi}>
              Mica Publicitate
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
          <button className="landing-link" onClick={onCatalog} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Vezi toate pachetele →
          </button>
        </div>
      </div>
    </div>
  );
}
