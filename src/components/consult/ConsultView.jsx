import { useState, useRef, useEffect } from "react";
import { CONSULT_STEPS } from "../../data/packages";
import { callConsult } from "../../utils/ai";
import { useAuth } from "../../context/AuthContext";
import LeadCaptureStep from "../auth/LeadCaptureStep";

const TOTAL_DOTS = 5;
const LEAD_STEP = 2;

const STEP_LABELS = ["Afacere", "Obiectiv", "Cont", "Buget", "Frecvență"];

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
          <div className="w-3 h-3 bg-[#e30613] animate-bounce"></div>
          <div className="w-3 h-3 bg-[#e30613] animate-bounce [animation-delay:100ms]"></div>
          <div className="w-3 h-3 bg-[#e30613] animate-bounce [animation-delay:200ms]"></div>
        </div>
        <p className="text-slate-500 font-semibold">Analizăm cele mai bune opțiuni pentru tine...</p>
      </div>
    );
  }

  const renderProgress = () => {
    const visibleSteps = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
      if (i === LEAD_STEP && isAuthenticated) continue;
      visibleSteps.push(i);
    }
    return (
      <div className="w-full mb-4 sm:mb-6 md:mb-10 overflow-x-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-500 -translate-y-1/2"
            style={{ width: `${(visibleSteps.indexOf(step) / (visibleSteps.length - 1)) * 100}%` }}
          ></div>
          {visibleSteps.map((s, idx) => (
            <div key={s} className="flex flex-col items-center bg-slate-50 px-1 sm:px-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 transition-colors duration-300 ${
                step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {step > s ? <i className="fas fa-check text-xs sm:text-sm"></i> : <span className="text-xs sm:text-sm font-bold">{idx + 1}</span>}
              </div>
              <span className={`text-[9px] sm:text-[10px] mt-1 sm:mt-1.5 font-semibold ${step >= s ? 'text-blue-700' : 'text-slate-400'}`}>
                {STEP_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] flex flex-col justify-center p-3 sm:p-4 md:p-8 bg-slate-50">
      <div className="max-w-xl mx-auto w-full" key={animKey}>
        {renderProgress()}

        <div className="animate-slideUp">
          {isLeadStep ? (
            <LeadCaptureStep onDone={handleLeadDone} source="consult" />
          ) : current ? (
            <>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-900 text-center mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight">
                {current.question}
              </h2>
              <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                {current.options.map(opt => {
                  const isOpt = selected === opt.id || answers[current.id] === opt.id ||
                    (opt.freeText && answers[current.id] && !current.options.find(o => !o.freeText && o.id === answers[current.id]));
                  return (
                    <div key={opt.id}>
                      <button
                        className={`w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border-2 text-left font-semibold text-sm sm:text-base transition-all ${
                          isOpt ? 'border-blue-600 bg-blue-50 shadow-blue-100' : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                        onClick={() => handleSelect(opt.id, opt)}
                      >
                        <span className="text-xl sm:text-2xl flex-shrink-0 w-8 sm:w-10 text-center">{opt.icon}</span>
                        <span className="text-slate-800">{opt.label}</span>
                      </button>
                      {opt.freeText && (selected === opt.id || isOpt) && (
                        <div className="flex gap-2 mt-3">
                          <input
                            ref={freeRef}
                            className="flex-1 p-4 bg-blue-50 border-2 border-blue-200 outline-none focus:border-blue-500 text-sm font-medium"
                            placeholder="Descrie pe scurt afacerea ta..."
                            value={freeText}
                            onChange={e => setFreeText(e.target.value)}
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter' && freeText.trim()) handleFreeTextSubmit(); }}
                          />
                          <button
                            className="px-6 py-3 bg-[#e30613] text-white font-bold hover:bg-red-700 transition-all disabled:opacity-50 text-sm whitespace-nowrap"
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

        <button className="flex items-center gap-2 text-slate-400 text-sm font-semibold mt-8 hover:text-slate-700 transition-colors" onClick={handleBack}>
          <i className="fas fa-arrow-left text-xs"></i> {step > 0 ? 'Înapoi' : 'Pagina principală'}
        </button>
      </div>
    </div>
  );
}
