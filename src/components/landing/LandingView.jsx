import TeaserCards from "./TeaserCards";
import HowItWorks from "./HowItWorks";

const TRUST = [
  { v: "400k+", l: "vizitatori/lună", icon: "fas fa-eye" },
  { v: "1.8M", l: "afișări/lună", icon: "fas fa-chart-bar" },
  { v: "218k", l: "Facebook", icon: "fab fa-facebook-f" },
  { v: "18k", l: "Instagram", icon: "fab fa-instagram" },
  { v: "24k", l: "TikTok", icon: "fab fa-tiktok" },
];

export default function LandingView({ onConsult, onAnunturi, onCatalog }) {
  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmUgeDE9IjAiIHkxPSI0MCIgeDI9IjQwIiB5Mj0iMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 py-16 md:py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full mb-6 md:mb-8">
            <i className="fas fa-bullhorn text-2xl md:text-3xl text-[#e30613]"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 md:mb-6 leading-tight">
            Crește-ți Afacerea cu <br className="hidden sm:block" /><span className="text-[#e30613]">Ora de Sibiu</span>
          </h1>
          <p className="text-white/50 text-base md:text-xl max-w-2xl mx-auto font-medium mb-8 md:mb-12 px-2">
            Bannere, articole sponsorizate și promovare pe Social Media — totul într-un singur loc. Ajungi la cei mai mulți sibieni.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onConsult}
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 text-base md:text-lg font-black text-white uppercase tracking-widest bg-[#e30613] rounded-full overflow-hidden shadow-2xl shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="absolute inset-0 w-full h-full opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-3">
                Începe Promovarea <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </span>
            </button>
            <button
              onClick={onAnunturi}
              className="px-8 py-4 text-sm font-bold text-white/60 border border-white/15 rounded-full hover:bg-white/5 hover:text-white/80 transition-all"
            >
              Mică Publicitate
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex justify-center items-center gap-0 flex-wrap mt-14 md:mt-20">
            {TRUST.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 md:px-5 border-r border-white/10 last:border-r-0">
                <i className={`${s.icon} text-white/40 text-sm`}></i>
                <div className="text-left">
                  <div className="text-lg md:text-2xl font-black text-white leading-none">{s.v}</div>
                  <div className="text-[10px] text-white/40 font-medium whitespace-nowrap">{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="text-white/30 text-sm font-medium mt-6 hover:text-white/60 transition-colors" onClick={onCatalog}>
            Vezi toate pachetele →
          </button>
        </div>
      </div>

      {/* Social proof bar */}
      <div className="bg-white border-b border-slate-100 py-4 flex justify-center items-center gap-6 md:gap-8 flex-wrap px-4">
        {["17 ani experiență", "Trafic auditat BRAT", "Peste 1.000 clienți"].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>{t}
          </div>
        ))}
      </div>

      {/* Benefits */}
      <TeaserCards onConsult={onConsult} />

      {/* How it works */}
      <div className="bg-white border-t border-b border-slate-100">
        <HowItWorks />
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-16 md:py-20 text-center px-4">
        <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">Gata să începi?</h2>
        <button onClick={onConsult} className="px-10 py-5 bg-white text-red-700 font-black uppercase text-sm tracking-widest rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
          Descoperă pachetul potrivit
        </button>
        <div className="mt-6">
          <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="text-red-200/60 text-sm font-medium hover:text-white transition-colors">
            Sau scrie-ne pe WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
