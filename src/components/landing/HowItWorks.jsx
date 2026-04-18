const STEPS = [
  { num: "1", title: "Răspunde la 4 întrebări", desc: "Spune-ne ce afacere ai, ce vrei să obții și ce buget ai. Durează sub 1 minut." },
  { num: "2", title: "Primești recomandarea AI", desc: "Algoritmul nostru analizează nevoile tale și îți sugerează cel mai bun pachet." },
  { num: "3", title: "Alegi și publici", desc: "Confirmi pachetul, trimiți materialele și te promovăm pe toate canalele." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 md:py-20">
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight text-center mb-12">Cum funcționează</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {STEPS.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-black text-lg flex items-center justify-center mx-auto mb-4">
              {s.num}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
