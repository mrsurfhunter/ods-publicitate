import { useState, useEffect } from "react";
import { gid, sld, ssv } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";
import { useToast } from "../shared/Toast";
import { saveOrderToServer } from "../../utils/orders";
import { getAddonUnitPrice } from "../../data/packages";
import CUILookup from "./CUILookup";

export default function PurchaseForm({ pkg, suggestedAddons = [], onClose, onDone }) {
  const { user } = useAuth();
  const { addons: allAddons } = useConfig();
  const toast = useToast();
  const [pay, setPay] = useState("proforma");
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [f, sF] = useState({
    name: user?.name || "", company: user?.company || "",
    cui: "", address: "", phone: user?.phone || "", email: user?.email || "",
    sub: false,
  });
  const set = (k, v) => sF(s => ({ ...s, [k]: v }));

  useEffect(() => {
    if (suggestedAddons.length > 0) {
      const initial = {};
      suggestedAddons.forEach(id => { initial[id] = 1; });
      setSelectedAddons(initial);
    }
  }, []);

  const activeAddons = allAddons.filter(a => a.active !== false);

  const addonTotal = Object.entries(selectedAddons).reduce((sum, [id, qty]) => {
    if (qty <= 0) return sum;
    const addon = activeAddons.find(a => a.id === id);
    if (!addon) return sum;
    return sum + getAddonUnitPrice(addon, qty) * qty;
  }, 0);

  const basePrice = f.sub && pkg.sub ? pkg.sub : pkg.price;
  const subtotal = basePrice + addonTotal;
  const tva = Math.round(subtotal * 0.19);
  const total = subtotal + tva;
  const canSubmit = f.name && f.phone && f.email && !submitting;

  const hCUI = d => sF(s => ({ ...s, company: d.company || s.company, address: d.address || s.address }));

  const setAddonQty = (id, delta) => {
    const addon = activeAddons.find(a => a.id === id);
    if (!addon) return;
    setSelectedAddons(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      if (!addon.multi && next > 1) return { ...prev, [id]: 1 };
      return { ...prev, [id]: next };
    });
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    const orderAddons = Object.entries(selectedAddons)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const addon = activeAddons.find(a => a.id === id);
        return {
          id, name: addon?.name || id, qty,
          unitPrice: addon ? getAddonUnitPrice(addon, qty) : 0,
        };
      });

    const order = {
      id: gid(), ...f, packageId: pkg.id, packageName: pkg.name,
      price: basePrice, addons: orderAddons, addonTotal,
      totalBeforeTax: subtotal, tva, total,
      payMethod: pay, date: new Date().toISOString(), subscription: f.sub,
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
    <div className="border-t-2 border-slate-100 p-4 sm:p-6 md:p-8 space-y-4">
      <CUILookup value={f.cui} onChange={v => set("cui", v)} onData={hCUI} />

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Companie</label>
        <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium" value={f.company} onChange={e => set("company", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nume *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium" value={f.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefon *</label>
          <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium" value={f.phone} onChange={e => set("phone", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email *</label>
        <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium" value={f.email} onChange={e => set("email", e.target.value)} />
      </div>

      {pkg.sub && (
        <button className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors" onClick={() => set("sub", !f.sub)}>
          {f.sub
            ? `✓ Abonament: ${pkg.sub.toLocaleString("ro")} lei/lună`
            : `→ Economisești ${((pkg.price - pkg.sub) * 3).toLocaleString("ro")} lei la abonament`}
        </button>
      )}

      {/* ADD-ONS SECTION */}
      {activeAddons.length > 0 && (
        <div className="border-2 border-slate-200 bg-slate-50">
          <div className="px-4 py-3 bg-white border-b-2 border-slate-200">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adaugă extra</div>
          </div>
          <div className="p-3 space-y-2">
            {activeAddons.map(addon => {
              const qty = selectedAddons[addon.id] || 0;
              const unitPrice = getAddonUnitPrice(addon, Math.max(qty, 1));
              const isSelected = qty > 0;

              return (
                <div key={addon.id} className={`flex items-center gap-3 p-3 transition-all ${isSelected ? 'bg-white border-2 border-brand/30' : 'bg-white border-2 border-transparent hover:border-slate-200'}`}>
                  <div className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${addon.icon} text-xs`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{addon.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {unitPrice.toLocaleString("ro")} lei{addon.unit}
                      {addon.qtyPricing && qty >= 2 && (
                        <span className="ml-1 text-green-600 font-bold">(-{Math.round((1 - unitPrice / addon.price) * 100)}%)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {addon.multi && isSelected ? (
                      <>
                        <button onClick={() => setAddonQty(addon.id, -1)} className="w-7 h-7 bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold hover:bg-slate-300">−</button>
                        <span className="w-7 text-center text-sm font-black text-slate-900">{qty}</span>
                        <button onClick={() => setAddonQty(addon.id, 1)} className="w-7 h-7 bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold hover:bg-slate-300">+</button>
                      </>
                    ) : isSelected ? (
                      <button onClick={() => setAddonQty(addon.id, -1)} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-wider">Elimină</button>
                    ) : (
                      <button onClick={() => setAddonQty(addon.id, 1)} className="text-[10px] font-black text-brand hover:text-brand-dark uppercase tracking-wider">Adaugă</button>
                    )}
                  </div>
                  {isSelected && (
                    <div className="text-sm font-black text-slate-900 w-16 text-right flex-shrink-0">
                      {(getAddonUnitPrice(addon, qty) * qty).toLocaleString("ro")} lei
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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

      <div className="bg-slate-900 p-4 sm:p-5 mt-4 border-2 border-slate-900">
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Pachet: {pkg.name}</span>
            <span>{basePrice.toLocaleString("ro")} lei</span>
          </div>
          {Object.entries(selectedAddons).filter(([, q]) => q > 0).map(([id, qty]) => {
            const addon = activeAddons.find(a => a.id === id);
            if (!addon) return null;
            const up = getAddonUnitPrice(addon, qty);
            return (
              <div key={id} className="flex justify-between text-xs text-slate-400">
                <span>{addon.name} ×{qty}</span>
                <span>{(up * qty).toLocaleString("ro")} lei</span>
              </div>
            );
          })}
          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-700">
            <span>TVA (19%)</span>
            <span>{tva.toLocaleString("ro")} lei</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Total:</div>
            <div className="text-2xl font-black text-white">{total.toLocaleString("ro")} lei</div>
          </div>
          <button className="w-full sm:w-auto px-8 py-3.5 bg-brand text-white font-black uppercase text-xs tracking-widest hover:bg-brand-dark transition-all disabled:opacity-50 border-2 border-brand" onClick={submit} disabled={!canSubmit}>
            {submitting ? <i className="fas fa-spinner animate-spin"></i> : pay === "card" ? "Plătește" : "Cumpără"}
          </button>
        </div>
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
