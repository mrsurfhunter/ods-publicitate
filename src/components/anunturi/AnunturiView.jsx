import { useState } from "react";
import { AD_CAT } from "../../data/packages";
import { callAI } from "../../utils/ai";
import { calcAd } from "../../utils/pricing";
import AdCheckout from "./AdCheckout";

export default function AnunturiView({ onBack, onConsult }) {
  const [cat, setCat] = useState("");
  const [text, setText] = useState("");
  const [days, setDays] = useState(1);
  const [ai, setAi] = useState(false);
  const [aiOk, setAiOk] = useState(null);
  const [adCheckout, setAdCheckout] = useState(null);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const pr = calcAd(words, days);
  const canOrd = cat && words >= 3 && words <= 1200;

  const enhance = async () => {
    if (!text.trim() || !cat) return;
    setAi(true); setAiOk(null);
    const r = await callAI(
      "Ești redactor oradesibiu.ro. Îmbunătățește anunțul. Corectează greșeli. NU inventa. DOAR textul. Română.",
      "Tip: " + (AD_CAT.find(c => c.id === cat)?.label || "") + "\n\n" + text
    );
    setAi(false);
    if (r) { setText(r); setAiOk(true); } else setAiOk(false);
  };

  return (
    <div className="animate-fadeIn">
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={onBack} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[2px] mb-3 transition-colors">
            <i className="fas fa-arrow-left mr-1"></i> Acasă
          </button>
          <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-2">Mică publicitate</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Comandă anunț online</h1>
          <p className="text-slate-500 mt-2">Anunțul tău publicat pe oradesibiu.ro în max 2h. De la 50 lei / zi.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Category */}
          <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">1 · Categorie</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {AD_CAT.map(c => (
                <button key={c.id} className={`p-4 border-2 text-left transition-all ${
                  cat === c.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-400'
                }`} onClick={() => setCat(c.id)}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className={`text-sm font-bold ${cat === c.id ? 'text-slate-900' : 'text-slate-700'}`}>{c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
            <div className="flex justify-between items-end mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">2 · Conținut anunț</div>
              <span className={`text-[11px] font-bold px-3 py-1 ${
                words > 1200 ? 'bg-red-50 text-red-600' : words > 250 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
              }`}>{words} cuvinte</span>
            </div>
            <textarea
              className="w-full h-48 p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 outline-none focus:border-slate-900 transition-all resize-none text-sm leading-relaxed"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Scrieți sau copiați aici textul anunțului (ex: licitație, mediu, angajare, deces)..."
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all disabled:opacity-50 border-2 border-slate-900"
                onClick={enhance}
                disabled={ai || !text.trim() || words < 5}
              >
                {ai ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-pen-to-square"></i> Corectează textul</>}
              </button>
              {aiOk === true && <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><i className="fas fa-check"></i> Îmbunătățit!</span>}
              {aiOk === false && <span className="text-xs text-red-500">AI indisponibil</span>}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">3 · Durata</div>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 7, 14, 30].map(d => (
                <button key={d} className={`px-5 py-2.5 text-sm font-bold border-2 transition-all ${
                  days === d ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'
                }`} onClick={() => setDays(d)}>
                  {d} {d === 1 ? "zi" : "zile"}
                </button>
              ))}
              <input
                type="number"
                className="w-20 p-2.5 bg-slate-50 border-2 border-slate-200 outline-none focus:border-slate-900 text-center text-sm font-bold"
                min={1} max={90} value={days}
                onChange={e => setDays(Math.max(1, Math.min(90, Number(e.target.value))))}
              />
            </div>
            {pr.disc > 0 && <p className="text-xs text-green-600 font-bold mt-2">Discount {Math.round(pr.disc * 100)}%</p>}
          </div>
        </div>

        {/* Right: sticky summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-4 sm:p-6 sticky top-20">
            <div className="text-[11px] font-bold text-white/50 uppercase tracking-[2px] mb-4">Comandă</div>

            <div className="space-y-3 mb-5 pb-5 border-b border-white/10">
              {cat && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Categorie</span>
                  <span className="font-bold">{AD_CAT.find(c => c.id === cat)?.label}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Preț de bază / zi</span>
                <span className="font-bold">{pr.p} lei</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Durata</span>
                <span className="font-bold">{days} {days === 1 ? "zi" : "zile"}</span>
              </div>
              {pr.disc > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Discount</span>
                  <span className="font-bold text-green-400">-{Math.round(pr.disc * 100)}%</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline mb-5">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-[2px]">Total</span>
              <span className="text-3xl font-black">{pr.total.toLocaleString("ro")} <span className="text-sm">lei</span></span>
            </div>
            <div className="text-[10px] text-white/40 mb-4">= {Math.round(pr.total * 1.19).toLocaleString("ro")} lei cu TVA</div>

            <button
              className="w-full py-4 bg-brand hover:bg-brand-dark text-white font-black border-2 border-brand transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm uppercase tracking-wider"
              disabled={!canOrd}
              onClick={() => setAdCheckout({ cat: AD_CAT.find(c => c.id === cat), text, words, days, pr })}
            >
              Plasează anunțul <i className="fas fa-arrow-right ml-1"></i>
            </button>
            <div className="text-[11px] text-white/40 text-center mt-3">Card · OP · Apple/Google Pay</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-8">
        {onConsult && (
          <div className="bg-slate-900 text-white p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <div className="flex-1">
              <div className="text-[11px] font-bold text-white/50 uppercase tracking-[2px] mb-2">Ai și o afacere?</div>
              <span className="text-sm font-bold">Descoperă pachetele de promovare — articole, bannere, social media.</span>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 bg-brand text-white text-xs font-black hover:bg-brand-dark transition-all whitespace-nowrap border-2 border-brand uppercase tracking-wider" onClick={onConsult}>
              Începe consultarea <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        )}
      </div>

      {adCheckout && <AdCheckout ad={adCheckout} onClose={() => setAdCheckout(null)} />}
    </div>
  );
}
