import { useState } from "react";
import { PKG } from "../../data/packages";
import PurchaseForm from "../purchase/PurchaseForm";

export default function RecommendView({ recommendation, onCatalog, onPurchased, onBack }) {
  const [buying, setBuying] = useState(null); // package id being purchased

  const primaryPkg = PKG.find(p => p.id === recommendation.primary);
  const secondaryPkg = recommendation.secondary ? PKG.find(p => p.id === recommendation.secondary) : null;

  const renderCard = (pkg, benefits, isPrimary) => {
    const isBuying = buying === pkg.id;

    return (
      <div className={`recommend-card ${isPrimary ? 'primary' : ''} view-enter`} style={!isPrimary ? { animationDelay: '0.1s' } : undefined}>
        <div className="recommend-card-header">
          <div>
            <span className="recommend-card-badge" style={{ background: pkg.color }}>
              {isPrimary ? 'Recomandat' : 'Alternativa'}
            </span>
            <div className="recommend-card-name">{pkg.name}</div>
            <div className="recommend-card-headline">{pkg.headline}</div>
          </div>
        </div>

        <div className="recommend-card-benefits">
          {benefits.map((b, i) => (
            <div key={i} className="recommend-benefit">
              <span className="recommend-benefit-check" style={{ color: pkg.color }}>✓</span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="recommend-card-footer">
          <div>
            <div className="recommend-price">{pkg.price.toLocaleString("ro")} <span style={{ fontSize: 14, fontWeight: 400 }}>lei{pkg.cat !== "oneTime" ? "/luna" : ""}</span></div>
            {pkg.sub && <div className="recommend-price-sub">{pkg.sub.toLocaleString("ro")} lei/luna la abonament</div>}
            <div className="recommend-price-sub">+ TVA</div>
          </div>
          {!isBuying && (
            <button className="btn btn-primary" onClick={() => setBuying(pkg.id)}>
              Alege acest pachet
            </button>
          )}
        </div>

        {isBuying && (
          <PurchaseForm
            pkg={pkg}
            onClose={() => setBuying(null)}
            onDone={onPurchased}
          />
        )}
      </div>
    );
  };

  return (
    <div className="recommend view-enter">
      <div className="recommend-inner">
        {/* AI reasoning */}
        <div className="recommend-reasoning">
          {recommendation.reasoning}
        </div>

        {/* Primary card */}
        {primaryPkg && renderCard(primaryPkg, recommendation.primaryBenefits || [], true)}

        {/* Secondary card */}
        {secondaryPkg && renderCard(secondaryPkg, recommendation.secondaryBenefits || [], false)}

        {/* Links */}
        <div className="recommend-links">
          <button className="recommend-link" onClick={onCatalog} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Nu ma regasesc? Vezi toate pachetele →
          </button>
          <a href="https://wa.me/40746752240?text=Salut, as vrea sa discut despre promovare pe oradesibiu.ro" target="_blank" rel="noopener" className="recommend-link" style={{ color: 'var(--c-success)' }}>
            Vorbeste cu noi pe WhatsApp
          </a>
          <button className="recommend-link" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            ← Reia consultarea
          </button>
        </div>
      </div>
    </div>
  );
}
