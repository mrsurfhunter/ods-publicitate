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
    name: user?.name || "", company: user?.company || "",
    cui: "", phone: user?.phone || "", email: user?.email || "",
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
      packageName: "Anunț: " + ad.cat.label + " (" + ad.days + "z)",
      price: ad.pr.total, payMethod: pay, date: new Date().toISOString(),
      isAnunt: true, anuntText: ad.text, anuntDays: ad.days, anuntWords: ad.words,
      anuntCategory: ad.cat.id, verified: true, converted: false,
    };
    const ex = await sld("ods-orders", []); await ssv("ods-orders", [order, ...ex]);
    await saveOrderToServer(order);

    if (!isAuthenticated && f.name && f.email) {
      register({ name: f.name, email: f.email, phone: f.phone, company: f.company, source: "anunturi" });
    } else if (isAuthenticated) {
      postLead({ ...user, source: "anunturi", converted: true });
    }

    toast("Anunțul a fost înregistrat cu succes!", "success");
    setStep(3);
  };

  return (
    <div className="fixed inset-0 bg-navy/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-3" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
        {step === 3 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <i className="fas fa-check text-2xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Anunț verificat și înregistrat!</h3>
            <p className="text-sm text-slate-500">Va fi publicat în max 24h de la confirmarea plății.</p>
            <button className="mt-6 px-8 py-3.5 bg-[#e30613] text-white font-black rounded-2xl hover:bg-red-700 transition-all uppercase text-xs tracking-widest" onClick={onClose}>Închide</button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-5">{ad.cat.icon} {ad.cat.label}</h3>

            {step === 1 && (
              <div className="space-y-4">
                <CUILookup value={f.cui} onChange={val => set("cui", val)} onData={hCUI} />
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Companie / Persoană</label>
                  <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" value={f.company} onChange={e => set("company", e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nume *</label>
                    <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" value={f.name} onChange={e => set("name", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefon *</label>
                    <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium" value={f.phone} onChange={e => set("phone", e.target.value)} />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 space-y-3">
                  <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Verificare identitate</div>
                  <label className="flex gap-2.5 cursor-pointer text-xs text-slate-700 font-medium">
                    <input type="checkbox" checked={v.accurate} onChange={e => sV(x => ({ ...x, accurate: e.target.checked }))} className="accent-blue-600 mt-0.5" />
                    Declar că informațiile sunt reale și corecte.
                  </label>
                  <label className="flex gap-2.5 cursor-pointer text-xs text-slate-700 font-medium">
                    <input type="checkbox" checked={v.terms} onChange={e => sV(x => ({ ...x, terms: e.target.checked }))} className="accent-blue-600 mt-0.5" />
                    Accept termenii și condițiile ODS SRL.
                  </label>
                  <div className="border-t border-blue-200 pt-3">
                    <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">Verificare telefon (SMS)</div>
                    {!v.ok ? (
                      <div className="flex gap-2">
                        {!v.sent
                          ? <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50" onClick={sendCode} disabled={!f.phone || f.phone.replace(/\D/g, "").length < 10}>Trimite cod</button>
                          : <>
                            <input className="w-24 p-3 bg-white border-2 border-blue-200 rounded-xl outline-none text-center text-base font-black tracking-[4px]" value={v.code} onChange={e => sV(x => ({ ...x, code: e.target.value }))} maxLength={4} placeholder="····" />
                            <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all" onClick={() => sV(x => ({ ...x, ok: x.code === x.real }))}>OK</button>
                          </>
                        }
                      </div>
                    ) : <p className="text-xs text-green-600 font-bold flex items-center gap-1"><i className="fas fa-check"></i> Verificat</p>}
                  </div>
                </div>

                <button className="w-full py-4 bg-[#e30613] text-white font-black rounded-2xl hover:bg-red-700 transition-all uppercase text-xs tracking-widest disabled:opacity-50 shadow-lg shadow-red-500/20" onClick={() => { if (canGo) setStep(2); }} disabled={!canGo}>
                  Continuă
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 italic line-clamp-3">{ad.text.substring(0, 200)}{ad.text.length > 200 ? "..." : ""}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                    <span className="text-xs text-slate-400">{ad.words} cuv × {ad.days} zile</span>
                    <span className="text-xl font-black text-slate-900">{total.toLocaleString("ro")} lei</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[{ id: "proforma", l: "Transfer bancar", icon: "fas fa-university" }, { id: "card", l: "Plată cu cardul", icon: "fas fa-credit-card" }].map(m => (
                    <label key={m.id} className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${pay === m.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border-2 border-transparent'}`}>
                      <input type="radio" name="p" checked={pay === m.id} onChange={() => setPay(m.id)} className="accent-blue-600" />
                      <i className={`${m.icon} text-sm ${pay === m.id ? 'text-blue-600' : 'text-slate-400'}`}></i>
                      <span className="text-sm font-semibold text-slate-700">{m.l}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-3.5 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm" onClick={() => setStep(1)}>Înapoi</button>
                  <button className="flex-[2] py-3.5 bg-[#e30613] text-white font-black rounded-2xl hover:bg-red-700 transition-all uppercase text-xs tracking-widest shadow-lg shadow-red-500/20" onClick={submit}>Confirmă</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
