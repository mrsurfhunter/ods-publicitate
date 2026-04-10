import { useState } from "react";
import { gid, sld, ssv } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";
import { postLead } from "../../utils/leads";
import { useToast } from "../shared/Toast";
import { saveOrderToServer } from "../../utils/orders";
import CUILookup from "../purchase/CUILookup";

export default function AdCheckout({ ad, onClose }) {
  const { user, register, isAuthenticated } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState("proforma");
  const [f, sF] = useState({
    name: user?.name || "",
    company: user?.company || "",
    cui: "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [v, sV] = useState({ terms: false, accurate: false, sent: false, code: "", real: "", ok: false });
  const set = (k, val) => sF(s => ({ ...s, [k]: val }));
  const tva = Math.round(ad.pr.total * 0.19), total = ad.pr.total + tva;
  const hCUI = d => sF(s => ({ ...s, company: d.company || s.company }));
  const sendCode = () => { const c = String(Math.floor(1000 + Math.random() * 9000)); sV(x => ({ ...x, sent: true, real: c })); alert("DEMO: Codul SMS este " + c); };
  const canGo = v.terms && v.accurate && v.ok && f.name && f.phone;

  const submit = async () => {
    if (!canGo) return;
    const order = {
      id: gid(), ...f, packageId: "anunt-" + ad.cat.id,
      packageName: "Anun\u021b: " + ad.cat.label + " (" + ad.days + "z)",
      price: ad.pr.total, payMethod: pay, date: new Date().toISOString(),
      isAnunt: true, anuntText: ad.text, anuntDays: ad.days, anuntWords: ad.words,
      anuntCategory: ad.cat.id,
      verified: true, converted: false,
    };
    const ex = await sld("ods-orders", []); await ssv("ods-orders", [order, ...ex]);
    // Persist to server
    await saveOrderToServer(order);

    // Save as lead if not already authenticated
    if (!isAuthenticated && f.name && f.email) {
      register({ name: f.name, email: f.email, phone: f.phone, company: f.company, source: "anunturi" });
    } else if (isAuthenticated) {
      postLead({ ...user, source: "anunturi", converted: true });
    }

    toast("Anun\u021bul a fost \u00eenregistrat cu succes!", "success");
    setStep(3);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,48,191,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 12, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="card card-static" style={{ width: '100%', maxWidth: 500, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {step === 3 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'var(--c-success-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 28, color: 'var(--c-success)' }}>\u2713</div>
            <h3 className="heading-md" style={{ color: 'var(--c-primary)', marginBottom: 8 }}>Anun\u021b verificat \u0219i \u00eenregistrat!</h3>
            <p className="text-sm text-muted">Va fi publicat \u00een max 24h de la confirmarea pl\u0103\u021bii.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onClose}>\u00cenchide</button>
          </div>
        ) : (
          <div className="card-padding">
            <h3 className="heading-md" style={{ color: 'var(--c-primary)', marginBottom: 14 }}>{ad.cat.icon} {ad.cat.label}</h3>

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <CUILookup value={f.cui} onChange={val => set("cui", val)} onData={hCUI} />
                <div className="form-row" style={{ margin: 0 }}><label className="label">Companie / Persoan\u0103</label><input className="input" value={f.company} onChange={e => set("company", e.target.value)} /></div>
                <div className="form-grid">
                  <div className="form-row" style={{ margin: 0 }}><label className="label">Nume *</label><input className="input" value={f.name} onChange={e => set("name", e.target.value)} /></div>
                  <div className="form-row" style={{ margin: 0 }}><label className="label">Telefon *</label><input className="input" value={f.phone} onChange={e => set("phone", e.target.value)} /></div>
                </div>

                <div style={{ background: 'var(--c-primary-light)', borderRadius: 'var(--radius-sm)', padding: 14, border: '1px solid rgba(0,48,191,0.1)' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 800, color: 'var(--c-primary)', marginBottom: 8 }}>Verificare identitate</div>
                  <label style={{ display: 'flex', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 12, color: 'var(--c-text)' }}>
                    <input type="checkbox" checked={v.accurate} onChange={e => sV(x => ({ ...x, accurate: e.target.checked }))} style={{ accentColor: 'var(--c-primary)', marginTop: 2 }} />
                    Declar c\u0103 informa\u021biile sunt reale \u0219i corecte.
                  </label>
                  <label style={{ display: 'flex', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 12, color: 'var(--c-text)' }}>
                    <input type="checkbox" checked={v.terms} onChange={e => sV(x => ({ ...x, terms: e.target.checked }))} style={{ accentColor: 'var(--c-primary)', marginTop: 2 }} />
                    Accept termenii \u0219i condi\u021biile ODS SRL.
                  </label>
                  <div style={{ borderTop: '1px solid rgba(0,48,191,0.1)', paddingTop: 8 }}>
                    <div className="text-xs" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--c-primary)', marginBottom: 4 }}>Verificare telefon (SMS)</div>
                    {!v.ok ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!v.sent
                          ? <button className="btn btn-dark btn-sm" onClick={sendCode} disabled={!f.phone || f.phone.replace(/\D/g, "").length < 10}>Trimite cod</button>
                          : <>
                            <input className="input" value={v.code} onChange={e => sV(x => ({ ...x, code: e.target.value }))} maxLength={4} placeholder="Cod" style={{ width: 100, textAlign: 'center', fontSize: 16, fontWeight: 700, letterSpacing: 4 }} />
                            <button className="btn btn-dark btn-sm" onClick={() => sV(x => ({ ...x, ok: x.code === x.real }))}>OK</button>
                          </>
                        }
                      </div>
                    ) : <div className="text-xs" style={{ color: 'var(--c-success)', fontWeight: 700 }}>\u2713 Verificat</div>}
                  </div>
                </div>

                <button className="btn btn-primary btn-block" onClick={() => { if (canGo) setStep(2); }} disabled={!canGo}>Continu\u0103</button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'var(--c-bg)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                  <div className="text-xs text-muted" style={{ fontStyle: 'italic', maxHeight: 50, overflowY: 'auto' }}>{ad.text.substring(0, 200)}{ad.text.length > 200 ? "..." : ""}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span className="text-xs text-muted">{ad.words} cuv x {ad.days} zile</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: 'var(--c-accent)' }}>{total.toLocaleString("ro")} lei</span>
                  </div>
                </div>
                {[{ id: "proforma", l: "Transfer bancar" }, { id: "card", l: "Plat\u0103 cu cardul" }].map(m => (
                  <label key={m.id} className={`payment-option ${pay === m.id ? 'active' : ''}`}>
                    <input type="radio" name="p" checked={pay === m.id} onChange={() => setPay(m.id)} />
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, color: 'var(--c-text)' }}>{m.l}</span>
                  </label>
                ))}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>Înapoi</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={submit}>Confirm\u0103</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
