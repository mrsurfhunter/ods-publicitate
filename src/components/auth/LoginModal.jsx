import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { checkLead } from "../../utils/leads";

export default function LoginModal({ onClose, onLoggedIn }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setErr("");

    const local = await login(email.trim().toLowerCase());
    if (local) {
      setLoading(false);
      if (onLoggedIn) onLoggedIn(local);
      onClose();
      return;
    }

    const server = await checkLead(email.trim().toLowerCase());
    if (server?.exists) {
      setErr("Contul există pe server, dar nu în acest browser. Te rugăm să începi o consultare nouă.");
    } else {
      setErr("Nu am găsit acest email. Începe o consultare nouă pentru a crea un cont.");
    }
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
            <i className="fas fa-right-to-bracket text-2xl text-blue-600"></i>
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bine ai revenit!</h3>
          <p className="text-sm text-slate-500 mt-1">Introdu emailul cu care te-ai înregistrat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium transition-all"
              value={email}
              onChange={e => { setEmail(e.target.value); setErr(""); }}
              placeholder="email@firma.ro"
              autoFocus
            />
          </div>

          {err && <p className="text-xs text-[#e30613] font-semibold leading-relaxed">{err}</p>}

          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="w-full py-4 bg-cta text-white font-black hover:bg-cta-dark transition-all disabled:opacity-50 uppercase text-xs tracking-widest border-2 border-cta-dark"
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : "Intră în cont"}
          </button>
        </form>
      </div>
    </div>
  );
}
