import { useState } from "react";
import { PKG } from "../../data/packages";
import { useAuth } from "../../context/AuthContext";
import PurchaseForm from "../purchase/PurchaseForm";
import LeadCaptureStep from "../auth/LeadCaptureStep";

function CatalogCard({ pkg, onPurchased }) {
  const [open, setOpen] = useState(false);
  const [buying, setBuying] = useState(false);

  return (
    <div className={`catalog-card ${pkg.pop ? 'popular' : ''}`}>
      {pkg.pop && <div className="catalog-card-pop-badge">CEL MAI POPULAR</div>}
      <div className="catalog-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 4, height: 28, background: pkg.color, borderRadius: 2 }} />
          <div className="catalog-card-name">{pkg.name}</div>
        </div>
        <div className="catalog-card-headline">{pkg.headline}</div>

        <div className="catalog-card-price">
          <span className="catalog-card-price-val">{pkg.price.toLocaleString("ro")}</span>
          <span className="catalog-card-price-info">lei + TVA{pkg.cat !== "oneTime" ? " /luna" : ""}</span>
        </div>

        {pkg.sub && (
          <div className="catalog-card-sub">{pkg.sub.toLocaleString("ro")} lei la abonament</div>
        )}

        <button className="catalog-details-toggle" onClick={() => setOpen(!open)}>
          {open ? "Ascunde detalii ▲" : "Vezi detalii ▼"}
        </button>

        {open && (
          <div className="catalog-details">
            {pkg.inc.map((x, i) => (
              <div key={i} className="catalog-detail-row">
                <span style={{ color: 'var(--c-success)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--c-primary)' }}>{x.w}</span>
                  {x.d && <span style={{ color: 'var(--c-text2)' }}> — {x.d}</span>}
                </div>
              </div>
            ))}
            <div className="catalog-card-delivery">📅 {pkg.delivery}</div>
          </div>
        )}

        {!buying && (
          <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => setBuying(true)}>
            Alege pachetul
          </button>
        )}
      </div>

      {buying && (
        <PurchaseForm pkg={pkg} onClose={() => setBuying(false)} onDone={onPurchased} />
      )}
    </div>
  );
}

export default function CatalogView({ onConsult, onPurchased }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="catalog view-enter">
        <div className="catalog-header">
          <h2 className="heading-lg" style={{ color: 'var(--c-primary)', marginBottom: 8 }}>Pachetele noastre</h2>
          <p className="text-secondary" style={{ marginBottom: 24 }}>Creeaza un cont gratuit pentru a vedea preturile si detaliile complete.</p>
        </div>
        <div className="catalog-gate">
          <LeadCaptureStep source="catalog" />
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="consult-back" onClick={onConsult} style={{ margin: '0 auto' }}>
            ← Sau lasa-ne sa iti recomandam pachetul potrivit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog view-enter">
      <div className="catalog-header">
        <h2 className="heading-lg" style={{ color: 'var(--c-primary)', marginBottom: 8 }}>Toate pachetele</h2>
        <p className="text-secondary" style={{ marginBottom: 16 }}>Alege direct sau lasa-ne sa te ajutam.</p>
        <button className="btn btn-ghost btn-sm" onClick={onConsult}>
          Nu stii ce sa alegi? Lasa-ne sa te ajutam →
        </button>
      </div>
      <div className="catalog-grid">
        {PKG.map(p => (
          <CatalogCard key={p.id} pkg={p} onPurchased={onPurchased} />
        ))}
      </div>
    </div>
  );
}
