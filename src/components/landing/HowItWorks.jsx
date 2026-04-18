const STEPS = [
  { num: "1", icon: "fas fa-comments", title: "Răspunde la 4 întrebări", desc: "Spune-ne ce afacere ai, ce vrei și ce buget ai. Sub 1 minut." },
  { num: "2", icon: "fas fa-robot", title: "Primești recomandarea AI", desc: "Algoritmul analizează nevoile tale și îți sugerează cel mai bun pachet." },
  { num: "3", icon: "fas fa-rocket", title: "Alegi și publici", desc: "Confirmi pachetul, trimiți materialele și te promovăm." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-14 md:py-20">
      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight text-center mb-8 sm:mb-12">Cum funcționează</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {STEPS.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white font-black text-base flex items-center justify-center mx-auto mb-3">
              <i className={`${s.icon} text-sm`}></i>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">{s.title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
