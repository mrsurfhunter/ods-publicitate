import { useState, useRef, useEffect } from "react";
import { CONSULT_STEPS } from "../../data/packages";
import { callConsult } from "../../utils/ai";
import { useAuth } from "../../context/AuthContext";
import LeadCaptureStep from "../auth/LeadCaptureStep";

// Steps: 0=businessType, 1=goal, 2=LEAD CAPTURE, 3=budget, 4=timeline
const TOTAL_DOTS = 5;
const LEAD_STEP = 2;

export default function ConsultView({ onResult, onBack }) {
  const { isAuthenticated, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const freeRef = useRef();

  // Map visual step to data step (skip lead capture if authenticated)
  const getDataStep = (visualStep) => {
    if (visualStep < LEAD_STEP) return visualStep;
    if (visualStep === LEAD_STEP) return null; // lead capture
    return visualStep - 1; // offset after lead step
  };

  const dataIdx = getDataStep(step);
  const current = dataIdx !== null ? CONSULT_STEPS[dataIdx] : null;
  const isLeadStep = step === LEAD_STEP && !isAuthenticated;

  const handleSelect = async (optionId, option) => {
    if (option?.freeText && !freeText.trim()) {
      freeRef.current?.focus();
      return;
    }

    const value = option?.freeText ? freeText.trim() : optionId;
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);

    const nextStep = step + 1;
    // Skip lead step if already authenticated
    const actualNext = (nextStep === LEAD_STEP && isAuthenticated) ? nextStep + 1 : nextStep;

    if (actualNext < TOTAL_DOTS) {
      setAnimKey(k => k + 1);
      setStep(actualNext);
      setFreeText("");
    } else {
      // All steps done — call AI
      setLoading(true);
      updateUser({ consultAnswers: updated });
      const minWait = new Promise(r => setTimeout(r, 1500));
      const apiCall = callConsult(updated);
      const [, result] = await Promise.all([minWait, apiCall]);
      setLoading(false);
      onResult(result, updated);
    }
  };

  const handleLeadDone = () => {
    setAnimKey(k => k + 1);
    setStep(LEAD_STEP + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      let prev = step - 1;
      // Skip lead step when going back if authenticated
      if (prev === LEAD_STEP && isAuthenticated) prev--;
      setAnimKey(k => k + 1);
      setStep(prev);
      setFreeText("");
    } else {
      onBack();
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && freeText.trim() && current) {
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

  // Build progress dots with connecting lines
  const renderProgress = () => {
    const dots = [];
    const effectiveSteps = isAuthenticated ? TOTAL_DOTS - 1 : TOTAL_DOTS;
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
        {/* Progress */}
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
                  const isSelected = answers[current.id] === opt.id ||
                    (opt.freeText && answers[current.id] && !current.options.find(o => !o.freeText && o.id === answers[current.id]));
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
            </>
          ) : null}
        </div>

        <button className="consult-back" onClick={handleBack}>
          ← {step > 0 ? 'Inapoi' : 'Pagina principala'}
        </button>
      </div>
    </div>
  );
}
