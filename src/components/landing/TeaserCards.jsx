import { PKG } from "../../data/packages";

const TEASER_IDS = ["social-pack", "advertorial", "premium"];

export default function TeaserCards({ onConsult }) {
  const pkgs = TEASER_IDS.map(id => PKG.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="teaser-section">
      <div className="teaser-heading">
        <h2 className="heading-lg" style={{ color: "var(--c-primary)", marginBottom: 8 }}>Pachete de promovare</h2>
        <p className="text-secondary" style={{ maxWidth: 440, margin: "0 auto" }}>Alege dintr-o gama completa de servicii adaptate nevoilor afacerii tale</p>
      </div>
      <div className="teaser-grid">
        {pkgs.map((pkg, i) => (
          <div key={pkg.id} className={`teaser-card fade-up stagger-${i + 1}`}>
            <div className="teaser-card-body">
              <div className="teaser-card-name">{pkg.name}</div>
              <div className="teaser-card-desc">{pkg.headline}</div>
              <ul className="teaser-card-features">
                {pkg.inc.slice(0, 3).map((item, j) => (
                  <li key={j}>{item.w}</li>
                ))}
              </ul>
            </div>
            <div className="teaser-overlay">
              <div className="teaser-lock">🔒</div>
              <div className="teaser-overlay-text">Creeaza cont gratuit pentru preturi</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button className="btn btn-secondary" onClick={onConsult}>Descopera pachetul potrivit</button>
      </div>
    </div>
  );
}
