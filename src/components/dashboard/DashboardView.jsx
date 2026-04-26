import { useState } from "react";
import { PKG, ODS } from "../../data/packages";
import { sld, ssv } from "../../utils/storage";
import { wpUploadImage, wpCreateDraft } from "../../utils/wordpress";
import { useAuth } from "../../context/AuthContext";
import ImageUploader from "../shared/ImageUploader";

export default function DashboardView({ initOrder, onBack }) {
  const { user } = useAuth();
  const [order, setOrder] = useState(initOrder);
  const [repostDay, setRD] = useState("");
  const [repostTime, setRT] = useState("orice");
  const [wpLoading, setWpL] = useState(false);
  const [wpMsg, setWpMsg] = useState(null);
  const pkg = PKG.find(p => p.id === order.packageId);

  const upd = async (changes) => {
    const u = { ...order, ...changes }; setOrder(u);
    const all = await sld("ods-orders", []); await ssv("ods-orders", all.map(o => o.id === u.id ? u : o));
  };

  const submitToWP = async () => {
    if (!order.articleTitle || !order.articleText) { setWpMsg("Completați titlul și textul articolului."); return; }
    setWpL(true); setWpMsg(null);
    let featId = null;
    if (order.featuredImg?.[0]?.file) {
      const res = await wpUploadImage(order.featuredImg[0].file);
      if (res) featId = res.id;
    }
    const galleryIds = [];
    for (const img of (order.gallery || [])) {
      if (img.file) { const res = await wpUploadImage(img.file); if (res) galleryIds.push(res.id); }
    }
    const result = await wpCreateDraft({ title: order.articleTitle, content: order.articleText, featuredImage: featId, galleryIds });
    setWpL(false);
    if (result.success) { setWpMsg("ok"); upd({ wpDraftId: result.id, wpDraftUrl: result.link, status: "review" }); }
    else if (result.error === "no-config") { setWpMsg("config"); }
    else { setWpMsg("Eroare: " + result.error); }
  };

  const STEPS = [
    { l: "Plată confirmată", done: true },
    { l: pkg?.hasArticle ? "Conținut trimis" : "Materiale primite", done: !!order.contentChoice, active: !order.contentChoice },
    { l: "În lucru", done: order.status === "review" || order.status === "published" },
    { l: "Aprobare client", done: order.status === "published" },
    { l: "Publicat & promovat", done: order.status === "published" },
  ];

  const stats = order.status === "published" ? order.stats : null;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 animate-fadeIn">
      <button onClick={onBack} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[2px] mb-4 transition-colors">
        <i className="fas fa-arrow-left mr-1"></i> Înapoi
      </button>

      {/* HEADER */}
      <div className="bg-navy text-white p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-white/50 uppercase tracking-[2px] mb-2">Comandă activă · #{order.id?.toUpperCase().slice(0, 8)}</div>
            {user && <div className="text-sm text-white/50 font-medium mb-1">Bine ai revenit, {user.name}!</div>}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">{order.company || order.name}</h1>
            <p className="text-sm text-white/60 mt-1">Pachet: <strong className="text-white/80">{pkg?.name}</strong> · Plătit {order.price?.toLocaleString("ro")} lei</p>
          </div>
          <div className="flex gap-2">
            <a href={"https://wa.me/40746752240?text=Salut,+comanda+" + (order.id || "").toUpperCase()} target="_blank" rel="noopener" className="bg-white/10 hover:bg-white/20 border-2 border-white/20 px-4 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <i className="fab fa-whatsapp"></i> Contactează
            </a>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white border-2 border-slate-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">Etape comandă</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">{STEPS.filter(s => s.done).length} / {STEPS.length}</div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex-1 border-l-4 ${s.done ? 'border-green-500' : s.active ? 'border-brand' : 'border-slate-200'} pl-3 py-2`}>
              <div className="flex items-center gap-2 mb-1">
                {s.done ? <i className="fas fa-check-circle text-green-500"></i> : s.active ? <i className="fas fa-circle-notch fa-spin text-brand"></i> : <i className="far fa-circle text-slate-300"></i>}
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{i + 1}</span>
              </div>
              <div className={`text-sm font-black ${s.done || s.active ? 'text-slate-900' : 'text-slate-400'}`}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CONTENT SECTION */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {pkg?.hasArticle && (
            <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-900">Materiale necesare</h3>
                {!order.contentChoice && <span className="text-[11px] font-bold text-brand uppercase tracking-[2px]">Alege opțiunea</span>}
              </div>

              {!order.contentChoice ? (
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-4 p-4 border-2 border-brand/20 bg-brand/5 text-left hover:bg-brand/10 transition-all" onClick={() => upd({ contentChoice: "redactor", status: "review" })}>
                    <div className="w-9 h-9 bg-brand text-white flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-file-pen"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">Vreau un redactor</div>
                      <div className="text-xs text-slate-500">Veți fi contactat de un redactor pentru a discuta detaliile</div>
                    </div>
                    <i className="fas fa-arrow-right text-brand"></i>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 text-left hover:border-slate-400 transition-all" onClick={() => upd({ contentChoice: "propriu" })}>
                    <div className="w-9 h-9 bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-upload"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">Trimit eu materialele</div>
                      <div className="text-xs text-slate-500">Scriu textul și încarc pozele aici, în dashboard</div>
                    </div>
                    <i className="fas fa-arrow-right text-slate-300"></i>
                  </button>
                </div>
              ) : order.contentChoice === "redactor" ? (
                <div className="flex items-center gap-4 p-4 border-2 border-green-200 bg-green-50">
                  <div className="w-9 h-9 bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Un redactor va scrie articolul</div>
                    <div className="text-xs text-slate-500">Veți fi contactat la <strong>{order.phone}</strong> în următoarele 24h.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Titlul articolului *</label>
                    <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-base font-bold" value={order.articleTitle || ""} onChange={e => upd({ articleTitle: e.target.value })} placeholder="Ex: Restaurant La Cuptor - Meniu nou de primăvară în Sibiu" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Textul articolului *</label>
                    <textarea className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none resize-none text-sm leading-relaxed" value={order.articleText || ""} onChange={e => upd({ articleText: e.target.value })} placeholder="Scrieți sau lipiți textul articolului aici." />
                    <span className="text-[10px] text-slate-400 font-medium">{(order.articleText || "").trim().split(/\s+/).filter(Boolean).length} cuvinte</span>
                  </div>
                  <ImageUploader label="Fotografie principală (cover)" images={order.featuredImg || []} onChange={imgs => upd({ featuredImg: imgs })} multi={false} />
                  <ImageUploader label="Galerie foto (opțional)" images={order.gallery || []} onChange={imgs => upd({ gallery: imgs })} multi={true} />
                  <button className="w-full py-4 bg-slate-900 text-white font-black hover:bg-black transition-all uppercase text-xs tracking-widest disabled:opacity-50 border-2 border-slate-900" onClick={submitToWP} disabled={wpLoading || !order.articleTitle || !order.articleText}>
                    {wpLoading ? <><i className="fas fa-spinner animate-spin mr-2"></i>Se trimite...</> : "Trimite articolul spre publicare"}
                  </button>
                  {wpMsg === "ok" && <div className="p-4 bg-green-50 border-2 border-green-200 text-sm text-green-700 font-semibold flex items-center gap-2"><i className="fas fa-check"></i> Articolul a fost trimis ca draft în WordPress!</div>}
                  {wpMsg === "config" && <div className="p-4 bg-blue-50 border-2 border-blue-200 text-sm text-blue-700">Articolul a fost salvat local. Configurați WP_USER + WP_PASS pentru publicare automată.</div>}
                  {wpMsg && wpMsg !== "ok" && wpMsg !== "config" && <div className="p-4 bg-red-50 border-2 border-red-200 text-sm text-red-600">{wpMsg}</div>}
                  {order.wpDraftUrl && <div className="p-4 bg-green-50 border-2 border-green-200 text-sm">Draft creat: <a href={order.wpDraftUrl} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{order.wpDraftUrl}</a></div>}
                </div>
              )}
            </div>
          )}

          {/* UPSELL */}
          <div className="bg-brand text-white p-4 sm:p-6 md:p-8 border-2 border-red-700">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-3">Vrei și mai multă vizibilitate?</h3>
            <p className="text-red-100 font-medium mb-6 max-w-2xl text-sm">
              Abonează-te pentru minim 3 luni și primești <span className="font-black text-white">20% reducere</span> la abonamentul plătit în avans.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <button className="px-6 py-3 bg-white text-red-700 font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all border-2 border-white">
                Abonare 3 luni (-20%)
              </button>
              <button className="px-6 py-3 border-2 border-white text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
                Adaugă Postări
              </button>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="space-y-4 sm:space-y-5">
          <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
            <h3 className="font-black text-slate-900 mb-4">Calendar publicări</h3>
            {(order.reposts || []).length > 0 && (
              <div className="space-y-3 mb-4">
                {(order.reposts || []).map((entry, i) => {
                  const parts = entry.split("|"); const dateStr = parts[0]; const timeStr = parts[1] || "orice";
                  const d = new Date(dateStr);
                  const day = d.getDate();
                  const month = d.toLocaleDateString("ro-RO", { month: "short" }).toUpperCase();
                  return (
                    <div key={i} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                      <div className="bg-cta text-white w-12 text-center py-1 flex-shrink-0">
                        <div className="text-[9px] font-bold">{month}</div>
                        <div className="text-sm font-black">{day}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">Postare FB + IG</div>
                        <div className="text-[11px] text-slate-500">{timeStr === "orice" ? "Orice oră" : timeStr}</div>
                      </div>
                      <button className="text-[11px] font-black text-slate-400 hover:text-red-500 transition-colors" onClick={() => upd({ reposts: (order.reposts || []).filter((_, j) => j !== i) })}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Data</label>
                <input type="date" className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm" value={repostDay} onChange={e => setRD(e.target.value)} min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ora</label>
                <select className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm" value={repostTime} onChange={e => setRT(e.target.value)}>
                  <option value="orice">Orice oră</option>
                  {Array.from({ length: 15 }, (_, i) => i + 7).map(h => {
                    const hh = String(h).padStart(2, "0") + ":00";
                    return <option key={h} value={hh}>{hh}</option>;
                  })}
                </select>
              </div>
              <button className="w-full px-5 py-3 bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all disabled:opacity-50 border-2 border-slate-900" onClick={() => { if (repostDay) { upd({ reposts: [...(order.reposts || []), repostDay + "|" + repostTime] }); setRD(""); setRT("orice"); } }} disabled={!repostDay}>
                Adaugă în calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
          <div>
            <div className="text-[11px] font-bold text-brand uppercase tracking-[2px] mb-1">Statistici live</div>
            <h3 className="text-lg sm:text-xl font-black">Performanță campanie</h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-[2px]">
            <span className="w-2 h-2 bg-green-500 animate-pulse"></span> Live Sync
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {(stats ? [
            { l: "Vizualizări", v: stats.views.toLocaleString("ro"), note: `+14% vs. medie` },
            { l: "Click-uri", v: stats.clicks.toLocaleString("ro"), note: "" },
            { l: "Reach Social", v: (stats.fbReach + stats.igReach).toLocaleString("ro"), note: `${stats.shares} interacțiuni` },
            { l: "Engagement", v: stats.shares.toLocaleString("ro"), note: "" },
          ] : [
            { l: "Afișări", v: "0", note: "Începem după publicare" },
            { l: "Click-uri", v: "0", note: "" },
            { l: "Reach Social", v: "0", note: "Postare 1 din 4" },
            { l: "Engagement", v: "—", note: "" },
          ]).map((a, i) => (
            <div key={i} className="bg-slate-900 p-3 sm:p-4">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2">{a.l}</div>
              <div className="text-2xl sm:text-3xl font-black mb-1">{a.v}</div>
              <div className="text-[11px] text-white/40">{a.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white/5">
          <p className="text-[10px] text-slate-600 font-medium italic">
            * Datele sunt actualizate la fiecare 6 ore. Pentru rapoarte detaliate, contactați editorul alocat.
          </p>
        </div>
      </div>

      {/* CONTACT */}
      <div className="bg-white border-2 border-slate-200 p-5 mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs text-slate-400">Ai întrebări? Contact: <strong className="text-slate-700">{ODS.phone}</strong> (WhatsApp)</span>
        <a href={"https://wa.me/40746752240?text=Salut,+comanda+" + (order.id || "").toUpperCase()} target="_blank" rel="noopener" className="px-5 py-2.5 bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all flex items-center gap-2 border-2 border-green-600">
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    </div>
  );
}
