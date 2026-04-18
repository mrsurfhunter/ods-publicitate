const BENEFITS = [
  { icon: "fas fa-users", color: "text-blue-600 bg-blue-100", title: "400.000+ sibieni lunar", desc: "Cea mai citită publicație din Sibiu, cu trafic auditat BRAT." },
  { icon: "fas fa-search-plus", color: "text-emerald-600 bg-emerald-100", title: "Vizibilitate pe Google", desc: "Articolele rămân indexate permanent. Clienții te găsesc pe Google." },
  { icon: "fas fa-share-alt", color: "text-purple-600 bg-purple-100", title: "Toate canalele, un pachet", desc: "Site + Facebook + Instagram + TikTok + Newsletter + Push." },
  { icon: "fas fa-pen-nib", color: "text-amber-600 bg-amber-100", title: "Conținut profesional", desc: "Redacția noastră scrie articolul și creează postările. Tu doar aprobi." },
];

export default function TeaserCards({ onConsult }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-14 md:py-20">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">De ce Ora de Sibiu?</h2>
        <p className="text-slate-400 font-medium text-sm">17 ani de experiență în promovarea afacerilor din Sibiu</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {BENEFITS.map((b, i) => (
          <div key={i} className="bg-white border-2 border-slate-200 p-5 sm:p-6 hover:border-slate-400 transition-all group">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center mb-3 ${b.color}`}>
              <i className={`${b.icon} text-sm sm:text-base`}></i>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{b.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8 sm:mt-10 flex flex-col items-center gap-3">
        <p className="text-slate-400 text-sm">Pachete de la <span className="text-lg font-black text-navy">500 lei</span></p>
        <button onClick={onConsult} className="w-full sm:w-auto px-7 py-3.5 bg-navy text-white font-black uppercase text-xs tracking-widest hover:bg-navy-dark transition-all border-2 border-navy">
          Descoperă pachetul potrivit →
        </button>
      </div>
    </div>
  );
}
