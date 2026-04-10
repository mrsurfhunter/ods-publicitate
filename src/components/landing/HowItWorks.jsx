const STEPS = [
  { num: "1", title: "Răspunde la 4 întrebări", desc: "Spune-ne ce afacere ai, ce vrei să obții și ce buget ai. Durează sub 1 minut." },
  { num: "2", title: "Primești recomandarea AI", desc: "Algoritmul nostru analizează nevoile tale și îți sugerează cel mai bun pachet." },
  { num: "3", title: "Alegi și publici", desc: "Confirmi pachetul, trimiți materialele și te promovăm pe toate canalele." },
];

export default function HowItWorks() {
  return (
    <div className="how-section">
      <h2 className="heading-lg" style={{ textAlign: "center", color: "var(--c-primary)", marginBottom: 32 }}>Cum funcționează</h2>
      <div className="how-grid">
        {STEPS.map((s, i) => (
          <div key={i} className={`how-step fade-up stagger-${i + 1}`}>
            <div className="how-step-num">{s.num}</div>
            <div className="how-step-title">{s.title}</div>
            <div className="how-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
