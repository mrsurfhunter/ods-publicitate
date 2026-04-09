import { useState } from "react";
import { lookupCUI } from "../../utils/anaf";

export default function CUILookup({ value, onChange, onData }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const go = async () => {
    if (!value || value.replace(/\D/g, "").length < 2) return;
    setLoading(true); setStatus(null);
    const d = await lookupCUI(value);
    setLoading(false);
    if (d) { setStatus("ok"); onData(d); }
    else setStatus("err");
  };

  return (
    <div className="form-row">
      <label className="label">CUI / Cod Fiscal</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          value={value}
          onChange={e => { onChange(e.target.value); setStatus(null); }}
          placeholder="ex: 39899930"
          onKeyDown={e => e.key === "Enter" && go()}
        />
        <button className="btn btn-dark btn-sm" onClick={go} disabled={loading} style={{ whiteSpace: "nowrap" }}>
          {loading ? "..." : "ANAF"}
        </button>
      </div>
      {status === "ok" && <div style={{ fontSize: 12, color: 'var(--c-success)', marginTop: 4, fontWeight: 600 }}>✓ Date preluate</div>}
      {status === "err" && <div style={{ fontSize: 12, color: 'var(--c-red)', marginTop: 4 }}>CUI negasit</div>}
    </div>
  );
}
