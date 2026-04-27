import { useState } from "react";

const AD_TYPES = [
  { id: "facebook", l: "Postare Facebook", icon: "fa-thumbs-up", desc: "2-4 propoziții + CTA" },
  { id: "instagram", l: "Caption Instagram", icon: "fa-camera-retro", desc: "Text + 15-20 hashtag-uri" },
  { id: "story", l: "Text Story", icon: "fa-mobile-screen", desc: "Max 2 rânduri, impact" },
  { id: "article-title", l: "Titlu Articol", icon: "fa-heading", desc: "SEO, 5-8 cuvinte" },
  { id: "article-intro", l: "Intro Articol", icon: "fa-paragraph", desc: "3-4 propoziții SEO" },
  { id: "google-ad", l: "Google Ads", icon: "fa-magnifying-glass-dollar", desc: "Headline + Description" },
  { id: "promo-sms", l: "SMS Promo", icon: "fa-comment-sms", desc: "Max 160 caractere" },
];

const TONES = [
  { id: "professional", l: "Profesional", icon: "fa-briefcase" },
  { id: "friendly", l: "Prietenos", icon: "fa-face-smile" },
  { id: "urgent", l: "Urgent / FOMO", icon: "fa-clock" },
  { id: "playful", l: "Jucăuș", icon: "fa-face-laugh" },
  { id: "luxury", l: "Premium", icon: "fa-gem" },
  { id: "local", l: "Local / Sibiu", icon: "fa-map-pin" },
];

export default function AdCopyWriter({ businessName: initBiz }) {
  const [form, setForm] = useState({
    businessName: initBiz || "",
    industry: "",
    offer: "",
    tone: "professional",
    type: "facebook",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

  const upd = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const generate = async () => {
    if (!form.businessName.trim()) return;
    setLoading(true);
    setError(null);
    setVariants([]);
    setCopied(null);
    try {
      const r = await fetch("/api/ads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Eroare");
      setVariants(data.variants || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const selectedType = AD_TYPES.find(t => t.id === form.type);

  return (
    <div className="bg-white border-2 border-slate-200">
      <div className="p-4 sm:p-6 border-b-2 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-pen-fancy text-lg"></i>
          </div>
          <div>
            <h3 className="font-black text-slate-900">Scriitor Anunțuri AI</h3>
            <p className="text-xs text-slate-500">Generează texte pentru social media, articole și ads — 3 variante</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* AD TYPE */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tip anunț</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AD_TYPES.map(t => (
              <button key={t.id} onClick={() => upd("type", t.id)}
                className={`p-3 text-left border-2 transition-all ${
                  form.type === t.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                }`}>
                <i className={`fas ${t.icon} text-sm mb-1`}></i>
                <div className="text-xs font-bold">{t.l}</div>
                <div className={`text-[10px] ${form.type === t.id ? 'text-blue-100' : 'text-slate-400'}`}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Numele afacerii *</label>
            <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm font-bold"
              value={form.businessName} onChange={e => upd("businessName", e.target.value)}
              placeholder="Restaurant La Cuptor" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Industrie / Domeniu</label>
            <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm"
              value={form.industry} onChange={e => upd("industry", e.target.value)}
              placeholder="Restaurant, Salon, IT, Imobiliare..." />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ce promovezi / Oferta</label>
          <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm"
            value={form.offer} onChange={e => upd("offer", e.target.value)}
            placeholder="Meniu nou de primăvară, deschidere, reducere 30%, eveniment..." />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Detalii suplimentare (opțional)</label>
          <textarea className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm resize-none"
            rows={2} value={form.details} onChange={e => upd("details", e.target.value)}
            placeholder="Adresa, program, preț, număr telefon, orice vrei menționat..." />
        </div>

        {/* TONE */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ton</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t.id} onClick={() => upd("tone", t.id)}
                className={`px-3 py-2 text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                  form.tone === t.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400'
                }`}>
                <i className={`fas ${t.icon} text-[10px]`}></i> {t.l}
              </button>
            ))}
          </div>
        </div>

        {/* GENERATE */}
        <button onClick={generate} disabled={loading || !form.businessName.trim()}
          className="w-full py-4 bg-blue-600 text-white font-black text-sm uppercase tracking-widest border-2 border-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <><i className="fas fa-spinner animate-spin mr-2"></i>Se scrie...</>
          ) : (
            <><i className="fas fa-pen-fancy mr-2"></i>Scrie 3 variante — {selectedType?.l}</>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            <i className="fas fa-exclamation-triangle mr-1"></i> {error}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {variants.length > 0 && (
        <div className="border-t-2 border-slate-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-900">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              {variants.length} variante generate
            </h4>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              <i className="fas fa-bolt mr-1"></i>GPT-4o-mini
            </span>
          </div>
          <div className="space-y-3">
            {variants.map((text, i) => (
              <div key={i} className="border-2 border-slate-200 hover:border-blue-400 transition-all">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Varianta {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{text.length} car.</span>
                    <button onClick={() => copyText(text, i)}
                      className={`px-3 py-1 text-[11px] font-bold border transition-all ${
                        copied === i
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                      }`}>
                      {copied === i ? (
                        <><i className="fas fa-check mr-1"></i>Copiat!</>
                      ) : (
                        <><i className="far fa-copy mr-1"></i>Copiază</>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{text}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={generate} disabled={loading}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest border-2 border-slate-200 hover:bg-slate-200 transition-all disabled:opacity-50">
              <i className="fas fa-redo mr-1"></i> Regenerează
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Cost: ~0.005 lei / generare. Poți regenera de câte ori vrei.
          </p>
        </div>
      )}
    </div>
  );
}
