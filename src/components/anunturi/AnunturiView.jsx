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
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Publică un Anunț</h2>
        <p className="text-slate-500 mt-2 font-medium">Publică anunțuri pe oradesibiu.ro — avize, pierderi, decese, autorizații</p>
        <p className="mt-2">
          <span className="text-lg font-black text-[#e30613]">de la 50 lei / zi</span>
          <span className="text-xs text-slate-400 ml-2">până la 250 cuvinte</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category */}
          <section className="bg-white p-6 md:p-8 border-2 border-slate-200">
            <h3 className="text-sm font-black text-slate-800 uppercase mb-4">1. Tipul anunțului</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AD_CAT.map(c => (
                <button key={c.id} className={`p-4 border-2 text-left transition-all ${
                  cat === c.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-blue-300'
                }`} onClick={() => setCat(c.id)}>
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div className={`text-xs font-bold ${cat === c.id ? 'text-blue-700' : 'text-slate-500'}`}>{c.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Text */}
          <section className="bg-white p-6 md:p-8 border-2 border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase">2. Text Anunț</h3>
              <span className={`text-xs font-bold px-4 py-1.5 ${
                words > 1200 ? 'bg-red-50 text-red-600' : words > 250 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
              }`}>{words} cuvinte</span>
            </div>
            <textarea
              className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-100 outline-none focus:border-red-200 transition-all resize-none text-sm leading-relaxed"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Scrieți sau copiați aici textul anunțului (ex: licitație, mediu, angajare, deces)..."
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all disabled:opacity-50"
                onClick={enhance}
                disabled={ai || !text.trim() || words < 5}
              >
                {ai ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-wand-magic-sparkles"></i> Îmbunătățește cu AI</>}
              </button>
              {aiOk === true && <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><i className="fas fa-check"></i> Îmbunătățit!</span>}
              {aiOk === false && <span className="text-xs text-red-500">AI indisponibil</span>}
            </div>
          </section>

          {/* Duration */}
          <section className="bg-white p-6 md:p-8 border-2 border-slate-200">
            <h3 className="text-sm font-black text-slate-800 uppercase mb-4">3. Durata</h3>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 7, 14, 30].map(d => (
                <button key={d} className={`px-5 py-2.5 text-sm font-bold border-2 transition-all ${
                  days === d ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-500 hover:border-blue-300'
                }`} onClick={() => setDays(d)}>
                  {d} {d === 1 ? "zi" : "zile"}
                </button>
              ))}
              <input
                type="number"
                className="w-20 p-2.5 bg-slate-50 border-2 border-slate-200 outline-none focus:border-blue-300 text-center text-sm font-bold"
                min={1} max={90} value={days}
                onChange={e => setDays(Math.max(1, Math.min(90, Number(e.target.value))))}
              />
            </div>
            {pr.disc > 0 && <p className="text-xs text-green-600 font-bold mt-2">Discount {Math.round(pr.disc * 100)}%</p>}
          </section>
        </div>

        {/* Right: sticky summary */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-6 lg:p-8 border-2 border-slate-700 lg:sticky lg:top-24">
            <h4 className="text-[10px] font-black text-[#e30613] uppercase tracking-widest mb-5">Sumar Comandă</h4>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Preț de bază / zi</span>
                <span className="font-bold">{pr.p} lei</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Durata</span>
                <span className="font-bold">{days} {days === 1 ? "zi" : "zile"}</span>
              </div>
              {pr.disc > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Discount</span>
                  <span className="font-bold text-green-400">-{Math.round(pr.disc * 100)}%</span>
                </div>
              )}
              <div className="text-[10px] text-slate-600 italic border-t border-slate-800 pt-3">
                * Până la 250 cuv: 50 lei/zi. Se aplică discount la durate mai lungi.
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5 mb-6">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total (+TVA)</div>
              <div className="text-4xl font-black">{pr.total.toLocaleString("ro")} <span className="text-xs font-normal">lei</span></div>
              <div className="text-[10px] text-slate-500 mt-1">= {Math.round(pr.total * 1.19).toLocaleString("ro")} lei cu TVA</div>
            </div>

            <button
              className="w-full py-5 bg-[#e30613] hover:bg-red-700 text-white font-black border-2 border-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              disabled={!canOrd}
              onClick={() => setAdCheckout({ cat: AD_CAT.find(c => c.id === cat), text, words, days, pr })}
            >
              <i className="fas fa-credit-card"></i> Plasează anunțul
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-3 uppercase tracking-widest font-bold">Plată securizată</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
        <button className="text-slate-400 text-sm font-semibold hover:text-slate-700 transition-colors flex items-center gap-2" onClick={onBack}>
          <i className="fas fa-arrow-left text-xs"></i> Pagina principală
        </button>
        {onConsult && (
          <div className="bg-[#e30613] text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left border-2 border-red-700">
            <span className="text-sm font-semibold">Ai și o afacere? Descoperă pachetele de promovare!</span>
            <button className="w-full sm:w-auto px-5 py-2.5 bg-white text-red-700 text-xs font-black hover:bg-slate-100 transition-all whitespace-nowrap border-2 border-white" onClick={onConsult}>
              Începe consultarea
            </button>
          </div>
        )}
      </div>

      {adCheckout && <AdCheckout ad={adCheckout} onClose={() => setAdCheckout(null)} />}
    </div>
  );
}
