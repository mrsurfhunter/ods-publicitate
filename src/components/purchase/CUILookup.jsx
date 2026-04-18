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
    <div>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">CUI / Cod Fiscal</label>
      <div className="flex gap-2">
        <input
          className="flex-1 p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-sm font-medium"
          value={value}
          onChange={e => { onChange(e.target.value); setStatus(null); }}
          placeholder="ex: 39899930"
          onKeyDown={e => e.key === "Enter" && go()}
        />
        <button
          className="px-6 py-3 bg-[#e30613] text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-xs disabled:opacity-50 whitespace-nowrap"
          onClick={go}
          disabled={loading}
        >
          {loading ? <i className="fas fa-spinner animate-spin"></i> : "Caută"}
        </button>
      </div>
      {status === "ok" && <p className="text-xs text-green-600 mt-1.5 font-semibold flex items-center gap-1"><i className="fas fa-check"></i> Date preluate</p>}
      {status === "err" && <p className="text-xs text-red-500 mt-1.5 font-medium">CUI negăsit</p>}
    </div>
  );
}
