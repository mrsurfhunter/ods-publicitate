import { useState } from "react";
import { PKG } from "../../data/packages";
import PurchaseForm from "../purchase/PurchaseForm";

export default function RecommendView({ recommendation, onCatalog, onPurchased, onBack }) {
  const [buying, setBuying] = useState(null);

  const primaryPkg = PKG.find(p => p.id === recommendation.primary);
  const secondaryPkg = recommendation.secondary ? PKG.find(p => p.id === recommendation.secondary) : null;

  const renderCard = (pkg, benefits, isPrimary) => {
    const isBuying = buying === pkg.id;
    return (
      <div className={`bg-white rounded-3xl overflow-hidden mb-5 transition-all animate-fadeIn ${
        isPrimary ? 'border-2 border-[#e30613] shadow-xl shadow-red-500/10' : 'border border-slate-200 shadow-sm'
      }`}>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white mb-3 ${
                isPrimary ? 'bg-[#e30613]' : 'bg-navy'
              }`}>
                {isPrimary ? 'Recomandat' : 'Alternativă'}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{pkg.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{pkg.headline}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
                <span className="text-slate-700">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`px-6 md:px-8 py-5 flex items-center justify-between flex-wrap gap-4 ${
          isPrimary ? 'bg-red-50/50 border-t border-red-100' : 'bg-slate-50 border-t border-slate-100'
        }`}>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {pkg.price.toLocaleString("ro")} <span className="text-sm font-medium text-slate-400">lei{pkg.cat !== "oneTime" ? "/lună" : ""}</span>
            </div>
            {pkg.sub && <div className="text-xs text-green-600 font-bold">{pkg.sub.toLocaleString("ro")} lei/lună la abonament</div>}
            <div className="text-[10px] text-slate-400 font-medium">+ TVA</div>
          </div>
          {!isBuying && (
            <button className="px-8 py-3.5 bg-[#e30613] text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95" onClick={() => setBuying(pkg.id)}>
              Alege acest pachet
            </button>
          )}
        </div>

        {isBuying && <PurchaseForm pkg={pkg} onClose={() => setBuying(null)} onDone={onPurchased} />}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl p-5 mb-8 text-sm text-slate-700 leading-relaxed font-medium">
        {recommendation.reasoning}
      </div>
      {primaryPkg && renderCard(primaryPkg, recommendation.primaryBenefits || [], true)}
      {secondaryPkg && renderCard(secondaryPkg, recommendation.secondaryBenefits || [], false)}
      <div className="text-center mt-8 space-y-3">
        <button className="text-slate-500 text-sm font-semibold hover:text-navy transition-colors" onClick={onCatalog}>
          Nu mă regăsesc? Vezi toate pachetele →
        </button>
        <div>
          <a href="https://wa.me/40746752240?text=Salut, aș vrea să discut despre promovare pe oradesibiu.ro" target="_blank" rel="noopener" className="text-green-600 text-sm font-semibold hover:underline">
            Vorbește cu noi pe WhatsApp
          </a>
        </div>
        <button className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors" onClick={onBack}>
          ← Reia consultarea
        </button>
      </div>
    </div>
  );
}
