import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import PurchaseForm from "../purchase/PurchaseForm";

const TIER_STYLE = {
  start: {
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-600",
    btn: "bg-slate-900 hover:bg-black border-2 border-slate-900",
    accent: "text-slate-600",
  },
  recommended: {
    border: "border-brand",
    badge: "bg-brand text-white",
    btn: "bg-brand hover:bg-brand-dark border-2 border-brand",
    accent: "text-brand",
  },
  popular: {
    border: "border-amber-400",
    badge: "bg-amber-400 text-amber-900",
    btn: "bg-amber-500 hover:bg-amber-600 border-2 border-amber-500 text-white",
    accent: "text-amber-600",
  },
  max: {
    border: "border-slate-900",
    badge: "bg-slate-900 text-white",
    btn: "bg-slate-900 hover:bg-black border-2 border-slate-900",
    accent: "text-slate-900",
  },
};

function TierCard({ tier, pkg, addons, isBuying, onBuy, onPurchased }) {
  const style = TIER_STYLE[tier.tier] || TIER_STYLE.recommended;

  if (!pkg) return null;

  return (
    <div className={`bg-white border-2 ${style.border} ${tier.tier === 'popular' ? 'shadow-lg' : ''}`}>
      <div className={`${style.badge} text-[10px] font-black px-3 py-2 uppercase tracking-[2px] text-center`}>
        {tier.label}
      </div>

      <div className="p-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-1">
              {pkg.cat === "monthly" ? "Pachet lunar" : "O singură comandă"}
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{pkg.name}</h3>
            {tier.reasoning && (
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{tier.reasoning}</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              {(tier.benefits?.length > 0 ? tier.benefits : pkg.inc.slice(0, 4).map(x => x.w)).map((b, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-4 h-4 bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-check text-[8px]"></i>
                  </div>
                  <span className="text-xs text-slate-700 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>

            {tier.addons?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-0">
                {tier.addons.map(aId => {
                  const addon = addons.find(a => a.id === aId);
                  if (!addon) return null;
                  return (
                    <span key={aId} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 text-[10px] font-bold text-blue-700">
                      <i className={`fas ${addon.icon} text-[8px]`}></i>
                      {addon.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 sm:text-right sm:min-w-[180px] mt-4 sm:mt-0">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {pkg.price.toLocaleString("ro")} <span className="text-sm font-bold text-slate-500">lei{pkg.cat === "monthly" ? "/lună" : ""}</span>
            </div>
            {pkg.sub && pkg.subType !== 'annual' && (
              <div className="mt-1">
                <span className="text-sm font-black text-green-600">{pkg.sub.toLocaleString("ro")} lei/lună</span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider ml-1">la abonament</span>
              </div>
            )}
            {pkg.sub && pkg.subType === 'annual' && (
              <div className="mt-1 text-[11px] font-black text-green-600">
                <i className="fas fa-calendar-check mr-0.5"></i> {pkg.sub.toLocaleString("ro")} lei/an — max {pkg.subMaxEvents || 5} ev.
              </div>
            )}
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">+ TVA</div>

            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-2 sm:justify-end">
              <i className="fas fa-truck-fast text-slate-300"></i>{pkg.delivery}
            </div>

            {!isBuying && (
              <button
                onClick={() => onBuy(tier)}
                className={`w-full sm:w-auto mt-3 ${style.btn} text-white font-bold px-6 py-3 text-xs uppercase tracking-wider transition-all`}
              >
                Comandă <i className="fas fa-arrow-right ml-1.5"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {isBuying && (
        <PurchaseForm
          pkg={pkg}
          suggestedAddons={tier.addons || []}
          onClose={() => onBuy(null)}
          onDone={onPurchased}
        />
      )}
    </div>
  );
}

export default function RecommendView({ recommendation, onCatalog, onPurchased, onBack }) {
  const { packages, addons } = useConfig();
  const [buying, setBuying] = useState(null);

  const tiers = recommendation?.tiers || [];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 animate-fadeIn">
      <button onClick={onBack} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[2px] mb-6 transition-colors">
        <i className="fas fa-arrow-left mr-1"></i> Înapoi la întrebări
      </button>

      {recommendation?.summary && (
        <div className="bg-blue-50 border-2 border-blue-200 p-5 mb-8 flex gap-4">
          <div className="w-9 h-9 bg-cta text-white flex items-center justify-center flex-shrink-0">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 mb-1">Am pregătit {tiers.length} opțiuni pentru tine.</div>
            <p className="text-xs text-slate-600 leading-relaxed">{recommendation.summary}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tiers.map(tier => {
          const pkg = packages.find(p => p.id === tier.id);
          return (
            <TierCard
              key={tier.id + tier.tier}
              tier={tier}
              pkg={pkg}
              addons={addons}
              isBuying={buying === tier.id}
              onBuy={(t) => {
                if (t) setBuying(tier.id);
                else setBuying(null);
              }}
              onPurchased={(order) => {
                if (order?.id) onPurchased(order);
                else setBuying(null);
              }}
            />
          );
        })}
      </div>

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
