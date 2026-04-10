import { useState } from "react";
import { PKG } from "../../data/packages";
import { useAuth } from "../../context/AuthContext";
import PurchaseForm from "../purchase/PurchaseForm";
import LeadCaptureStep from "../auth/LeadCaptureStep";

function CatalogCard({ pkg, onPurchased, featured }) {
  const [buying, setBuying] = useState(false);

  return (
    <div className={`cat-card ${featured ? 'cat-card--featured' : ''}`}>
      {featured && <div className="cat-card__badge">Cel mai popular</div>}

      {/* Header: name + price side by side */}
      <div className="cat-card__header">
        <div className="cat-card__title-area">
          <div className="cat-card__name">{pkg.name}</div>
          <div className="cat-card__headline">{pkg.headline}</div>
        </div>
        <div className="cat-card__price-area">
          <div className="cat-card__price">{pkg.price.toLocaleString("ro")} <span className="cat-card__price-unit">lei</span></div>
          <div className="cat-card__price-meta">{pkg.cat !== "oneTime" ? "/ lună + TVA" : "+ TVA (o dată)"}</div>
          {pkg.sub && <div className="cat-card__sub">{pkg.sub.toLocaleString("ro")} lei la abonament</div>}
        </div>
      </div>

      {/* Features always visible */}
      <div className="cat-card__features">
        {pkg.inc.map((x, i) => (
          <div key={i} className="cat-card__feature">
            <span className="cat-card__check">✓</span>
            <div>
              <span className="cat-card__feature-main">{x.w}</span>
              {x.d && <span className="cat-card__feature-detail"> — {x.d}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: delivery + CTA */}
      <div className="cat-card__footer">
        <div className="cat-card__delivery">📅 {pkg.delivery}</div>
        {!buying ? (
          <button className={`btn ${featured ? 'btn-primary' : 'btn-secondary'} btn-block`} onClick={() => setBuying(true)}>
            Alege {pkg.name}
          </button>
        ) : (
          <PurchaseForm pkg={pkg} onClose={() => setBuying(false)} onDone={onPurchased} />
        )}
      </div>
    </div>
  );
}

export default function CatalogView({ onConsult, onPurchased }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="catalog view-enter">
        <div className="catalog-header">
          <div className="eyebrow" style={{ marginBottom: 8 }}>Pachete de promovare</div>
          <h2 className="heading-lg" style={{ color: 'var(--c-primary)', marginBottom: 8 }}>Alege pachetul potrivit pentru afacerea ta</h2>
          <p className="text-secondary" style={{ maxWidth: 420, margin: '0 auto 28px' }}>Creează un cont gratuit pentru a vedea detaliile complete și a comanda.</p>
        </div>
        <div className="catalog-gate">
          <LeadCaptureStep source="catalog" />
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="consult-back" onClick={onConsult} style={{ margin: '0 auto' }}>
            ← Nu știi ce să alegi? Lasă-ne să îți recomandăm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog view-enter">
      <div className="catalog-header">
        <div className="eyebrow" style={{ marginBottom: 8 }}>Pachete de promovare</div>
        <h2 className="heading-lg" style={{ color: 'var(--c-primary)', marginBottom: 8 }}>Alege pachetul potrivit</h2>
        <p className="text-secondary" style={{ marginBottom: 16 }}>Toate pachetele includ publicare pe oradesibiu.ro — cea mai citită publicație din Sibiu.</p>
        <button className="btn btn-ghost btn-sm" onClick={onConsult}>
          Nu știi ce să alegi? Lasă-ne să te ajutăm →
        </button>
      </div>
      <div className="cat-list">
        {PKG.map(p => (
          <CatalogCard key={p.id} pkg={p} onPurchased={onPurchased} featured={p.pop} />
        ))}
      </div>
    </div>
  );
}
