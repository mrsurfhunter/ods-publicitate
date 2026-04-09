import { useState, useRef, useEffect } from "react";
import { CONSULT_STEPS } from "../../data/packages";
import { callConsult } from "../../utils/ai";

export default function ConsultView({ onResult, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const freeRef = useRef();

  const current = CONSULT_STEPS[step];
  const totalSteps = CONSULT_STEPS.length;

  const handleSelect = async (optionId, option) => {
    if (option?.freeText && !freeText.trim()) {
      freeRef.current?.focus();
      return;
    }

    const value = option?.freeText ? freeText.trim() : optionId;
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);

    if (step < totalSteps - 1) {
      setAnimKey(k => k + 1);
      setStep(step + 1);
      setFreeText("");
    } else {
      // Last step — call AI
      setLoading(true);
      const minWait = new Promise(r => setTimeout(r, 1500));
      const apiCall = callConsult(updated);
      const [, result] = await Promise.all([minWait, apiCall]);
      setLoading(false);
      onResult(result, updated);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setAnimKey(k => k + 1);
      setStep(step - 1);
      setFreeText("");
    } else {
      onBack();
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && freeText.trim()) {
        const opt = current.options.find(o => o.freeText);
        if (opt) handleSelect(opt.id, opt);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
        <div className="loading-text">Analizam cele mai bune optiuni pentru tine...</div>
      </div>
    );
  }

  return (
    <div className="consult">
      <div className="consult-inner" key={animKey}>
        {/* Progress dots */}
        <div className="consult-progress">
          {CONSULT_STEPS.map((_, i) => (
            <div key={i} className={`consult-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        {/* Question */}
        <div className="slide-left">
          <h2 className="consult-question">{current.question}</h2>

          <div className="consult-options">
            {current.options.map(opt => {
              const isSelected = answers[current.id] === opt.id || (opt.freeText && answers[current.id] && !current.options.find(o => !o.freeText && o.id === answers[current.id]));

              return (
                <div key={opt.id}>
                  <button
                    className={`consult-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.id, opt)}
                  >
                    <span className="consult-option-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>

                  {opt.freeText && isSelected && (
                    <input
                      ref={freeRef}
                      className="consult-free-input"
                      placeholder="Descrie pe scurt afacerea ta..."
                      value={freeText}
                      onChange={e => setFreeText(e.target.value)}
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter' && freeText.trim()) handleSelect(opt.id, opt); }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button className="consult-back" onClick={handleBack}>
          ← {step > 0 ? 'Inapoi' : 'Pagina principala'}
        </button>
      </div>
    </div>
  );
}
