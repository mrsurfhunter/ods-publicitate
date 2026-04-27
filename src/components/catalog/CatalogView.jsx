import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import PurchaseForm from "../purchase/PurchaseForm";
import LeadCaptureStep from "../auth/LeadCaptureStep";

function CatalogCard({ pkg, onPurchased }) {
  const [buying, setBuying] = useState(false);

  return (
    <div className={`bg-white border-2 ${pkg.pop ? 'border-brand' : 'border-slate-200'} relative`}>
      {pkg.pop && (
        <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-[2px]">
          ★ Cel mai popular
        </div>
      )}
      <div className="p-5 sm:p-6 md:p-7">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-2">
          {pkg.cat === 'monthly' ? 'Pachet lunar' : 'O singură comandă'}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">{pkg.name}</h3>
        <p className="text-sm text-slate-500 mb-5">{pkg.headline}</p>
        <div className="flex items-baseline gap-2 mb-5">
          {pkg.sub && <span className="text-base text-slate-400 line-through font-bold">{pkg.price.toLocaleString("ro")}</span>}
          <span className="text-3xl font-black text-slate-900">{(pkg.sub || pkg.price).toLocaleString("ro")} lei</span>
          <span className="text-sm font-bold text-slate-500">{pkg.cat === 'monthly' ? '/lună' : ''}</span>
        </div>
        {pkg.sub && <div className="text-[10px] font-black text-brand uppercase tracking-wider mb-4">Reducere abonament</div>}
        <div className="space-y-2 mb-5 border-t-2 border-slate-100 pt-4">
          {pkg.inc.slice(0, 4).map((row, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
              <span className="text-slate-700"><strong>{row.w}</strong>{row.d && <span className="text-slate-400"> · {row.d}</span>}</span>
            </div>
          ))}
          {pkg.inc.length > 4 && <div className="text-xs font-bold text-slate-400 pl-5">+ {pkg.inc.length - 4} alte beneficii</div>}
        </div>
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <i className="fas fa-truck-fast text-slate-300"></i> {pkg.delivery}
        </div>
        {!buying ? (
          <button
            className={`w-full ${pkg.pop ? 'bg-brand hover:bg-brand-dark border-2 border-brand' : 'bg-slate-900 hover:bg-black border-2 border-slate-900'} text-white font-bold px-6 py-3 text-sm uppercase tracking-wider transition-all`}
            onClick={() => setBuying(true)}
          >
            Comandă <i className="fas fa-arrow-right ml-2"></i>
          </button>
        ) : (
          <PurchaseForm pkg={pkg} onClose={() => setBuying(false)} onDone={onPurchased} />
        )}
      </div>
    </div>
  );
}

function AddonCard({ addon }) {
  return (
    <div className="bg-white border-2 border-slate-200 p-5 sm:p-6">
      <div className="w-10 h-10 bg-navy text-white flex items-center justify-center mb-4">
        <i className={`fas ${addon.icon}`}></i>
      </div>
      <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">{addon.name}</h3>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{addon.desc}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-slate-900">{addon.price.toLocaleString("ro")}</span>
        <span className="text-sm font-bold text-slate-500">lei{addon.unit}</span>
      </div>
      {addon.qtyPricing && (
        <div className="text-[10px] font-bold text-green-600 mt-1">
          De la {addon.qtyPricing[addon.qtyPricing.length - 1].price.toLocaleString("ro")} lei la {addon.qtyPricing[addon.qtyPricing.length - 1].min}+ buc
        </div>
      )}
      {addon.sub && (
        <div className="text-[10px] font-bold text-brand mt-1">{addon.sub.toLocaleString("ro")} lei la abonament</div>
      )}
      <div className="mt-4 text-[10px] text-slate-400 font-medium">
        <i className="fas fa-info-circle mr-1"></i> Se adaugă la orice pachet în momentul comenzii
      </div>
    </div>
  );
}

export default function CatalogView({ onConsult, onPurchased }) {
  const { isAuthenticated } = useAuth();
  const { packages, addons } = useConfig();
  const [filter, setFilter] = useState('all');

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-3">Catalog complet</div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">Alege pachetul potrivit pentru afacerea ta</h2>
          <p className="text-slate-500 text-sm">Creează un cont gratuit pentru a vedea detaliile complete și a comanda.</p>
        </div>
        <LeadCaptureStep source="catalog" />
        <div className="text-center mt-6">
          <button className="text-slate-400 text-sm font-semibold hover:text-navy transition-colors" onClick={onConsult}>
            ← Nu știi ce să alegi? Lasă-ne să îți recomandăm
          </button>
        </div>
      </div>
    );
  }

  const hasOneTime = packages.some(p => p.cat === 'oneTime');
  const hasMonthly = packages.some(p => p.cat === 'monthly');
  const activeAddons = addons.filter(a => a.active !== false);

  const tabs = [{ id: 'all', l: 'Toate' }];
  if (hasOneTime) tabs.push({ id: 'oneTime', l: 'O singură comandă' });
  if (hasMonthly) tabs.push({ id: 'monthly', l: 'Pachete lunare' });
  if (activeAddons.length > 0) tabs.push({ id: 'addons', l: 'Add-ons' });

  const filtered = filter === 'all' ? packages : filter === 'addons' ? [] : packages.filter(p => p.cat === filter);

  return (
    <div className="animate-fadeIn">
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-3">Catalog complet</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Toate pachetele de publicitate</h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl">
            De la o postare pe Facebook până la Enterprise. Alege singur sau{' '}
            <button className="font-bold text-slate-900 underline" onClick={onConsult}>treci prin consultare</button>.
          </p>
          <div className="flex gap-2 mt-6 sm:mt-8 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                  filter === t.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900'
                }`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filter === 'addons' ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {activeAddons.map(a => (
            <AddonCard key={a.id} addon={a} />
          ))}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid lg:grid-cols-2 gap-4 sm:gap-5">
          {filtered.map(p => (
            <CatalogCard key={p.id} pkg={p} onPurchased={onPurchased} />
          ))}
        </div>
      )}
    </div>
  );
}
