import { useState, useEffect } from "react";
import { fetchSocialStats, formatCount } from "../../utils/social";

const STATIC_STATS = [
  { v: "1.5M", l: "Afișări/lună pe site" },
];

const BENEFITS = [
  { i: "fa-bolt", t: "Setup rapid", d: "Activ în 24-48h. Nu pierzi timp cu agenții, briefuri, propuneri." },
  { i: "fa-eye", t: "Audiență reală", d: "1.5M afișări/lună, 260k+ urmăritori. Date BRAT, nu marketing." },
  { i: "fa-chart-line", t: "Statistici clare", d: "Reach, click-uri, engagement. Vezi exact ce primești pentru bani." },
  { i: "fa-headset", t: "Consultanță inclusă", d: "Te ajutăm să alegi pachetul potrivit. Fără presiune, fără upselling." },
];

const STEPS = [
  { n: 1, t: "Răspunzi 5 întrebări", d: "Tipul afacerii, obiectivul, bugetul, materialele, durata. Durează 2 minute." },
  { n: 2, t: "Primești 4 opțiuni personalizate", d: "Ancorate pe bugetul tău: una sub buget, una pe buget, una peste, una premium." },
  { n: 3, t: "Plătești și pornești", d: "Card sau OP. Adaugi extra la comandă. Primești totul în max 5 zile." },
];

export default function LandingView({ onConsult, onAnunturi, onCatalog }) {
  const [social, setSocial] = useState(null);
  useEffect(() => { fetchSocialStats().then(setSocial); }, []);

  const stats = [
    ...STATIC_STATS,
    { v: social ? formatCount(social.facebook.followers) : "220.000", l: "Urmăritori Facebook" },
    { v: social ? formatCount(social.instagram.followers) : "18.609", l: "Followers Instagram" },
    { v: social ? formatCount(social.tiktok.followers) : "25.000", l: "Urmăritori TikTok" },
  ];

  return (
    <div className="animate-fadeIn">
      {/* HERO */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-[0.04]"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand/20 blur-3xl"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-12 sm:pt-16 md:pt-24 pb-12 md:pb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[2px]">Cea mai citită publicație din Sibiu</span>
          </div>
          <h1 className="text-[34px] sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
            Promovează-ți afacerea<br />
            <span className="text-brand">unde sibienii urmăresc știrile.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
            Articole, bannere, postări pe Facebook & Instagram. <strong className="text-white">1.5 milioane de afișări lunare.</strong> Te ajutăm să alegi pachetul potrivit în 2 minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-12 sm:mb-16">
            <button onClick={onConsult} className="group bg-brand hover:bg-brand-dark text-white font-bold px-7 py-4 text-sm uppercase tracking-wider transition-all border-2 border-brand">
              Începe Consultarea <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button onClick={onCatalog} className="border-2 border-white/30 hover:border-white text-white font-bold px-7 py-4 text-sm uppercase tracking-wider transition-all">
              Vezi toate pachetele
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {stats.map((s, i) => (
              <div key={i} className="bg-navy p-4 sm:p-5">
                <div className="text-2xl sm:text-3xl font-black mb-1">{s.v}</div>
                <div className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-wider font-bold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-slate-50 border-y-2 border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="text-sm sm:text-base font-bold text-slate-500">Peste <strong className="text-slate-700">1.000</strong> de afaceri au ales Ora de Sibiu pentru promovare prin</span>
          <a href="https://oradesibiu.ro/advertorial" target="_blank" rel="noopener" className="text-sm sm:text-base font-black text-brand hover:underline uppercase tracking-wide">
            Advertorial <i className="fas fa-arrow-up-right-from-square text-[10px] ml-1"></i>
          </a>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-3">De ce noi</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Publicitate digitală fără bătăi de cap.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border-2 border-slate-200">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-white p-5 sm:p-6 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-navy text-white flex items-center justify-center mb-4">
                <i className={`fas ${b.i}`}></i>
              </div>
              <div className="font-black text-slate-900 mb-2">{b.t}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-3">Cum funcționează</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">3 pași. Maxim 48 de ore.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map(s => (
              <div key={s.n} className="border-l-4 border-brand pl-5 py-2">
                <div className="text-5xl font-black text-brand/30 mb-2">0{s.n}</div>
                <div className="text-xl font-black mb-2">{s.t}</div>
                <p className="text-sm text-white/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECONDARY ACTIONS */}
      <section id="anunturi" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-px bg-slate-200 border-2 border-slate-200">
          <div className="bg-white p-6 sm:p-8 md:p-10">
            <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-3">Mică publicitate</div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Ai nevoie de un anunț tip pierderi, decese, citații?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Anunțuri de mică publicitate, online + tipar dacă vrei. Comandă online, fără drumuri.</p>
            <button onClick={onAnunturi} className="text-sm font-black text-brand hover:underline uppercase tracking-wider">
              Comandă anunț <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div className="bg-navy text-white p-6 sm:p-8 md:p-10">
            <div className="text-[11px] font-bold text-white/50 uppercase tracking-[2px] mb-3">Vorbește cu noi</div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 tracking-tight">Ai întrebări sau cerințe speciale?</h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">Echipa noastră răspunde pe WhatsApp în max 30 minute, în programul de lucru.</p>
            <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 text-sm uppercase tracking-wider border-2 border-green-600">
              <i className="fab fa-whatsapp"></i> Scrie pe WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-[0.06]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 tracking-tight">Începe în 2 minute.</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8">Nu trebuie să știi ce vrei. Te ajutăm noi să alegi.</p>
          <button onClick={onConsult} className="w-full sm:w-auto bg-white text-brand hover:bg-slate-100 font-black px-8 py-4 text-sm uppercase tracking-wider border-2 border-white">
            Începe Consultarea Gratuită <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </section>
    </div>
  );
}
