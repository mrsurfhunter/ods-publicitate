import TeaserCards from "./TeaserCards";
import HowItWorks from "./HowItWorks";

const TRUST_MAIN = [
  { v: "400k+", l: "vizitatori/lună" },
  { v: "1.8M", l: "afișări/lună" },
];

const TRUST_SOCIAL = [
  { v: "218k", l: "Facebook", icon: "fab fa-facebook-f" },
  { v: "18k", l: "Instagram", icon: "fab fa-instagram" },
  { v: "24k", l: "TikTok", icon: "fab fa-tiktok" },
];

export default function LandingView({ onConsult, onAnunturi, onCatalog }) {
  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)' }}></div>
        <div className="relative max-w-3xl mx-auto text-center px-5 py-12 sm:py-16 md:py-24">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-8">
            <i className="fas fa-bullhorn text-xl sm:text-2xl text-[#e30613]"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-3 sm:mb-5 leading-[1.1]">
            Crește-ți Afacerea cu{" "}
            <span className="text-[#e30613]">Ora de Sibiu</span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-md mx-auto font-medium mb-6 sm:mb-10 leading-relaxed px-2">
            Bannere, articole sponsorizate și promovare pe Social Media — totul într-un singur loc.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
            <button
              onClick={onConsult}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 sm:px-10 sm:py-5 text-sm sm:text-base font-black text-white uppercase tracking-wider bg-[#e30613] rounded-full shadow-2xl shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              Începe Promovarea <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform text-xs"></i>
            </button>
            <button
              onClick={onAnunturi}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white/50 border border-white/15 rounded-full hover:bg-white/5 hover:text-white/70 transition-all"
            >
              Mică Publicitate →
            </button>
          </div>

          {/* Trust stats — 2 rows on mobile */}
          <div className="mt-10 sm:mt-16">
            <div className="flex justify-center items-center gap-6 sm:gap-8 mb-4">
              {TRUST_MAIN.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">{s.v}</div>
                  <div className="text-[10px] sm:text-xs text-white/40 font-medium mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-5 sm:gap-6">
              {TRUST_SOCIAL.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <i className={`${s.icon} text-white/30 text-xs`}></i>
                  <span className="text-sm sm:text-base font-bold text-white/60">{s.v}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="text-white/25 text-xs sm:text-sm font-medium mt-5 hover:text-white/50 transition-colors" onClick={onCatalog}>
            Vezi toate pachetele →
          </button>
        </div>
      </div>

      {/* Social proof bar */}
      <div className="bg-white border-b border-slate-100 py-3 sm:py-4 px-4">
        <div className="flex justify-center items-center gap-4 sm:gap-8 flex-wrap">
          {["17 ani experiență", "Trafic auditat BRAT", "Peste 1.000 clienți"].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>{t}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <TeaserCards onConsult={onConsult} />

      {/* How it works */}
      <div className="bg-white border-t border-b border-slate-100">
        <HowItWorks />
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-[#e30613] to-red-800 py-12 sm:py-16 md:py-20 text-center px-5">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 sm:mb-6">Gata să începi?</h2>
        <button onClick={onConsult} className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-red-700 font-black uppercase text-xs sm:text-sm tracking-widest rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
          Descoperă pachetul potrivit
        </button>
        <div className="mt-4 sm:mt-6">
          <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="text-red-200/50 text-xs sm:text-sm font-medium hover:text-white transition-colors inline-flex items-center gap-1.5">
            <i className="fab fa-whatsapp"></i> Sau scrie-ne pe WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
