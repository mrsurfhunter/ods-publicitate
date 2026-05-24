import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendOTP, verifyOTP } from "../../utils/otp";

export default function LoginModal({ onClose, onLoggedIn }) {
  const { verifyAndLogin } = useAuth();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRef = useRef();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

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
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!validCode) return;
    setLoading(true); setErr("");
    try {
      const u = await verifyOTP(phone, code);
      const stored = await verifyAndLogin(u);
      if (onLoggedIn) onLoggedIn(stored);
      onClose();
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true); setErr("");
    try {
      await sendOTP(phone);
      setResendCooldown(45);
      setCode("");
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-navy/80 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md p-6 sm:p-8 relative animate-fadeIn border-2 border-slate-300" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all" onClick={onClose}>
          ×
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 flex items-center justify-center mx-auto mb-4 border-2 border-blue-100">
            <i className="fas fa-mobile-screen text-2xl text-blue-600"></i>
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Intră în cont</h3>
          <p className="text-sm text-slate-500 mt-1">
            {step === "phone" ? "Introdu numărul de telefon — îți trimitem un cod prin SMS" : "Introdu codul primit"}
          </p>
        </div>

        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefon</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
                value={phone}
                onChange={e => { setPhone(e.target.value); setErr(""); }}
                placeholder="07xx xxx xxx"
                autoFocus
              />
            </div>

            {err && <p className="text-xs text-[#e30613] font-semibold">{err}</p>}

            <button
              type="submit"
              disabled={!validPhone || loading}
              className="w-full py-4 bg-cta text-white font-black hover:bg-cta-dark transition-all disabled:opacity-50 uppercase text-xs tracking-widest border-2 border-cta-dark"
            >
              {loading ? <i className="fas fa-spinner animate-spin"></i> : "Trimite cod prin SMS"}
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

            <input
              ref={codeRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-2xl font-bold tracking-[8px] text-center"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />

            {err && <p className="text-xs text-[#e30613] font-semibold text-center">{err}</p>}

            <button
              type="submit"
              disabled={!validCode || loading}
              className="w-full py-4 bg-cta text-white font-black hover:bg-cta-dark transition-all disabled:opacity-50 uppercase text-xs tracking-widest border-2 border-cta-dark"
            >
              {loading ? "Se verifică..." : "Verifică și intră"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="w-full text-[11px] text-slate-400 hover:text-slate-700 disabled:opacity-50"
            >
              {resendCooldown > 0 ? `Retrimite cod în ${resendCooldown}s` : "Retrimite codul"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
