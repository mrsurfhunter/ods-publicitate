import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const COPY = {
  consult: {
    title: "Ca să-ți creăm recomandarea personalizată",
    sub: "Spune-ne cum te găsim și primești instant pachetul potrivit pentru afacerea ta",
    btn: "Continuă",
  },
  catalog: {
    title: "Creează cont gratuit",
    sub: "Completează datele pentru a vedea prețurile și a comanda direct",
    btn: "Vezi pachetele",
  },
  default: {
    title: "Creează cont gratuit",
    sub: "Completează datele de contact pentru a continua",
    btn: "Continuă",
  },
};

export default function LeadCaptureStep({ onDone, source }) {
  const { register, isAuthenticated, user } = useAuth();
  const [f, sF] = useState({ name: "", email: "", phone: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => sF(s => ({ ...s, [k]: v }));
  const copy = COPY[source] || COPY.default;

  if (isAuthenticated && user) {
    if (onDone) onDone(user);
    return null;
  }

  const canSubmit = f.name.trim() && f.email.trim() && f.phone.trim();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canSubmit) return;
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(f.email)) { setErr("Email invalid"); return; }
    if (f.phone.replace(/\D/g, "").length < 10) { setErr("Telefon invalid"); return; }
    setLoading(true); setErr("");
    const u = await register({ ...f, source: source || "consult" });
    setLoading(false);
    if (onDone) onDone(u);
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{copy.title}</h3>
        <p className="text-sm text-slate-500 mt-1">{copy.sub}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nume *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" value={f.name} onChange={e => set("name", e.target.value)} placeholder="Numele tău" autoFocus />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="email@firma.ro" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefon *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Firmă <span className="font-normal normal-case tracking-normal">(opțional)</span></label>
          <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" value={f.company} onChange={e => set("company", e.target.value)} placeholder="Numele firmei" />
        </div>

        {err && <p className="text-xs text-[#e30613] font-semibold">{err}</p>}

        <button type="submit" disabled={!canSubmit || loading} className="w-full py-4 bg-[#e30613] text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 uppercase text-xs tracking-widest mt-2">
          {loading ? "Se salvează..." : copy.btn}
        </button>
      </form>

      <p className="text-[10px] text-slate-400 text-center mt-4 flex items-center justify-center gap-1.5">
        <i className="fas fa-lock text-[8px]"></i> Nu trimitem spam. Datele tale sunt în siguranță.
      </p>
    </div>
  );
}
