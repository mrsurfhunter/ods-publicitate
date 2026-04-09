import { useState } from "react";
import { AD_CAT } from "../../data/packages";
import { callAI } from "../../utils/ai";
import { calcAd } from "../../utils/pricing";
import AdCheckout from "./AdCheckout";

export default function AnunturiView({ onBack, onConsult }) {
  const [cat, setCat] = useState("");
  const [text, setText] = useState("");
  const [days, setDays] = useState(1);
  const [ai, setAi] = useState(false);
  const [aiOk, setAiOk] = useState(null);
  const [adCheckout, setAdCheckout] = useState(null);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const pr = calcAd(words, days);
  const canOrd = cat && words >= 3 && words <= 1200;

  const enhance = async () => {
    if (!text.trim() || !cat) return;
    setAi(true); setAiOk(null);
    const r = await callAI(
      "Esti redactor oradesibiu.ro. Imbunatateste anuntul. Corecteaza greseli. NU inventa. DOAR textul. Romana.",
      "Tip: " + (AD_CAT.find(c => c.id === cat)?.label || "") + "\n\n" + text
    );
    setAi(false);
    if (r) { setText(r); setAiOk(true); } else setAiOk(false);
  };

  return (
    <div className="view-enter" style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 className="heading-lg" style={{ color: 'var(--c-primary)', marginBottom: 8 }}>Mica Publicitate si Anunturi</h1>
        <p className="text-secondary">Publica anunturi pe oradesibiu.ro — avize, pierderi, decese, autorizatii</p>
        <div style={{ marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800, color: 'var(--c-accent)' }}>de la 50 lei / zi</span>
          <span className="text-xs text-muted" style={{ marginLeft: 8 }}>pana la 250 cuvinte</span>
        </div>
      </div>

      {/* Step 1: Category */}
      <div style={{ marginBottom: 24 }}>
        <label className="label" style={{ fontSize: 12 }}>1. Tipul anuntului</label>
        <div className="ad-cat-grid" style={{ marginTop: 8 }}>
          {AD_CAT.map(c => (
            <button key={c.id} className={`ad-cat-card ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
              <div className="ad-cat-icon">{c.icon}</div>
              <div className="ad-cat-label">{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Text */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label className="label" style={{ fontSize: 12 }}>2. Textul anuntului</label>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: words > 1200 ? 'var(--c-red)' : words > 250 ? 'var(--c-accent)' : 'var(--c-success)' }}>{words} cuvinte</span>
        </div>
        <textarea className="textarea" value={text} onChange={e => setText(e.target.value)} placeholder="Scrieti textul anuntului..." style={{ minHeight: 150, marginTop: 8 }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <button className="btn btn-dark btn-sm" onClick={enhance} disabled={ai || !text.trim() || words < 5}>
            {ai ? "..." : "✨ Imbunatateste cu AI"}
          </button>
          {aiOk === true && <span className="text-xs" style={{ color: 'var(--c-success)', fontWeight: 600 }}>Imbunatatit!</span>}
          {aiOk === false && <span className="text-xs" style={{ color: 'var(--c-red)' }}>AI indisponibil</span>}
        </div>
      </div>

      {/* Step 3: Duration */}
      <div style={{ marginBottom: 24 }}>
        <label className="label" style={{ fontSize: 12 }}>3. Durata</label>
        <div className="dur-btn-group" style={{ marginTop: 8 }}>
          {[1, 3, 5, 7, 14, 30].map(d => (
            <button key={d} className={`dur-btn ${days === d ? 'active' : ''}`} onClick={() => setDays(d)}>
              {d} {d === 1 ? "zi" : "zile"}
            </button>
          ))}
          <input type="number" className="input" min={1} max={90} value={days} onChange={e => setDays(Math.max(1, Math.min(90, Number(e.target.value))))} style={{ width: 70, textAlign: 'center' }} />
        </div>
        {pr.disc > 0 && <div className="text-xs" style={{ color: 'var(--c-success)', fontWeight: 600, marginTop: 6 }}>Discount {Math.round(pr.disc * 100)}%</div>}
      </div>

      {/* Total */}
      <div className="card card-static card-padding">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--c-primary)' }}>Total de plata:</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--c-accent)' }}>{pr.total.toLocaleString("ro")} lei</div>
            <div className="text-xs text-muted">+ TVA = {Math.round(pr.total * 1.19).toLocaleString("ro")} lei | {pr.a} lei/zi x {days} zile</div>
          </div>
        </div>
        <button className="btn btn-primary btn-block" disabled={!canOrd} onClick={() => setAdCheckout({ cat: AD_CAT.find(c => c.id === cat), text, words, days, pr })}>
          Plaseaza anuntul
        </button>
      </div>

      <button className="consult-back" onClick={onBack} style={{ marginTop: 24 }}>← Pagina principala</button>

      {/* Cross-sell */}
      {onConsult && (
        <div className="cross-sell">
          <div className="cross-sell-text">Ai si o afacere? Descopera pachetele de promovare!</div>
          <button className="btn btn-secondary btn-sm" onClick={onConsult}>Incepe consultarea</button>
        </div>
      )}

      {adCheckout && <AdCheckout ad={adCheckout} onClose={() => setAdCheckout(null)} />}
    </div>
  );
}
