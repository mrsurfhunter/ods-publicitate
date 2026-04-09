import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LeadCaptureStep({ onDone, source }) {
  const { register, isAuthenticated, user } = useAuth();
  const [f, sF] = useState({ name: "", email: "", phone: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => sF(s => ({ ...s, [k]: v }));

  // Skip if already authenticated
  if (isAuthenticated && user) {
    if (onDone) onDone(user);
    return null;
  }

  const canSubmit = f.name.trim() && f.email.trim() && f.phone.trim();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canSubmit) return;
    if (!/\S+@\S+\.\S+/.test(f.email)) { setErr("Email invalid"); return; }
    if (f.phone.replace(/\D/g, "").length < 10) { setErr("Telefon invalid"); return; }
    setLoading(true); setErr("");
    const u = await register({ ...f, source: source || "consult" });
    setLoading(false);
    if (onDone) onDone(u);
  };

  return (
    <div className="lead-capture fade-up">
      <div className="lead-capture-title">Ca sa-ti cream recomandarea personalizata</div>
      <div className="lead-capture-sub">Spune-ne cum te gasim si primesti instant analiza completa</div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="form-row" style={{ margin: 0 }}>
          <label className="label">Nume *</label>
          <input className="input" value={f.name} onChange={e => set("name", e.target.value)} placeholder="Numele tau" autoFocus />
        </div>
        <div className="form-row" style={{ margin: 0 }}>
          <label className="label">Email *</label>
          <input className="input" type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="email@firma.ro" />
        </div>
        <div className="form-row" style={{ margin: 0 }}>
          <label className="label">Telefon *</label>
          <input className="input" value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="07xx xxx xxx" />
        </div>
        <div className="form-row" style={{ margin: 0 }}>
          <label className="label">Firma <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input className="input" value={f.company} onChange={e => set("company", e.target.value)} placeholder="Numele firmei" />
        </div>

        {err && <div style={{ fontSize: 12, color: "var(--c-red)", fontWeight: 600 }}>{err}</div>}

        <button className="btn btn-primary btn-block" type="submit" disabled={!canSubmit || loading} style={{ marginTop: 4 }}>
          {loading ? "Se salveaza..." : "Continua"}
        </button>
      </form>

      <div className="lead-capture-privacy">
        <span>🔒</span> Nu trimitem spam. Datele tale sunt in siguranta.
      </div>
    </div>
  );
}
