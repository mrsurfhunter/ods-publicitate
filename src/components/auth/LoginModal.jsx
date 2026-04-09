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

    // Try localStorage first
    const local = await login(email.trim().toLowerCase());
    if (local) {
      setLoading(false);
      if (onLoggedIn) onLoggedIn(local);
      onClose();
      return;
    }

    // Try server
    const server = await checkLead(email.trim().toLowerCase());
    if (server?.exists) {
      setErr("Contul exista pe server, dar nu in acest browser. Te rugam sa incepi o consultare noua.");
    } else {
      setErr("Nu am gasit acest email. Incepe o consultare noua pentru a crea un cont.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h3 className="heading-md" style={{ color: "var(--c-primary)", marginBottom: 6 }}>Bine ai revenit!</h3>
          <p className="text-sm text-secondary">Introdu emailul cu care te-ai inregistrat</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="form-row" style={{ margin: 0 }}>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErr(""); }}
              placeholder="email@firma.ro"
              autoFocus
            />
          </div>

          {err && <div style={{ fontSize: 12, color: "var(--c-accent)", fontWeight: 600, lineHeight: 1.4 }}>{err}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={!email.trim() || loading}>
            {loading ? "Se verifica..." : "Intra in cont"}
          </button>
        </form>
      </div>
    </div>
  );
}
