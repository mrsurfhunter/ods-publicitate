import { useState, useRef, useEffect } from "react";
import { CONSULT_STEPS } from "../../data/packages";
import { callConsult } from "../../utils/ai";
import { useAuth } from "../../context/AuthContext";
import LeadCaptureStep from "../auth/LeadCaptureStep";

const TOTAL_DOTS = 5;
const LEAD_STEP = 2;

export default function ConsultView({ onResult, onBack }) {
  const { isAuthenticated, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null); // selected option id (before confirming freeText)
  const [loading, setLoading] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const freeRef = useRef();

  const getDataStep = (visualStep) => {
    if (visualStep < LEAD_STEP) return visualStep;
    if (visualStep === LEAD_STEP) return null;
    return visualStep - 1;
  };

  const dataIdx = getDataStep(step);
  const current = dataIdx !== null ? CONSULT_STEPS[dataIdx] : null;
  const isLeadStep = step === LEAD_STEP && !isAuthenticated;

  const advance = async (updated) => {
    const nextStep = step + 1;
    const actualNext = (nextStep === LEAD_STEP && isAuthenticated) ? nextStep + 1 : nextStep;

    if (actualNext < TOTAL_DOTS) {
      setAnimKey(k => k + 1);
      setStep(actualNext);
      setFreeText("");
      setSelected(null);
    } else {
      setLoading(true);
      updateUser({ consultAnswers: updated });
      const minWait = new Promise(r => setTimeout(r, 1500));
      const apiCall = callConsult(updated);
      const [, result] = await Promise.all([minWait, apiCall]);
      setLoading(false);
      onResult(result, updated);
    }
  };

  const handleSelect = (optionId, option) => {
    // Free text option: first click selects it, second click (or Enter) submits
    if (option?.freeText) {
      if (selected === optionId && freeText.trim()) {
        const updated = { ...answers, [current.id]: freeText.trim() };
        setAnswers(updated);
        advance(updated);
      } else {
        setSelected(optionId);
        setTimeout(() => freeRef.current?.focus(), 100);
      }
      return;
    }

    // Normal option: immediate advance
    const updated = { ...answers, [current.id]: optionId };
    setAnswers(updated);
    advance(updated);
  };

  const handleFreeTextSubmit = () => {
    if (!freeText.trim() || !current) return;
    const updated = { ...answers, [current.id]: freeText.trim() };
    setAnswers(updated);
    advance(updated);
  };

  const handleLeadDone = () => {
    setAnimKey(k => k + 1);
    setStep(LEAD_STEP + 1);
    setSelected(null);
  };

  const handleBack = () => {
    if (step > 0) {
      let prev = step - 1;
      if (prev === LEAD_STEP && isAuthenticated) prev--;
      setAnimKey(k => k + 1);
      setStep(prev);
      setFreeText("");
      setSelected(null);
    } else {
      onBack();
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && freeText.trim() && selected) {
        handleFreeTextSubmit();
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
        <div className="loading-text">Analizăm cele mai bune opțiuni pentru tine...</div>
      </div>
    );
  }

  const renderProgress = () => {
    const dots = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
      if (i === LEAD_STEP && isAuthenticated) continue;
      if (dots.length > 0) {
        const prevDone = i <= step;
        dots.push(<div key={"line-" + i} className={`consult-dot-line ${prevDone ? 'done' : ''}`} />);
      }
      const cls = i === step ? 'active' : i < step ? 'done' : '';
      dots.push(<div key={"dot-" + i} className={`consult-dot ${cls}`} />);
    }
    return dots;
  };

  return (
    <div className="consult">
      <div className="consult-inner" key={animKey}>
        <div className="consult-progress">
          {renderProgress()}
        </div>

        <div className="slide-left">
          {isLeadStep ? (
            <LeadCaptureStep onDone={handleLeadDone} source="consult" />
          ) : current ? (
            <>
              <h2 className="consult-question">{current.question}</h2>
              <div className="consult-options">
                {current.options.map(opt => {
                  const isOpt = selected === opt.id || answers[current.id] === opt.id ||
                    (opt.freeText && answers[current.id] && !current.options.find(o => !o.freeText && o.id === answers[current.id]));
                  return (
                    <div key={opt.id}>
                      <button
                        className={`consult-option ${isOpt ? 'selected' : ''}`}
                        onClick={() => handleSelect(opt.id, opt)}
                      >
                        <span className="consult-option-icon">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                      {opt.freeText && (selected === opt.id || isOpt) && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <input
                            ref={freeRef}
                            className="consult-free-input"
                            placeholder="Descrie pe scurt afacerea ta..."
                            value={freeText}
                            onChange={e => setFreeText(e.target.value)}
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter' && freeText.trim()) handleFreeTextSubmit(); }}
                            style={{ flex: 1 }}
                          />
                          <button
                            className="btn btn-primary"
                            disabled={!freeText.trim()}
                            onClick={handleFreeTextSubmit}
                            style={{ padding: '12px 20px', flexShrink: 0 }}
                          >
                            Continuă →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>

        <button className="consult-back" onClick={handleBack}>
          ← {step > 0 ? 'Înapoi' : 'Pagina principală'}
        </button>
      </div>
    </div>
  );
}
