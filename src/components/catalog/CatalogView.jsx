import { useState } from "react";
import { PKG } from "../../data/packages";
import { useAuth } from "../../context/AuthContext";
import PurchaseForm from "../purchase/PurchaseForm";
import LeadCaptureStep from "../auth/LeadCaptureStep";

function CatalogCard({ pkg, onPurchased, featured }) {
  const [buying, setBuying] = useState(false);

  return (
    <div className={`bg-white rounded-3xl overflow-hidden transition-all hover:shadow-lg ${
      featured ? 'border-2 border-[#e30613] shadow-xl shadow-red-500/10' : 'border border-slate-200 shadow-sm'
    }`}>
      {featured && (
        <div className="bg-[#e30613] text-white text-[10px] font-black text-center py-2 uppercase tracking-[2px]">
          Cel mai popular
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{pkg.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{pkg.headline}</p>
          </div>
          <div className="sm:text-right flex-shrink-0">
            <div className="text-3xl font-black text-slate-900 leading-none">
              {pkg.price.toLocaleString("ro")} <span className="text-base font-semibold text-slate-400">lei</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {pkg.cat !== "oneTime" ? "/ lună + TVA" : "+ TVA (o dată)"}
            </div>
            {pkg.sub && <div className="text-xs text-green-600 font-bold mt-1">{pkg.sub.toLocaleString("ro")} lei la abonament</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {pkg.inc.map((x, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <i className="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"></i>
              <div>
                <span className="font-semibold text-slate-800">{x.w}</span>
                {x.d && <span className="text-slate-400"> — {x.d}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`px-6 md:px-8 py-5 border-t ${featured ? 'bg-red-50/30 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
        <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
          <i className="far fa-calendar text-[10px]"></i> {pkg.delivery}
        </div>
        {!buying ? (
          <button
            className={`w-full py-4 font-black uppercase text-xs tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              featured ? 'bg-[#e30613] text-white shadow-red-500/20 hover:bg-red-700' : 'bg-navy text-white shadow-navy/20 hover:bg-navy-dark'
            }`}
            onClick={() => setBuying(true)}
          >
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
      <div className="max-w-xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-3">Pachete de promovare</div>
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-3">Pachete de promovare</div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">Alege pachetul potrivit</h2>
        <p className="text-slate-500 text-sm mb-4">Toate pachetele includ publicare pe oradesibiu.ro — cea mai citită publicație din Sibiu.</p>
        <button className="px-6 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:border-navy hover:text-navy transition-all" onClick={onConsult}>
          Nu știi ce să alegi? Lasă-ne să te ajutăm →
        </button>
      </div>
      <div className="space-y-5">
        {PKG.map(p => (
          <CatalogCard key={p.id} pkg={p} onPurchased={onPurchased} featured={p.pop} />
        ))}
      </div>
    </div>
  );
}
