import { useState } from "react";
import { PKG } from "../../data/packages";
import PurchaseForm from "../purchase/PurchaseForm";

function PackageCard({ pkg, benefits, isPrimary, onBuy, isBuying }) {
  return (
    <div className={`bg-white border-2 ${isPrimary ? 'border-brand' : 'border-slate-200'} relative`}>
      {isPrimary && (
        <div className="absolute -top-3 left-6 bg-brand text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-[2px]">
          Recomandat pentru tine
        </div>
      )}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-2">
              {pkg.cat === 'monthly' ? 'Pachet lunar' : 'O singură comandă'}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">{pkg.name}</h3>
            <p className="text-sm text-slate-500">{pkg.headline}</p>
          </div>
          <div className="md:text-right flex-shrink-0">
            {pkg.sub && <div className="text-sm text-slate-400 line-through font-bold">{pkg.price.toLocaleString("ro")} lei</div>}
            <div className="text-3xl md:text-4xl font-black text-slate-900">
              {(pkg.sub || pkg.price).toLocaleString("ro")} <span className="text-sm font-bold text-slate-500">lei{pkg.cat === 'monthly' ? '/lună' : ''}</span>
            </div>
            {pkg.sub && <div className="text-[10px] font-black text-brand uppercase tracking-wider mt-1">Reducere abonament</div>}
            <div className="text-[10px] text-slate-400 font-medium">+ TVA</div>
          </div>
        </div>
        <div className="space-y-3 mb-6 border-t-2 border-slate-100 pt-6">
          {(benefits && benefits.length > 0 ? benefits : pkg.inc.map(x => x.w + (x.d ? " — " + x.d : ""))).map((b, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-check text-[10px]"></i>
              </div>
              <span className="text-sm text-slate-700">{b}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t-2 border-slate-100 pt-6">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <i className="fas fa-truck-fast text-slate-300"></i>{pkg.delivery}
          </div>
          {!isBuying && (
            <button onClick={onBuy} className={`${isPrimary ? 'bg-brand hover:bg-brand-dark border-2 border-brand' : 'bg-slate-900 hover:bg-black border-2 border-slate-900'} text-white font-bold px-6 py-3 text-sm uppercase tracking-wider`}>
              Cumpără <i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>
      </div>
      {isBuying && <PurchaseForm pkg={pkg} onClose={() => onBuy()} onDone={onBuy} />}
    </div>
  );
}

export default function RecommendView({ recommendation, onCatalog, onPurchased, onBack }) {
  const [buying, setBuying] = useState(null);

  const primaryPkg = PKG.find(p => p.id === recommendation.primary);
  const secondaryPkg = recommendation.secondary ? PKG.find(p => p.id === recommendation.secondary) : null;
  const altPkgs = secondaryPkg ? [secondaryPkg] : PKG.filter(p => p.id !== recommendation.primary && p.cat === 'monthly').slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-14 animate-fadeIn">
      <button onClick={onBack} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[2px] mb-6 transition-colors">
        <i className="fas fa-arrow-left mr-1"></i> Înapoi la întrebări
      </button>

      <div className="bg-blue-50 border-2 border-blue-200 p-5 mb-8 flex gap-4">
        <div className="w-9 h-9 bg-cta text-white flex items-center justify-center flex-shrink-0">
          <i className="fas fa-lightbulb"></i>
        </div>
        <div>
          <div className="text-sm font-black text-slate-900 mb-1">Am pregătit recomandarea ta.</div>
          <p className="text-xs text-slate-600 leading-relaxed">{recommendation.reasoning}</p>
        </div>
      </div>

      <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-4">Recomandare principală</div>
      {primaryPkg && (
        <PackageCard
          pkg={primaryPkg}
          benefits={recommendation.primaryBenefits}
          isPrimary={true}
          isBuying={buying === primaryPkg.id}
          onBuy={(order) => {
            if (order && order.id) { onPurchased(order); }
            else { setBuying(buying === primaryPkg.id ? null : primaryPkg.id); }
          }}
        />
      )}

      {altPkgs.length > 0 && (
        <>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mt-10 sm:mt-12 mb-4">Sau alege alt pachet</div>
          <div className="grid md:grid-cols-2 gap-4">
            {altPkgs.map(p => (
              <PackageCard
                key={p.id}
                pkg={p}
                benefits={p.id === recommendation.secondary ? recommendation.secondaryBenefits : []}
                isPrimary={false}
                isBuying={buying === p.id}
                onBuy={(order) => {
                  if (order && order.id) { onPurchased(order); }
                  else { setBuying(buying === p.id ? null : p.id); }
                }}
              />
            ))}
          </div>
        </>
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
