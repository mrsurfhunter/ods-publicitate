import { useState } from "react";
import { PKG, ADDONS } from "../../data/packages";
import PurchaseForm from "../purchase/PurchaseForm";

const TIER_STYLES = {
  start: { border: "border-slate-200", badge: "bg-slate-100 text-slate-600", btn: "bg-slate-700 hover:bg-slate-900 border-slate-700", ring: "" },
  recommended: { border: "border-brand", badge: "bg-brand text-white", btn: "bg-brand hover:bg-brand-dark border-brand", ring: "" },
  popular: { border: "border-amber-400", badge: "bg-amber-400 text-amber-900", btn: "bg-amber-500 hover:bg-amber-600 border-amber-500", ring: "ring-2 ring-amber-200" },
  max: { border: "border-slate-900", badge: "bg-slate-900 text-white", btn: "bg-slate-900 hover:bg-black border-slate-900", ring: "" },
};

function TierCard({ tier, pkg, isBuying, onBuy, onPurchased }) {
  const style = TIER_STYLES[tier.tier] || TIER_STYLES.start;

  return (
    <div className={`bg-white border-2 ${style.border} ${style.ring} relative flex flex-col`}>
      <div className={`absolute -top-3 left-4 ${style.badge} text-[10px] font-black px-3 py-1 uppercase tracking-[1.5px]`}>
        {tier.label}
      </div>
      <div className="p-4 sm:p-5 pt-6 flex-1 flex flex-col">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-1">
          {pkg.cat === 'monthly' ? 'Pachet lunar' : 'O singură comandă'}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-1">{pkg.name}</h3>
        <div className="flex items-baseline gap-1.5 mb-4">
          {pkg.sub && <span className="text-sm text-slate-400 line-through font-bold">{pkg.price.toLocaleString("ro")}</span>}
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{(pkg.sub || pkg.price).toLocaleString("ro")}</span>
          <span className="text-xs font-bold text-slate-500">lei{pkg.cat === 'monthly' ? '/lună' : ''}</span>
        </div>
        {pkg.sub && <div className="text-[10px] font-black text-brand uppercase tracking-wider mb-3">Preț abonament</div>}
        <div className="space-y-2 mb-4 border-t border-slate-100 pt-3 flex-1">
          {(tier.benefits && tier.benefits.length > 0 ? tier.benefits : pkg.inc.slice(0, 4).map(x => x.w)).map((b, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-4 h-4 bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-check text-[8px]"></i>
              </div>
              <span className="text-xs text-slate-700 leading-snug">{b}</span>
            </div>
          ))}
        </div>
        {tier.addons && tier.addons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tier.addons.map(aId => {
              const addon = ADDONS.find(a => a.id === aId);
              return addon ? (
                <span key={aId} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 border border-blue-200">
                  + {addon.name}
                </span>
              ) : null;
            })}
          </div>
        )}
        {!isBuying && (
          <button
            onClick={onBuy}
            className={`w-full ${style.btn} text-white font-bold px-4 py-3 text-xs uppercase tracking-wider border-2 transition-all`}
          >
            Comandă <i className="fas fa-arrow-right ml-1"></i>
          </button>
        )}
      </div>
      {isBuying && <PurchaseForm pkg={pkg} onClose={() => onBuy()} onDone={onPurchased} />}
    </div>
  );
}

export default function RecommendView({ recommendation, onCatalog, onPurchased, onBack }) {
  const [buying, setBuying] = useState(null);

  const tiers = recommendation.tiers || [];
  const allAddonIds = [...new Set(tiers.flatMap(t => t.addons || []))];
  const suggestedAddons = allAddonIds.map(id => ADDONS.find(a => a.id === id)).filter(Boolean);

  const gridCols = tiers.length >= 4 ? 'lg:grid-cols-4' : tiers.length === 3 ? 'lg:grid-cols-3' : tiers.length === 2 ? 'lg:grid-cols-2' : '';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-14 animate-fadeIn">
      <button onClick={onBack} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[2px] mb-6 transition-colors">
        <i className="fas fa-arrow-left mr-1"></i> Înapoi la întrebări
      </button>

      {recommendation.summary && (
        <div className="bg-blue-50 border-2 border-blue-200 p-5 mb-8 flex gap-4">
          <div className="w-9 h-9 bg-cta text-white flex items-center justify-center flex-shrink-0">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 mb-1">Am pregătit opțiunile pentru tine.</div>
            <p className="text-xs text-slate-600 leading-relaxed">{recommendation.summary}</p>
          </div>
        </div>
      )}

      <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-5">Opțiuni personalizate</div>

      <div className={`grid md:grid-cols-2 ${gridCols} gap-4 sm:gap-5`}>
        {tiers.map(tier => {
          const pkg = PKG.find(p => p.id === tier.id);
          if (!pkg) return null;
          return (
            <TierCard
              key={tier.id}
              tier={tier}
              pkg={pkg}
              isBuying={buying === tier.id}
              onBuy={(order) => {
                if (order && order.id) { onPurchased(order); }
                else { setBuying(buying === tier.id ? null : tier.id); }
              }}
              onPurchased={(order) => { onPurchased(order); }}
            />
          );
        })}
      </div>

      {suggestedAddons.length > 0 && (
        <div className="mt-10">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Adaugă și...</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestedAddons.map(addon => (
              <div key={addon.id} className="bg-white border-2 border-slate-200 p-4 flex gap-3">
                <div className="w-9 h-9 bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${addon.icon}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-900">{addon.name}</div>
                  <div className="text-xs text-slate-500 mb-1">{addon.desc}</div>
                  <div className="text-sm font-black text-slate-900">{addon.price.toLocaleString("ro")} lei{addon.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-10 border-t-2 border-slate-200 pt-8">
        <button onClick={onCatalog} className="text-sm font-black text-slate-900 hover:underline uppercase tracking-wider">
          Vezi toate pachetele <i className="fas fa-arrow-right ml-1"></i>
        </button>
        <div className="mt-4">
          <a href="https://wa.me/40746752240?text=Salut, aș vrea să discut despre promovare pe oradesibiu.ro" target="_blank" rel="noopener" className="text-green-600 text-sm font-semibold hover:underline inline-flex items-center gap-1.5">
            <i className="fab fa-whatsapp"></i> Vorbește cu noi pe WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
