import { useState, useRef, useEffect } from "react";
import { CONSULT_STEPS } from "../../data/packages";
import { callConsult } from "../../utils/ai";
import { useAuth } from "../../context/AuthContext";
import LeadCaptureStep from "../auth/LeadCaptureStep";

const TOTAL_DOTS = 6; // 5 questions + 1 lead capture
const LEAD_STEP = 2;

export default function ConsultView({ onResult, onBack }) {
  const { isAuthenticated, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
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

  const visibleTotal = isAuthenticated ? TOTAL_DOTS - 1 : TOTAL_DOTS;
  const visibleCurrent = isAuthenticated && step > LEAD_STEP ? step - 1 : step;

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
      if (e.key === "Enter" && freeText.trim() && selected) handleFreeTextSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-6 p-8 bg-slate-50">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-brand animate-bounce"></div>
          <div className="w-3 h-3 bg-brand animate-bounce [animation-delay:100ms]"></div>
          <div className="w-3 h-3 bg-brand animate-bounce [animation-delay:200ms]"></div>
        </div>
        <p className="text-slate-500 font-semibold">Analizăm cele mai bune opțiuni pentru tine...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)]">
      {/* PROGRESS BAR */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between text-[10px] uppercase tracking-[2px] font-black text-slate-400 mb-2">
            <span>Pas {visibleCurrent + 1} din {visibleTotal}</span>
            <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={handleBack}>← Înapoi</button>
          </div>
          <div className="h-1 bg-slate-100">
            <div className="h-full bg-brand transition-all duration-500" style={{ width: `${((visibleCurrent + 1) / visibleTotal) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-16" key={animKey}>
        <div className="animate-slideUp">
          {isLeadStep ? (
            <LeadCaptureStep onDone={handleLeadDone} source="consult" />
          ) : current ? (
            <>
              <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-3">Întrebare {visibleCurrent + 1}</div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-8 sm:mb-10 tracking-tight leading-[1.05]">
                {current.question}
              </h1>
              <div className="space-y-3">
                {current.options.map(opt => {
                  const isOpt = selected === opt.id || answers[current.id] === opt.id ||
                    (opt.freeText && answers[current.id] && !current.options.find(o => !o.freeText && o.id === answers[current.id]));
                  return (
                    <div key={opt.id}>
                      <button
                        className={`w-full flex items-stretch border-2 text-left transition-all group ${
                          isOpt ? 'border-navy' : 'border-slate-200 bg-white hover:border-slate-900'
                        }`}
                        onClick={() => handleSelect(opt.id, opt)}
                      >
                        <div className={`w-[72px] flex-shrink-0 flex items-center justify-center ${
                          isOpt ? 'bg-navy text-white' : 'bg-slate-50 text-navy border-r-2 border-slate-200 group-hover:border-slate-900'
                        }`}>
                          <i className={`fas ${opt.icon} text-[26px]`}></i>
                        </div>
                        <div className="flex-1 p-5 flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">{opt.label}</span>
                          <i className={`fas fa-arrow-right ${isOpt ? 'text-navy' : 'text-slate-300 group-hover:text-slate-900'}`}></i>
                        </div>
                      </button>
                      {opt.freeText && (selected === opt.id || isOpt) && (
                        <div className="flex gap-2 mt-3">
                          <input
                            ref={freeRef}
                            className="flex-1 p-4 bg-slate-50 border-2 border-slate-200 outline-none focus:border-slate-900 text-sm font-medium"
                            placeholder="Descrie pe scurt afacerea ta..."
                            value={freeText}
                            onChange={e => setFreeText(e.target.value)}
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter' && freeText.trim()) handleFreeTextSubmit(); }}
                          />
                          <button
                            className="px-6 py-3 bg-brand text-white font-bold hover:bg-brand-dark transition-all disabled:opacity-50 text-sm whitespace-nowrap border-2 border-brand"
                            disabled={!freeText.trim()}
                            onClick={handleFreeTextSubmit}
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
      </div>
    </div>
  );
}
