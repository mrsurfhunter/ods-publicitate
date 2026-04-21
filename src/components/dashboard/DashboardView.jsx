import { useState } from "react";
import { PKG, ODS } from "../../data/packages";
import { sld, ssv } from "../../utils/storage";
import { wpUploadImage, wpCreateDraft } from "../../utils/wordpress";
import { useAuth } from "../../context/AuthContext";
import ImageUploader from "../shared/ImageUploader";

const ANALYTICS = [
  { label: "Vizualizări Articole", value: "—", sub: "Se actualizează", icon: "fas fa-eye", color: "text-green-500" },
  { label: "Reach Facebook", value: "—", sub: "Se actualizează", icon: "fab fa-facebook-f", color: "text-blue-400" },
  { label: "Impresii Instagram", value: "—", sub: "Se actualizează", icon: "fab fa-instagram", color: "text-pink-400" },
  { label: "Vizualizări TikTok", value: "—", sub: "Se actualizează", icon: "fab fa-tiktok", color: "text-cyan-400" },
];

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
    { l: pkg?.hasArticle ? "Conținut trimis" : "Materiale primite", done: !!order.contentChoice },
    { l: "În lucru", done: order.status === "review" || order.status === "published" },
    { l: "Publicat", done: order.status === "published" },
  ];

  const stats = order.status === "published" ? order.stats : null;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10 animate-fadeIn">
      {/* Header */}
      <div className="bg-navy p-4 sm:p-6 md:p-8 text-white mb-4 sm:mb-6 border-b-4 border-[#e30613]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="text-[9px] font-black text-white/40 uppercase tracking-[3px] mb-1">Dashboard</div>
            {user && <div className="text-sm text-white/50 font-medium mb-1">Bine ai revenit, {user.name}!</div>}
            <h2 className="text-2xl font-black tracking-tight">{order.company || order.name}</h2>
            <div className="text-xs text-white/40 mt-1">Pachet: <strong className="text-white/80">{pkg?.name}</strong></div>
          </div>
          <button className="px-4 py-2 bg-white/10 text-white/50 text-xs font-bold border border-white/20 hover:bg-white/20 transition-all" onClick={onBack}>
            <i className="fas fa-arrow-left mr-1.5"></i> Înapoi
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-2 border-slate-200 p-4 sm:p-6 mb-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-3 sm:top-4 left-[12%] right-[12%] h-0.5 bg-slate-100"></div>
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 ${
                s.done ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {s.done ? <i className="fas fa-check text-[9px] sm:text-[10px]"></i> : (i + 1)}
              </div>
              <span className={`text-[8px] sm:text-[9px] font-bold text-center max-w-[60px] sm:max-w-none leading-tight ${s.done ? 'text-green-600' : 'text-slate-400'}`}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content section */}
      {pkg?.hasArticle && (
        <div className="bg-white border-2 border-slate-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4 sm:mb-5">Conținutul articolului</h3>
          {!order.contentChoice ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button className="p-6 bg-cta text-white text-left hover:bg-cta-dark transition-all group border-2 border-cta-dark" onClick={() => upd({ contentChoice: "redactor", status: "review" })}>
                <i className="fas fa-file-pen text-lg mb-3 opacity-80"></i>
                <div className="font-black text-sm mb-1">Vreau un redactor</div>
                <div className="text-xs text-white/70">Veți fi contactat de un redactor</div>
              </button>
              <button className="p-6 border-2 border-slate-200 text-left hover:border-blue-300 transition-all group" onClick={() => upd({ contentChoice: "propriu" })}>
                <i className="fas fa-upload text-lg text-slate-400 mb-3 group-hover:text-blue-600 transition-colors"></i>
                <div className="font-bold text-sm text-slate-800 mb-1">Trimit eu materialele</div>
                <div className="text-xs text-slate-400">Scriu textul și încarc pozele aici</div>
              </button>
            </div>
          ) : order.contentChoice === "redactor" ? (
            <div className="bg-blue-50 p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-file-pen text-blue-600"></i>
                <span className="text-sm font-bold text-blue-700">Un redactor va scrie articolul</span>
              </div>
              <p className="text-sm text-slate-500">Veți fi contactat la numărul <strong className="text-slate-700">{order.phone}</strong> în următoarele 24h.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Titlul articolului *</label>
                <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none text-base font-bold" value={order.articleTitle || ""} onChange={e => upd({ articleTitle: e.target.value })} placeholder="Ex: Restaurant La Cuptor - Meniu nou de primăvară în Sibiu" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Textul articolului *</label>
                <textarea className="w-full h-48 p-5 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-2xl outline-none resize-none text-sm leading-relaxed" value={order.articleText || ""} onChange={e => upd({ articleText: e.target.value })} placeholder="Scrieți sau lipiți textul articolului aici." />
                <span className="text-[10px] text-slate-400 font-medium">{(order.articleText || "").trim().split(/\s+/).filter(Boolean).length} cuvinte</span>
              </div>
              <ImageUploader label="Fotografie principală (cover)" images={order.featuredImg || []} onChange={imgs => upd({ featuredImg: imgs })} multi={false} />
              <ImageUploader label="Galerie foto (opțional)" images={order.gallery || []} onChange={imgs => upd({ gallery: imgs })} multi={true} />
              <button className="w-full py-4 bg-slate-900 text-white font-black hover:bg-black transition-all uppercase text-xs tracking-widest disabled:opacity-50 border-2 border-slate-700" onClick={submitToWP} disabled={wpLoading || !order.articleTitle || !order.articleText}>
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

      {/* Calendar */}
      <div className="bg-white border-2 border-slate-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-5">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-3">Calendar postări sociale</h3>
        <p className="text-xs text-slate-400 mb-4">Alege zilele și ora la care vrei să fie publicate postările:</p>
        {(order.reposts || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(order.reposts || []).map((entry, i) => {
              const parts = entry.split("|"); const dateStr = parts[0]; const timeStr = parts[1] || "orice";
              return (
                <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 text-xs font-semibold flex items-center gap-2 border border-blue-200">
                  {new Date(dateStr).toLocaleDateString("ro-RO")} la {timeStr === "orice" ? "orice oră" : timeStr}
                  <span className="cursor-pointer text-blue-400 hover:text-red-500 font-bold transition-colors" onClick={() => upd({ reposts: (order.reposts || []).filter((_, j) => j !== i) })}>×</span>
                </span>
              );
            })}
          </div>
        )}
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Data</label>
            <input type="date" className="w-full p-3 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-xl outline-none text-sm" value={repostDay} onChange={e => setRD(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="w-32">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ora</label>
            <select className="w-full p-3 bg-slate-50 border-2 border-transparent focus:border-red-100 rounded-xl outline-none text-sm" value={repostTime} onChange={e => setRT(e.target.value)}>
              <option value="orice">Orice oră</option>
              {Array.from({ length: 15 }, (_, i) => i + 7).map(h => {
                const hh = String(h).padStart(2, "0") + ":00";
                return <option key={h} value={hh}>{hh}</option>;
              })}
            </select>
          </div>
          <button className="px-5 py-3 bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all disabled:opacity-50 border-2 border-slate-700" onClick={() => { if (repostDay) { upd({ reposts: [...(order.reposts || []), repostDay + "|" + repostTime] }); setRD(""); setRT("orice"); } }} disabled={!repostDay}>
            Adaugă
          </button>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 md:p-10 mb-4 sm:mb-5 border-2 border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight italic">Analize Impact Campanii</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Date agregate din Google Analytics & Social Media</p>
          </div>
          <div className="bg-white/5 border-2 border-white/10 px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {(stats ? [
            { label: "Vizualizări Articole", value: stats.views.toLocaleString("ro"), sub: `+14% vs. medie`, icon: "fas fa-eye", color: "text-green-500" },
            { label: "Reach Facebook", value: stats.fbReach.toLocaleString("ro"), sub: `${stats.clicks} click-uri`, icon: "fab fa-facebook-f", color: "text-blue-400" },
            { label: "Impresii Instagram", value: stats.igReach.toLocaleString("ro"), sub: `${stats.shares} interacțiuni`, icon: "fab fa-instagram", color: "text-pink-400" },
            { label: "Vizualizări TikTok", value: "—", sub: "Se actualizează", icon: "fab fa-tiktok", color: "text-cyan-400" },
          ] : ANALYTICS).map((m, i) => (
            <div key={i} className="bg-white/5 p-3 sm:p-5 border-2 border-white/10">
              <div className="text-slate-500 text-[9px] font-black uppercase mb-2">{m.label}</div>
              <div className="text-2xl font-black">{m.value}</div>
              <div className={`${m.color} text-[10px] font-bold mt-2 flex items-center gap-1`}>
                <i className={m.icon + " text-[8px]"}></i> {m.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3">
          <p className="text-[10px] text-slate-600 font-medium italic">
            * Datele sunt actualizate la fiecare 6 ore. Pentru rapoarte detaliate, contactați editorul alocat.
          </p>
        </div>
      </div>

      {/* Upsell */}
      <div className="bg-[#e30613] text-white p-4 sm:p-6 md:p-10 mb-4 sm:mb-5 border-2 border-red-700">
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

      {/* Contact */}
      <div className="bg-white border-2 border-slate-200 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs text-slate-400">Ai întrebări? Contact: <strong className="text-slate-700">{ODS.phone}</strong> (WhatsApp)</span>
        <a href={"https://wa.me/40746752240?text=Salut,+comanda+" + order.id.toUpperCase()} target="_blank" rel="noopener" className="px-5 py-2.5 bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all flex items-center gap-2 border-2 border-green-600">
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    </div>
  );
}
