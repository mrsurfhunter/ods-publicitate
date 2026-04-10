const BENEFITS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "400.000+ sibieni lunar",
    desc: "Cea mai citită publicație din Sibiu, cu trafic auditat BRAT. Afacerea ta ajunge la publicul potrivit.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    title: "Vizibilitate pe Google",
    desc: "Articolele rămân indexate permanent. Clienții te găsesc când caută servicii ca ale tale în Sibiu.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
    title: "Toate canalele, un singur pachet",
    desc: "Site + Facebook (218k) + Instagram (18k) + TikTok (24k) + Newsletter + Push notifications.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Conținut profesional inclus",
    desc: "Redacția noastră scrie articolul, creează postările și se ocupă de tot. Tu doar aprobi.",
  },
];

export default function TeaserCards({ onConsult }) {
  return (
    <div className="benefits-section">
      <div className="benefits-heading">
        <h2 className="heading-lg" style={{ color: "var(--c-primary)", marginBottom: 8 }}>De ce să te promovezi pe Ora de Sibiu?</h2>
        <p className="text-secondary" style={{ maxWidth: 480, margin: "0 auto" }}>17 ani de experiență în promovarea afacerilor locale din Sibiu</p>
      </div>
      <div className="benefits-grid">
        {BENEFITS.map((b, i) => (
          <div key={i} className={`benefit-card fade-up stagger-${i + 1}`}>
            <div className="benefit-icon">{b.icon}</div>
            <div className="benefit-title">{b.title}</div>
            <div className="benefit-desc">{b.desc}</div>
          </div>
        ))}
      </div>
      <div className="benefits-footer">
        <div className="benefits-price">Pachete de la <strong>500 lei</strong></div>
        <button className="btn btn-secondary" onClick={onConsult}>Descoperă pachetul potrivit →</button>
      </div>
    </div>
  );
}
