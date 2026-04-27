import { useState, useEffect, useCallback } from "react";

function AdminAuth({ onAuth }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const tryAuth = async () => {
    try {
      const r = await fetch("/api/admin/config", { headers: { "x-admin-key": pw } });
      if (r.ok) {
        localStorage.setItem("ods-admin-key", pw);
        onAuth(pw);
      } else {
        setErr(true);
      }
    } catch { setErr(true); }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-200 p-8 max-w-sm w-full">
        <h1 className="text-xl font-black text-slate-900 mb-1">Admin Panel</h1>
        <p className="text-sm text-slate-500 mb-6">Ora de Sibiu — Publicitate</p>
        <input
          type="password"
          className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm font-medium mb-3"
          placeholder="Parolă admin"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && tryAuth()}
        />
        {err && <p className="text-sm text-red-500 font-bold mb-3">Parolă incorectă</p>}
        <button onClick={tryAuth} className="w-full bg-slate-900 text-white font-bold py-3 text-sm uppercase tracking-wider border-2 border-slate-900 hover:bg-black">
          Autentificare
        </button>
      </div>
    </div>
  );
}

function PackageEditor({ packages, adminKey, onSave }) {
  const [pkgs, setPkgs] = useState(packages);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setPkgs(packages); }, [packages]);

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ packages: pkgs }),
      });
      if (r.ok) { onSave(); setEditing(null); }
    } catch {}
    setSaving(false);
  };

  const updatePkg = (idx, field, value) => {
    setPkgs(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const updateInc = (pkgIdx, incIdx, field, value) => {
    setPkgs(prev => prev.map((p, i) => {
      if (i !== pkgIdx) return p;
      const inc = [...p.inc];
      inc[incIdx] = { ...inc[incIdx], [field]: value };
      return { ...p, inc };
    }));
  };

  const addInc = (pkgIdx) => {
    setPkgs(prev => prev.map((p, i) => i === pkgIdx ? { ...p, inc: [...p.inc, { w: "", d: "" }] } : p));
  };

  const removeInc = (pkgIdx, incIdx) => {
    setPkgs(prev => prev.map((p, i) => i === pkgIdx ? { ...p, inc: p.inc.filter((_, j) => j !== incIdx) } : p));
  };

  const addPackage = () => {
    const id = "pkg-" + Date.now().toString(36);
    setPkgs(prev => [...prev, {
      id, name: "Pachet Nou", cat: "monthly", price: 1000, sub: null,
      color: "#3B82F6", headline: "", inc: [{ w: "", d: "" }],
      delivery: "5 zile lucrătoare", hasArticle: false, active: true,
    }]);
    setEditing(pkgs.length);
  };

  const removePkg = (idx) => {
    if (confirm("Sigur vrei să ștergi pachetul " + pkgs[idx].name + "?")) {
      setPkgs(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const movePkg = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= pkgs.length) return;
    setPkgs(prev => {
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-900">{pkgs.length} pachete</h2>
        <div className="flex gap-2">
          <button onClick={addPackage} className="px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider border-2 border-brand hover:bg-brand-dark">
            <i className="fas fa-plus mr-1"></i> Adaugă
          </button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider border-2 border-green-600 hover:bg-green-700 disabled:opacity-50">
            {saving ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-save mr-1"></i> Salvează</>}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {pkgs.map((pkg, idx) => (
          <div key={pkg.id} className={`border-2 ${editing === idx ? 'border-brand' : 'border-slate-200'} bg-white`}>
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setEditing(editing === idx ? null : idx)}>
              <div className="flex flex-col gap-0.5">
                <button onClick={e => { e.stopPropagation(); movePkg(idx, -1); }} className="text-slate-400 hover:text-slate-700 text-[10px]"><i className="fas fa-chevron-up"></i></button>
                <button onClick={e => { e.stopPropagation(); movePkg(idx, 1); }} className="text-slate-400 hover:text-slate-700 text-[10px]"><i className="fas fa-chevron-down"></i></button>
              </div>
              <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: pkg.color }}></div>
              <div className="flex-1">
                <span className="font-bold text-slate-900">{pkg.name}</span>
                <span className="text-sm text-slate-400 ml-2">{pkg.id}</span>
              </div>
              <span className="text-sm font-black text-slate-900">{pkg.price.toLocaleString("ro")} lei</span>
              {pkg.sub && <span className="text-xs text-green-600 font-bold">(sub: {pkg.sub.toLocaleString("ro")})</span>}
              <span className={`text-[10px] font-bold uppercase ${pkg.active !== false ? 'text-green-600' : 'text-red-500'}`}>
                {pkg.active !== false ? 'Activ' : 'Inactiv'}
              </span>
              {pkg.pop && <span className="text-[10px] font-bold text-amber-600 uppercase">Popular</span>}
              <i className={`fas ${editing === idx ? 'fa-chevron-up' : 'fa-chevron-down'} text-slate-400`}></i>
            </div>

            {editing === idx && (
              <div className="border-t-2 border-slate-100 p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">ID</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm font-mono" value={pkg.id} onChange={e => updatePkg(idx, 'id', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Nume</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={pkg.name} onChange={e => updatePkg(idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Preț</label>
                    <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={pkg.price} onChange={e => updatePkg(idx, 'price', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Preț abonament</label>
                    <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={pkg.sub || ''} onChange={e => updatePkg(idx, 'sub', e.target.value ? Number(e.target.value) : null)} placeholder="null" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Categorie</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={pkg.cat} onChange={e => updatePkg(idx, 'cat', e.target.value)}>
                      <option value="monthly">Lunar</option>
                      <option value="oneTime">O dată</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Culoare</label>
                    <input type="color" className="w-full h-9 border border-slate-200" value={pkg.color} onChange={e => updatePkg(idx, 'color', e.target.value)} />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={pkg.active !== false} onChange={e => updatePkg(idx, 'active', e.target.checked)} />
                      <span className="font-bold">Activ</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!pkg.pop} onChange={e => updatePkg(idx, 'pop', e.target.checked || undefined)} />
                      <span className="font-bold">Popular</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!pkg.hasArticle} onChange={e => updatePkg(idx, 'hasArticle', e.target.checked)} />
                      <span className="font-bold">Articol</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Headline</label>
                  <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={pkg.headline} onChange={e => updatePkg(idx, 'headline', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Livrare</label>
                  <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={pkg.delivery} onChange={e => updatePkg(idx, 'delivery', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Ce include</label>
                  {pkg.inc.map((row, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className="flex-1 p-2 bg-slate-50 border border-slate-200 text-sm" placeholder="Ce include" value={row.w} onChange={e => updateInc(idx, i, 'w', e.target.value)} />
                      <input className="flex-1 p-2 bg-slate-50 border border-slate-200 text-sm" placeholder="Detaliu" value={row.d} onChange={e => updateInc(idx, i, 'd', e.target.value)} />
                      <button onClick={() => removeInc(idx, i)} className="text-red-400 hover:text-red-600 px-2"><i className="fas fa-times"></i></button>
                    </div>
                  ))}
                  <button onClick={() => addInc(idx)} className="text-xs font-bold text-brand hover:underline">+ Adaugă rând</button>
                </div>
                <button onClick={() => removePkg(idx)} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider">
                  <i className="fas fa-trash mr-1"></i> Șterge pachet
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddonEditor({ addons, adminKey, onSave }) {
  const [items, setItems] = useState(addons);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setItems(addons); }, [addons]);

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/addons", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ addons: items }),
      });
      if (r.ok) { onSave(); setEditing(null); }
    } catch {}
    setSaving(false);
  };

  const update = (idx, field, value) => {
    setItems(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  const addAddon = () => {
    const id = "addon-" + Date.now().toString(36);
    setItems(prev => [...prev, {
      id, name: "Add-on Nou", icon: "fa-plus", price: 100, sub: null,
      unit: "", multi: true, qtyPricing: null, desc: "", active: true,
    }]);
    setEditing(items.length);
  };

  const removeAddon = (idx) => {
    if (confirm("Sigur vrei să ștergi " + items[idx].name + "?")) {
      setItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-900">{items.length} add-ons</h2>
        <div className="flex gap-2">
          <button onClick={addAddon} className="px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider border-2 border-brand">
            <i className="fas fa-plus mr-1"></i> Adaugă
          </button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider border-2 border-green-600 disabled:opacity-50">
            {saving ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-save mr-1"></i> Salvează</>}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((addon, idx) => (
          <div key={addon.id} className={`border-2 ${editing === idx ? 'border-brand' : 'border-slate-200'} bg-white`}>
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setEditing(editing === idx ? null : idx)}>
              <div className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                <i className={`fas ${addon.icon} text-xs`}></i>
              </div>
              <div className="flex-1">
                <span className="font-bold text-slate-900">{addon.name}</span>
                <span className="text-sm text-slate-400 ml-2">{addon.id}</span>
              </div>
              <span className="text-sm font-black text-slate-900">{addon.price.toLocaleString("ro")} lei{addon.unit}</span>
              <span className={`text-[10px] font-bold uppercase ${addon.active !== false ? 'text-green-600' : 'text-red-500'}`}>
                {addon.active !== false ? 'Activ' : 'Inactiv'}
              </span>
            </div>

            {editing === idx && (
              <div className="border-t-2 border-slate-100 p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">ID</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm font-mono" value={addon.id} onChange={e => update(idx, 'id', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Nume</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={addon.name} onChange={e => update(idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Preț</label>
                    <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={addon.price} onChange={e => update(idx, 'price', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Preț abo</label>
                    <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={addon.sub || ''} onChange={e => update(idx, 'sub', e.target.value ? Number(e.target.value) : null)} placeholder="null" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Icon (FA)</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={addon.icon} onChange={e => update(idx, 'icon', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Unit</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={addon.unit} onChange={e => update(idx, 'unit', e.target.value)} placeholder="/lună, /video..." />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={addon.active !== false} onChange={e => update(idx, 'active', e.target.checked)} />
                      <span className="font-bold">Activ</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!addon.multi} onChange={e => update(idx, 'multi', e.target.checked)} />
                      <span className="font-bold">Multi</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Descriere</label>
                  <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={addon.desc} onChange={e => update(idx, 'desc', e.target.value)} />
                </div>
                <button onClick={() => removeAddon(idx)} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider">
                  <i className="fas fa-trash mr-1"></i> Șterge add-on
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoEditor({ promotions, adminKey, onSave }) {
  const [items, setItems] = useState(promotions || []);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setItems(promotions || []); }, [promotions]);

  const savePromo = async (promo) => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(promo),
      });
      if (r.ok) onSave();
    } catch {}
    setSaving(false);
  };

  const deletePromo = async (id) => {
    if (!confirm("Sigur vrei să ștergi promoția?")) return;
    try {
      await fetch("/api/admin/promotions/" + id, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      onSave();
    } catch {}
  };

  const update = (idx, field, value) => {
    setItems(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const addPromo = () => {
    const id = "promo-" + Date.now().toString(36);
    const newPromo = {
      id, name: "Promoție Nouă", type: "percent", value: 10,
      appliesTo: ["all"], startDate: "", endDate: "", code: "", active: true,
    };
    setItems(prev => [...prev, newPromo]);
    setEditing(items.length);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-900">{items.length} promoții</h2>
        <button onClick={addPromo} className="px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider border-2 border-brand">
          <i className="fas fa-plus mr-1"></i> Adaugă
        </button>
      </div>

      <div className="space-y-3">
        {items.map((promo, idx) => (
          <div key={promo.id} className={`border-2 ${editing === idx ? 'border-brand' : 'border-slate-200'} bg-white`}>
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setEditing(editing === idx ? null : idx)}>
              <div className="flex-1">
                <span className="font-bold text-slate-900">{promo.name}</span>
                <span className="text-sm text-slate-400 ml-2">
                  {promo.type === 'percent' ? `-${promo.value}%` : `-${promo.value} lei`}
                </span>
              </div>
              <span className={`text-[10px] font-bold uppercase ${promo.active ? 'text-green-600' : 'text-red-500'}`}>
                {promo.active ? 'Activ' : 'Inactiv'}
              </span>
            </div>

            {editing === idx && (
              <div className="border-t-2 border-slate-100 p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Nume</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={promo.name} onChange={e => update(idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Tip</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={promo.type} onChange={e => update(idx, 'type', e.target.value)}>
                      <option value="percent">Procent (%)</option>
                      <option value="fixed">Fix (lei)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Valoare</label>
                    <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={promo.value} onChange={e => update(idx, 'value', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Cod promoțional</label>
                    <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={promo.code || ''} onChange={e => update(idx, 'code', e.target.value)} placeholder="Opțional" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Început</label>
                    <input type="date" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={promo.startDate || ''} onChange={e => update(idx, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Sfârșit</label>
                    <input type="date" className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={promo.endDate || ''} onChange={e => update(idx, 'endDate', e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={promo.active} onChange={e => update(idx, 'active', e.target.checked)} />
                      <span className="font-bold">Activ</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Se aplică la (ID-uri pachete, separate prin virgulă, sau "all")</label>
                  <input className="w-full p-2 bg-slate-50 border border-slate-200 text-sm" value={(promo.appliesTo || []).join(', ')} onChange={e => update(idx, 'appliesTo', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => savePromo(items[idx])} disabled={saving} className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider border-2 border-green-600 disabled:opacity-50">
                    {saving ? <i className="fas fa-spinner animate-spin"></i> : 'Salvează'}
                  </button>
                  <button onClick={() => deletePromo(promo.id)} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider">
                    <i className="fas fa-trash mr-1"></i> Șterge
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">Nicio promoție. Adaugă una din butonul de sus.</div>
        )}
      </div>
    </div>
  );
}

export default function AdminView({ onBack }) {
  const [adminKey, setAdminKey] = useState(localStorage.getItem("ods-admin-key") || "");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("packages");
  const [config, setConfig] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/config", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setConfig(await r.json());
      else { setAuthed(false); localStorage.removeItem("ods-admin-key"); }
    } catch {}
  }, [adminKey]);

  useEffect(() => {
    if (adminKey) {
      fetch("/api/admin/config", { headers: { "x-admin-key": adminKey } })
        .then(r => { if (r.ok) { setAuthed(true); return r.json(); } throw new Error(); })
        .then(setConfig)
        .catch(() => { setAuthed(false); });
    }
  }, [adminKey]);

  if (!authed) {
    return <AdminAuth onAuth={(key) => { setAdminKey(key); setAuthed(true); }} />;
  }

  const tabs = [
    { id: "packages", l: "Pachete", icon: "fa-box" },
    { id: "addons", l: "Add-ons", icon: "fa-puzzle-piece" },
    { id: "promos", l: "Promoții", icon: "fa-tag" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white/60 hover:text-white text-sm">
              <i className="fas fa-arrow-left mr-1"></i> Site
            </button>
            <span className="text-[10px] font-black text-white/30 tracking-[3px] uppercase border-l border-white/20 pl-3">Admin Panel</span>
          </div>
          <button onClick={() => { localStorage.removeItem("ods-admin-key"); setAuthed(false); }} className="text-xs text-white/50 hover:text-white">
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
                tab === t.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900'
              }`}>
              <i className={`fas ${t.icon}`}></i> {t.l}
            </button>
          ))}
        </div>

        {config && tab === "packages" && (
          <PackageEditor packages={config.packages} adminKey={adminKey} onSave={fetchConfig} />
        )}
        {config && tab === "addons" && (
          <AddonEditor addons={config.addons} adminKey={adminKey} onSave={fetchConfig} />
        )}
        {config && tab === "promos" && (
          <PromoEditor promotions={config.promotions} adminKey={adminKey} onSave={fetchConfig} />
        )}
      </div>
    </div>
  );
}
