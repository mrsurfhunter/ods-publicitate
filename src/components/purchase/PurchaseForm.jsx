import { useState } from "react";
import { gid, sld, ssv } from "../../utils/storage";
import CUILookup from "./CUILookup";

export default function PurchaseForm({ pkg, onClose, onDone }) {
  const [pay, setPay] = useState("proforma");
  const [f, sF] = useState({ name: "", company: "", cui: "", address: "", phone: "", email: "", sub: false });
  const set = (k, v) => sF(s => ({ ...s, [k]: v }));

  const price = f.sub && pkg.sub ? pkg.sub : pkg.price;
  const tva = Math.round(price * 0.19);
  const total = price + tva;
  const canSubmit = f.name && f.phone && f.email;

  const hCUI = d => sF(s => ({ ...s, company: d.company || s.company, address: d.address || s.address }));

  const submit = async () => {
    if (!canSubmit) return;
    const order = {
      id: gid(), ...f, packageId: pkg.id, packageName: pkg.name, price, payMethod: pay,
      date: new Date().toISOString(), subscription: f.sub,
      status: "paid", contentChoice: null, articleTitle: "", articleText: "",
      featuredImg: null, gallery: [], reposts: [], wpDraftId: null, wpDraftUrl: null,
      stats: { views: 0, clicks: 0, shares: 0, fbReach: 0, igReach: 0 },
    };
    const ex = await sld("ods-orders", []);
    await ssv("ods-orders", [order, ...ex]);
    onDone(order);
  };

  return (
    <div className="purchase-form" style={{ borderTop: '1px solid var(--c-border)' }}>
      <CUILookup value={f.cui} onChange={v => set("cui", v)} onData={hCUI} />

      <div className="form-row">
        <label className="label">Companie</label>
        <input className="input" value={f.company} onChange={e => set("company", e.target.value)} />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label className="label">Nume *</label>
          <input className="input" value={f.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="form-row">
          <label className="label">Telefon *</label>
          <input className="input" value={f.phone} onChange={e => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <label className="label">Email * (primesti accesul la dashboard)</label>
        <input className="input" value={f.email} onChange={e => set("email", e.target.value)} />
      </div>

      {pkg.sub && (
        <div className="sub-toggle" onClick={() => set("sub", !f.sub)}>
          {f.sub
            ? `✓ Abonament: ${pkg.sub.toLocaleString("ro")} lei/luna`
            : `→ Economisesti ${((pkg.price - pkg.sub) * 3).toLocaleString("ro")} lei la abonament`}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {[{ id: "proforma", l: "Transfer bancar (proforma)" }, { id: "card", l: "Plata cu cardul" }].map(m => (
          <label key={m.id} className={`payment-option ${pay === m.id ? 'active' : ''}`}>
            <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id)} style={{ accentColor: 'var(--c-blue)' }} />
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--c-navy)' }}>{m.l}</span>
          </label>
        ))}
      </div>

      <div className="purchase-total">
        <div>
          <div className="purchase-total-label">Total:</div>
          <div className="purchase-total-amount">{total.toLocaleString("ro")} lei</div>
        </div>
        <button className="btn btn-primary" onClick={submit} disabled={!canSubmit}>
          {pay === "card" ? "Plateste" : "Cumpara"}
        </button>
      </div>

      <div style={{ fontSize: 11, color: 'var(--c-muted)', textAlign: 'center', marginTop: 8 }}>
        Dupa plata primesti dashboard-ul cu urmatorii pasi.
      </div>

      <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }} onClick={onClose}>Anuleaza</button>
    </div>
  );
}
