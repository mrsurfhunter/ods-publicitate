const BENEFITS = [
  { icon: "fas fa-users", title: "400.000+ sibieni lunar", desc: "Cea mai citită publicație din Sibiu, cu trafic auditat BRAT. Afacerea ta ajunge la publicul potrivit." },
  { icon: "fas fa-search-plus", title: "Vizibilitate pe Google", desc: "Articolele rămân indexate permanent. Clienții te găsesc când caută servicii ca ale tale în Sibiu." },
  { icon: "fas fa-flag", title: "Toate canalele, un singur pachet", desc: "Site + Facebook (218k) + Instagram (18k) + TikTok (24k) + Newsletter + Push notifications." },
  { icon: "fas fa-pen-nib", title: "Conținut profesional inclus", desc: "Redacția noastră scrie articolul, creează postările și se ocupă de tot. Tu doar aprobi." },
];

export default function TeaserCards({ onConsult }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">De ce să te promovezi pe Ora de Sibiu?</h2>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">17 ani de experiență în promovarea afacerilor locale din Sibiu</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BENEFITS.map((b, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <i className={`${b.icon} text-blue-600`}></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12 space-y-4">
        <p className="text-slate-500">Pachete de la <span className="text-xl font-black text-navy">500 lei</span></p>
        <button onClick={onConsult} className="px-8 py-4 bg-navy text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-navy-dark transition-all shadow-lg shadow-navy/20">
          Descoperă pachetul potrivit →
        </button>
      </div>
    </div>
  );
}
