import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendOTP, verifyOTP } from "../../utils/otp";

const COPY = {
  consult: {
    title: "Aproape gata — verifică-ți telefonul",
    sub: "Îți trimitem un cod prin SMS ca să-ți pregătim recomandarea personalizată.",
  },
  catalog: {
    title: "Verifică-ți telefonul ca să vezi pachetele",
    sub: "Cont gratuit în 30 secunde. Trimitem un cod prin SMS la numărul tău.",
  },
  default: {
    title: "Cont gratuit prin SMS",
    sub: "Îți trimitem un cod de verificare la numărul de telefon.",
  },
};

export default function LeadCaptureStep({ onDone, source }) {
  const { verifyAndLogin, isAuthenticated, user } = useAuth();
  const [step, setStep] = useState("phone"); // "phone" | "code"
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRef = useRef();
  const copy = COPY[source] || COPY.default;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  if (isAuthenticated && user) {
    if (onDone) onDone(user);
    return null;
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const validPhone = phoneDigits.length >= 9 && phoneDigits.length <= 12;
  const validCode = /^\d{4,8}$/.test(code);

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (!validPhone) return;
    setLoading(true); setErr("");
    try {
      await sendOTP(phone);
      setStep("code");
      setResendCooldown(45);
      setTimeout(() => codeRef.current?.focus(), 100);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!validCode) return;
    setLoading(true); setErr("");
    try {
      const u = await verifyOTP(phone, code);
      const stored = await verifyAndLogin(u);
      if (onDone) onDone(stored);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true); setErr("");
    try {
      await sendOTP(phone);
      setResendCooldown(45);
      setCode("");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-5 sm:p-8 border-2 border-slate-200 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{copy.title}</h3>
        <p className="text-sm text-slate-500 mt-1">{copy.sub}</p>
      </div>

      {step === "phone" && (
        <form onSubmit={handleSendOTP} className="space-y-3">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefon *</label>
            <input
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="07xx xxx xxx"
              autoFocus
            />
            <p className="text-[10px] text-slate-400 mt-1.5">Format: 07xx xxx xxx (10 cifre)</p>
          </div>

          {err && <p className="text-xs text-[#e30613] font-semibold">{err}</p>}

          <button type="submit" disabled={!validPhone || loading} className="w-full py-4 bg-cta text-white font-black hover:bg-cta-dark transition-all disabled:opacity-50 uppercase text-xs tracking-widest mt-2 border-2 border-cta-dark">
            {loading ? "Se trimite SMS..." : "Trimite cod prin SMS"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="text-center mb-3">
            <p className="text-xs text-slate-500">Cod trimis la</p>
            <p className="text-sm font-bold text-slate-900">{phone}</p>
            <button type="button" onClick={() => { setStep("phone"); setCode(""); setErr(""); }} className="text-[11px] text-slate-400 hover:text-slate-700 underline mt-1">
              Schimbă numărul
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">Cod primit prin SMS *</label>
            <input
              ref={codeRef}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-2xl font-bold tracking-[8px] text-center"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
          </div>

          {err && <p className="text-xs text-[#e30613] font-semibold text-center">{err}</p>}

          <button type="submit" disabled={!validCode || loading} className="w-full py-4 bg-cta text-white font-black hover:bg-cta-dark transition-all disabled:opacity-50 uppercase text-xs tracking-widest mt-2 border-2 border-cta-dark">
            {loading ? "Se verifică..." : "Verifică și continuă"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className="w-full text-[11px] text-slate-400 hover:text-slate-700 mt-1 disabled:opacity-50"
          >
            {resendCooldown > 0 ? `Retrimite cod în ${resendCooldown}s` : "Retrimite codul"}
          </button>
        </form>
      )}

      <p className="text-[10px] text-slate-400 text-center mt-4 flex items-center justify-center gap-1.5">
        <i className="fas fa-lock text-[8px]"></i> Numărul tău rămâne privat. Nu trimitem spam.
      </p>
    </div>
  );
}
