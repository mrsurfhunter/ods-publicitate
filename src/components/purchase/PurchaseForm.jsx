import { useState } from "react";
import { gid, sld, ssv } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../shared/Toast";
import { saveOrderToServer } from "../../utils/orders";
import CUILookup from "./CUILookup";

export default function PurchaseForm({ pkg, onClose, onDone }) {
  const { user } = useAuth();
  const toast = useToast();
  const [pay, setPay] = useState("proforma");
  const [submitting, setSubmitting] = useState(false);
  const [f, sF] = useState({
    name: user?.name || "", company: user?.company || "",
    cui: "", address: "", phone: user?.phone || "", email: user?.email || "",
    sub: false,
  });
  const set = (k, v) => sF(s => ({ ...s, [k]: v }));

  const price = f.sub && pkg.sub ? pkg.sub : pkg.price;
  const tva = Math.round(price * 0.19);
  const total = price + tva;
  const canSubmit = f.name && f.phone && f.email && !submitting;

  const hCUI = d => sF(s => ({ ...s, company: d.company || s.company, address: d.address || s.address }));

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const order = {
      id: gid(), ...f, packageId: pkg.id, packageName: pkg.name, price, payMethod: pay,
      date: new Date().toISOString(), subscription: f.sub,
      status: "paid", contentChoice: null, articleTitle: "", articleText: "",
      featuredImg: null, gallery: [], reposts: [], wpDraftId: null, wpDraftUrl: null,
      stats: { views: 0, clicks: 0, shares: 0, fbReach: 0, igReach: 0 },
    };
    const ex = await sld("ods-orders", []);
    await ssv("ods-orders", [order, ...ex]);
    await saveOrderToServer(order);
    toast("Comanda a fost plasată cu succes!", "success");
    setSubmitting(false);
    onDone(order);
  };

  return (
    <div className="border-t border-slate-100 p-4 sm:p-6 md:p-8 space-y-4">
      <CUILookup value={f.cui} onChange={v => set("cui", v)} onData={hCUI} />

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Companie</label>
        <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 outline-none text-sm font-medium" value={f.company} onChange={e => set("company", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nume *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 outline-none text-sm font-medium" value={f.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefon *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 outline-none text-sm font-medium" value={f.phone} onChange={e => set("phone", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email *</label>
        <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 outline-none text-sm font-medium" value={f.email} onChange={e => set("email", e.target.value)} />
      </div>

      {pkg.sub && (
        <button className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors" onClick={() => set("sub", !f.sub)}>
          {f.sub
            ? `✓ Abonament: ${pkg.sub.toLocaleString("ro")} lei/lună`
            : `→ Economisești ${((pkg.price - pkg.sub) * 3).toLocaleString("ro")} lei la abonament`}
        </button>
      )}

      <div className="space-y-2 pt-2">
        {[{ id: "proforma", l: "Transfer bancar (proformă)", icon: "fas fa-university" }, { id: "card", l: "Plată cu cardul", icon: "fas fa-credit-card" }].map(m => (
          <label key={m.id} className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${pay === m.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'}`}>
            <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id)} className="accent-blue-600" />
            <i className={`${m.icon} text-sm ${pay === m.id ? 'text-blue-600' : 'text-slate-400'}`}></i>
            <span className="text-sm font-semibold text-slate-700">{m.l}</span>
          </label>
        ))}
      </div>

      <div className="bg-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 border-2 border-slate-700">
        <div className="text-center sm:text-left">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Total:</div>
          <div className="text-2xl font-black text-white">{total.toLocaleString("ro")} lei</div>
        </div>
        <button className="w-full sm:w-auto px-8 py-3.5 bg-[#e30613] text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 border-2 border-red-700" onClick={submit} disabled={!canSubmit}>
          {submitting ? <i className="fas fa-spinner animate-spin"></i> : pay === "card" ? "Plătește" : "Cumpără"}
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center font-medium">
        După plată primești dashboard-ul cu următorii pași.
      </p>

      <button className="w-full py-3 text-sm font-semibold text-slate-400 border-2 border-slate-200 hover:bg-slate-50 transition-all" onClick={onClose}>
        Anulează
      </button>
    </div>
  );
}
