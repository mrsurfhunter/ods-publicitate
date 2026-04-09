const STEPS = [
  { num: "1", title: "Raspunde la 4 intrebari", desc: "Spune-ne ce afacere ai, ce vrei sa obtii si ce buget ai. Dureaza sub 1 minut." },
  { num: "2", title: "Primesti recomandarea AI", desc: "Algoritmul nostru analizeaza nevoile tale si iti sugereaza cel mai bun pachet." },
  { num: "3", title: "Alegi si publici", desc: "Confirmi pachetul, trimiti materialele si te promovam pe toate canalele." },
];

export default function HowItWorks() {
  return (
    <div className="how-section">
      <h2 className="heading-lg" style={{ textAlign: "center", color: "var(--c-primary)", marginBottom: 32 }}>Cum functioneaza</h2>
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
