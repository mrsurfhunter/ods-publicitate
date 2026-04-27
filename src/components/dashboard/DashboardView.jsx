import { useState, useEffect } from "react";
import { ODS, AD_CAT } from "../../data/packages";
import { sld, ssv } from "../../utils/storage";
import { wpUploadImage, wpCreateDraft } from "../../utils/wordpress";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";
import ImageUploader from "../shared/ImageUploader";
import BannerGenerator from "./BannerGenerator";
import AdCopyWriter from "./AdCopyWriter";

const MARINA_TONES = [
  { id: "professional", l: "Profesional", icon: "fa-briefcase" },
  { id: "friendly", l: "Prietenos", icon: "fa-face-smile" },
  { id: "local", l: "Local / Sibiu", icon: "fa-map-pin" },
];

export default function DashboardView({ initOrder, onBack }) {
  const { user } = useAuth();
  const { packages, addons } = useConfig();
  const [order, setOrder] = useState(initOrder);
  const [allOrders, setAllOrders] = useState([]);
  const [tab, setTab] = useState("current");

  const [marinaForm, setMarinaForm] = useState({ topic: "", details: "", tone: "professional" });
  const [marinaTitles, setMarinaTitles] = useState([]);
  const [marinaArticle, setMarinaArticle] = useState("");
  const [marinaLoading, setMarinaLoading] = useState(false);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [customTitle, setCustomTitle] = useState("");

  const [repostDay, setRD] = useState("");
  const [repostTime, setRT] = useState("orice");
  const [wpLoading, setWpL] = useState(false);
  const [wpMsg, setWpMsg] = useState(null);

  const pkg = packages.find(p => p.id === order.packageId);
  const isAnunt = order.isAnunt;

  useEffect(() => { sld("ods-orders", []).then(setAllOrders); }, []);

  const upd = async (changes) => {
    const u = { ...order, ...changes }; setOrder(u);
    const all = await sld("ods-orders", []);
    await ssv("ods-orders", all.map(o => o.id === u.id ? u : o));
  };

  const switchOrder = (o) => {
    setOrder(o); setTab("current");
    sessionStorage.setItem("ods-dash-order", o.id);
  };

  // Marina AI
  const generateArticle = async () => {
    if (!marinaForm.topic.trim()) return;
    setMarinaLoading(true); setMarinaTitles([]); setMarinaArticle(""); setSelectedTitle(null);
    try {
      const r = await fetch("/api/articles/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...marinaForm, businessName: order.company || order.name }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Eroare");
      setMarinaTitles(data.titles || []);
      setMarinaArticle(data.article || "");
      if (data.titles?.length) setSelectedTitle(0);
    } catch (e) { console.error(e); }
    setMarinaLoading(false);
  };

  const generateMoreTitles = async () => {
    setTitlesLoading(true);
    try {
      const r = await fetch("/api/articles/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...marinaForm, businessName: order.company || order.name, titlesOnly: true }),
      });
      const data = await r.json();
      if (data.titles?.length) { setMarinaTitles(data.titles); setSelectedTitle(0); setCustomTitle(""); }
    } catch (e) { console.error(e); }
    setTitlesLoading(false);
  };

  const getFinalTitle = () => customTitle.trim() || (selectedTitle !== null ? marinaTitles[selectedTitle] : "");

  const submitToWP = async () => {
    const title = order.articleTitle;
    const text = order.articleText;
    if (!title || !text) { setWpMsg("Completați titlul și textul articolului."); return; }
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
    const result = await wpCreateDraft({ title, content: text, featuredImage: featId, galleryIds });
    setWpL(false);
    if (result.success) { setWpMsg("ok"); upd({ wpDraftId: result.id, wpDraftUrl: result.link, status: "review" }); }
    else if (result.error === "no-config") { setWpMsg("config"); }
    else { setWpMsg("Eroare: " + result.error); }
  };

  const acceptMarina = () => {
    const title = getFinalTitle();
    if (title && marinaArticle) {
      upd({ articleTitle: title, articleText: marinaArticle });
    }
  };

  const anuntCat = isAnunt ? AD_CAT.find(c => c.id === order.anuntCategory) : null;

  const TABS = [
    { id: "current", l: "Comandă", icon: "fa-file-lines" },
    { id: "history", l: `Istoric (${allOrders.length})`, icon: "fa-clock-rotate-left" },
    { id: "invoices", l: "Facturi", icon: "fa-file-invoice" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 animate-fadeIn">
      <button onClick={onBack} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[2px] mb-4 transition-colors">
        <i className="fas fa-arrow-left mr-1"></i> Acasă
      </button>

      {/* HEADER */}
      <div className="bg-navy text-white p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-white/50 uppercase tracking-[2px] mb-2">
              {isAnunt ? "Anunț" : "Comandă"} · #{order.id?.toUpperCase().slice(0, 8)}
            </div>
            {user && <div className="text-sm text-white/50 font-medium mb-1">Bine ai revenit, {user.name}!</div>}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">{order.company || order.name}</h1>
            <p className="text-sm text-white/60 mt-1">
              {isAnunt
                ? <><i className={`fas ${anuntCat?.icon || 'fa-file'} mr-1`}></i>{order.packageName} · {order.price?.toLocaleString("ro")} lei</>
                : <>Pachet: <strong className="text-white/80">{pkg?.name || order.packageName}</strong> · {order.price?.toLocaleString("ro")} lei</>
              }
            </p>
          </div>
          <a href={"https://wa.me/40746752240?text=Salut,+comanda+" + (order.id || "").toUpperCase()} target="_blank" rel="noopener"
            className="bg-white/10 hover:bg-white/20 border-2 border-white/20 px-4 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 self-start">
            <i className="fab fa-whatsapp"></i> Contactează
          </a>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-4 sm:mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-2 transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}>
            <i className={`fas ${t.icon}`}></i> {t.l}
          </button>
        ))}
      </div>

      {/* TAB: CURRENT ORDER */}
      {tab === "current" && (
        <div className="space-y-4 sm:space-y-6">
          {isAnunt ? (
            /* ═══ ANUNȚ DASHBOARD ═══ */
            <>
              <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Stare anunț</div>
                <div className="flex gap-2 sm:gap-4">
                  {[
                    { id: "review", l: "În revizie", icon: "fa-clock", color: "amber" },
                    { id: "published", l: "Publicat", icon: "fa-check-circle", color: "green" },
                    { id: "expired", l: "Expirat", icon: "fa-calendar-xmark", color: "slate" },
                  ].map((s, i) => {
                    const status = order.status || "review";
                    const steps = ["review", "published", "expired"];
                    const current = steps.indexOf(status);
                    const done = steps.indexOf(s.id) <= current;
                    const active = s.id === status;
                    return (
                      <div key={s.id} className={`flex-1 border-l-4 pl-3 py-2 ${active ? `border-${s.color}-500` : done ? 'border-green-500' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {done ? <i className={`fas fa-check-circle text-green-500`}></i>
                            : active ? <i className={`fas ${s.icon} text-${s.color}-500`}></i>
                            : <i className="far fa-circle text-slate-300"></i>}
                        </div>
                        <div className={`text-sm font-black ${active || done ? 'text-slate-900' : 'text-slate-400'}`}>{s.l}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-3">Textul anunțului</div>
                <div className="bg-slate-50 p-4 border-2 border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {order.anuntText}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
                  <span><i className="fas fa-tag mr-1"></i>{anuntCat?.label || order.anuntCategory}</span>
                  <span><i className="fas fa-calendar mr-1"></i>{order.anuntDays} zile</span>
                  <span><i className="fas fa-font mr-1"></i>{order.anuntWords} cuvinte</span>
                  <span><i className="fas fa-credit-card mr-1"></i>{order.price?.toLocaleString("ro")} lei + TVA</span>
                </div>
              </div>
            </>
          ) : (
            /* ═══ PACKAGE DASHBOARD ═══ */
            <>
              {/* Progress */}
              <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Parcurs</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {[
                    { l: "Plată confirmată", done: true },
                    { l: pkg?.hasArticle ? "Conținut pregătit" : "Materiale primite", done: !!order.contentChoice || !!order.articleTitle || !pkg?.hasArticle, active: pkg?.hasArticle && !order.contentChoice },
                    { l: "În lucru", done: order.status === "review" || order.status === "published", active: order.status === "review" },
                    { l: "Publicat", done: order.status === "published" },
                  ].map((s, i) => (
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

              {/* CONTENT SECTION — only for article packages */}
              {pkg?.hasArticle && (
                <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
                  {!order.contentChoice ? (
                    /* Content choice */
                    <>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Cum dorești să fie scris articolul?</div>
                      <div className="space-y-3">
                        {[
                          { id: "propriu", icon: "fa-upload", title: "Trimit eu materialele", desc: "Am textul și pozele pregătite. Le încarc aici.", color: "slate" },
                          { id: "marina", icon: "fa-wand-magic-sparkles", title: "Scriu cu Marina, redactor AI", desc: "Completez câteva detalii și Marina scrie articolul.", color: "purple" },
                          { id: "redactie", icon: "fa-pen-nib", title: "Scrie redacția Ora de Sibiu", desc: "Echipa editorială scrie articolul. Primesc draft pentru aprobare.", color: "brand" },
                        ].map(opt => (
                          <button key={opt.id} onClick={() => upd({ contentChoice: opt.id, ...(opt.id === "redactie" ? { status: "review" } : {}) })}
                            className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-all ${
                              opt.color === "brand" ? 'border-brand/20 bg-brand/5 hover:bg-brand/10' :
                              opt.color === "purple" ? 'border-purple-200 bg-purple-50/50 hover:bg-purple-50' :
                              'border-slate-200 hover:border-slate-400'
                            }`}>
                            <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                              opt.color === "brand" ? 'bg-brand text-white' :
                              opt.color === "purple" ? 'bg-purple-600 text-white' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              <i className={`fas ${opt.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-slate-900">{opt.title}</div>
                              <div className="text-xs text-slate-500">{opt.desc}</div>
                            </div>
                            <i className="fas fa-arrow-right text-slate-300"></i>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : order.contentChoice === "redactie" ? (
                    /* Editorial timeline */
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Articol — Redacția Ora de Sibiu</div>
                      <div className="flex items-center gap-4 p-4 border-2 border-green-200 bg-green-50">
                        <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check"></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Echipa editorială a preluat comanda</div>
                          <div className="text-xs text-slate-500">Vei fi contactat la <strong>{order.phone}</strong> pentru detalii. Articolul va fi trimis pentru aprobare înainte de publicare.</div>
                        </div>
                      </div>
                      {order.status === "review" && (
                        <div className="mt-3 p-3 bg-amber-50 border-2 border-amber-200 text-xs text-amber-700 font-semibold flex items-center gap-2">
                          <i className="fas fa-pen-to-square"></i> Articol în lucru — vei primi un draft pentru aprobare
                        </div>
                      )}
                      {order.wpDraftUrl && (
                        <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 text-xs">
                          <i className="fas fa-eye mr-1"></i> Preview: <a href={order.wpDraftUrl} target="_blank" rel="noopener" className="text-blue-600 hover:underline font-bold">{order.wpDraftUrl}</a>
                        </div>
                      )}
                    </div>
                  ) : order.contentChoice === "marina" ? (
                    /* Marina AI Editor */
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-wand-magic-sparkles"></i>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">Marina — Redactor AI</div>
                          <div className="text-xs text-slate-500">Completează detaliile și Marina scrie articolul</div>
                        </div>
                      </div>

                      {!order.articleTitle ? (
                        /* Marina generation form */
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Despre ce scriem? *</label>
                            <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm font-bold"
                              value={marinaForm.topic} onChange={e => setMarinaForm(f => ({ ...f, topic: e.target.value }))}
                              placeholder="Ex: Deschidere restaurant nou în centrul Sibiului" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Detalii importante (opțional)</label>
                            <textarea className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm resize-none"
                              value={marinaForm.details} onChange={e => setMarinaForm(f => ({ ...f, details: e.target.value }))}
                              placeholder="Adresă, program, meniu, prețuri, ce vrei menționat..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ton</label>
                            <div className="flex flex-wrap gap-2">
                              {MARINA_TONES.map(t => (
                                <button key={t.id} onClick={() => setMarinaForm(f => ({ ...f, tone: t.id }))}
                                  className={`px-3 py-2 text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                                    marinaForm.tone === t.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-500 border-slate-200 hover:border-purple-400'
                                  }`}>
                                  <i className={`fas ${t.icon} text-[10px]`}></i> {t.l}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button onClick={generateArticle} disabled={marinaLoading || !marinaForm.topic.trim()}
                            className="w-full py-4 bg-purple-600 text-white font-black text-sm uppercase tracking-widest border-2 border-purple-600 hover:bg-purple-700 transition-all disabled:opacity-50">
                            {marinaLoading ? <><i className="fas fa-spinner animate-spin mr-2"></i>Marina scrie...</> : <><i className="fas fa-wand-magic-sparkles mr-2"></i>Generează articolul</>}
                          </button>

                          {/* Titles + Article result */}
                          {marinaTitles.length > 0 && (
                            <div className="space-y-4 border-t-2 border-slate-100 pt-4">
                              <div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Alege titlul</div>
                                <div className="space-y-2">
                                  {marinaTitles.map((t, i) => (
                                    <label key={i} className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-all ${
                                      selectedTitle === i && !customTitle ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'
                                    }`}>
                                      <input type="radio" name="title" checked={selectedTitle === i && !customTitle} onChange={() => { setSelectedTitle(i); setCustomTitle(""); }} className="accent-purple-600" />
                                      <span className="text-sm font-semibold text-slate-800">{t}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <input className="flex-1 p-3 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm font-bold"
                                    placeholder="Sau scrie titlul tău..."
                                    value={customTitle} onChange={e => { setCustomTitle(e.target.value); if (e.target.value) setSelectedTitle(null); }} />
                                  <button onClick={generateMoreTitles} disabled={titlesLoading}
                                    className="px-4 py-3 bg-slate-100 text-slate-600 text-xs font-bold border-2 border-slate-200 hover:bg-slate-200 transition-all disabled:opacity-50 whitespace-nowrap">
                                    {titlesLoading ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-redo mr-1"></i>Alte 5</>}
                                  </button>
                                </div>
                              </div>

                              {marinaArticle && (
                                <div>
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Articol generat</div>
                                  <div className="bg-slate-50 p-4 border-2 border-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                                    {marinaArticle}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-1">{marinaArticle.trim().split(/\s+/).length} cuvinte</div>
                                </div>
                              )}

                              <button onClick={acceptMarina} disabled={!getFinalTitle() || !marinaArticle}
                                className="w-full py-4 bg-green-600 text-white font-black text-sm uppercase tracking-widest border-2 border-green-600 hover:bg-green-700 transition-all disabled:opacity-50">
                                <i className="fas fa-check mr-2"></i>Acceptă titlul și articolul
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Article accepted — show preview + upload images + submit */
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border-2 border-green-200">
                            <div className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">Articol acceptat</div>
                            <div className="text-base font-black text-slate-900 mb-2">{order.articleTitle}</div>
                            <div className="text-sm text-slate-600 leading-relaxed line-clamp-4">{order.articleText}</div>
                            <button className="text-xs text-purple-600 font-bold mt-2" onClick={() => upd({ articleTitle: "", articleText: "" })}>
                              <i className="fas fa-redo mr-1"></i>Rescrie cu Marina
                            </button>
                          </div>
                          <ImageUploader label="Fotografie principală (cover)" images={order.featuredImg || []} onChange={imgs => upd({ featuredImg: imgs })} multi={false} />
                          <ImageUploader label="Galerie foto (opțional)" images={order.gallery || []} onChange={imgs => upd({ gallery: imgs })} multi={true} />
                          <button className="w-full py-4 bg-slate-900 text-white font-black hover:bg-black transition-all uppercase text-xs tracking-widest disabled:opacity-50 border-2 border-slate-900"
                            onClick={submitToWP} disabled={wpLoading}>
                            {wpLoading ? <><i className="fas fa-spinner animate-spin mr-2"></i>Se trimite...</> : "Trimite spre publicare"}
                          </button>
                          {wpMsg === "ok" && <div className="p-3 bg-green-50 border-2 border-green-200 text-sm text-green-700 font-semibold flex items-center gap-2"><i className="fas fa-check"></i> Articol trimis ca draft!</div>}
                          {wpMsg === "config" && <div className="p-3 bg-blue-50 border-2 border-blue-200 text-sm text-blue-700">Salvat local. WP se configurează de echipă.</div>}
                          {wpMsg && wpMsg !== "ok" && wpMsg !== "config" && <div className="p-3 bg-red-50 border-2 border-red-200 text-sm text-red-600">{wpMsg}</div>}
                          {order.wpDraftUrl && <div className="p-3 bg-green-50 border-2 border-green-200 text-sm">Draft: <a href={order.wpDraftUrl} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{order.wpDraftUrl}</a></div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Upload own content */
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Încarcă materialele</div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Titlul articolului *</label>
                          <input className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-base font-bold"
                            value={order.articleTitle || ""} onChange={e => upd({ articleTitle: e.target.value })}
                            placeholder="Ex: Restaurant La Cuptor - Meniu nou de primăvară" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Textul articolului *</label>
                          <textarea className="w-full h-48 p-4 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none resize-none text-sm leading-relaxed"
                            value={order.articleText || ""} onChange={e => upd({ articleText: e.target.value })}
                            placeholder="Scrieți sau lipiți textul articolului aici." />
                          <span className="text-[10px] text-slate-400 font-medium">{(order.articleText || "").trim().split(/\s+/).filter(Boolean).length} cuvinte</span>
                        </div>
                        <ImageUploader label="Fotografie principală (cover)" images={order.featuredImg || []} onChange={imgs => upd({ featuredImg: imgs })} multi={false} />
                        <ImageUploader label="Galerie foto (opțional)" images={order.gallery || []} onChange={imgs => upd({ gallery: imgs })} multi={true} />
                        <button className="w-full py-4 bg-slate-900 text-white font-black hover:bg-black transition-all uppercase text-xs tracking-widest disabled:opacity-50 border-2 border-slate-900"
                          onClick={submitToWP} disabled={wpLoading || !order.articleTitle || !order.articleText}>
                          {wpLoading ? <><i className="fas fa-spinner animate-spin mr-2"></i>Se trimite...</> : "Trimite articolul spre publicare"}
                        </button>
                        {wpMsg === "ok" && <div className="p-3 bg-green-50 border-2 border-green-200 text-sm text-green-700 font-semibold flex items-center gap-2"><i className="fas fa-check"></i> Articol trimis ca draft!</div>}
                        {wpMsg === "config" && <div className="p-3 bg-blue-50 border-2 border-blue-200 text-sm text-blue-700">Salvat local. WP se configurează de echipă.</div>}
                        {wpMsg && wpMsg !== "ok" && wpMsg !== "config" && <div className="p-3 bg-red-50 border-2 border-red-200 text-sm text-red-600">{wpMsg}</div>}
                        {order.wpDraftUrl && <div className="p-3 bg-green-50 border-2 border-green-200 text-sm">Draft: <a href={order.wpDraftUrl} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{order.wpDraftUrl}</a></div>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOCIAL SCHEDULING — after content choice or for non-article packages */}
              {(order.contentChoice || !pkg?.hasArticle) && (
                <div className="bg-white border-2 border-slate-200 p-4 sm:p-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Programare postări social media</div>

                  {!order.socialChoice ? (
                    <div className="space-y-3">
                      <button onClick={() => upd({ socialChoice: "manual" })}
                        className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 text-left hover:border-slate-400 transition-all">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><i className="fas fa-calendar-days"></i></div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">Aleg eu zilele și orele</div>
                          <div className="text-xs text-slate-500">Programez manual fiecare postare din calendar</div>
                        </div>
                        <i className="fas fa-arrow-right text-slate-300"></i>
                      </button>
                      <button onClick={() => upd({ socialChoice: "auto" })}
                        className="w-full flex items-center gap-4 p-4 border-2 border-brand/20 bg-brand/5 text-left hover:bg-brand/10 transition-all">
                        <div className="w-10 h-10 bg-brand text-white flex items-center justify-center flex-shrink-0"><i className="fas fa-magic"></i></div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">Lasă Ora de Sibiu să aleagă</div>
                          <div className="text-xs text-slate-500">Echipa publică la cele mai bune momente pentru audiență maximă</div>
                        </div>
                        <i className="fas fa-arrow-right text-brand"></i>
                      </button>
                    </div>
                  ) : order.socialChoice === "auto" ? (
                    <div className="flex items-center gap-4 p-4 border-2 border-green-200 bg-green-50">
                      <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center flex-shrink-0"><i className="fas fa-check"></i></div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Echipa ODS programează postările</div>
                        <div className="text-xs text-slate-500">Postările vor fi publicate la momentele optime. Vei vedea programarea aici.</div>
                      </div>
                      <button className="text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase" onClick={() => upd({ socialChoice: null })}>Schimbă</button>
                    </div>
                  ) : (
                    /* Manual scheduling */
                    <div>
                      {(order.reposts || []).length > 0 && (
                        <div className="space-y-3 mb-4">
                          {(order.reposts || []).map((entry, i) => {
                            const parts = entry.split("|"); const dateStr = parts[0]; const timeStr = parts[1] || "orice";
                            const d = new Date(dateStr);
                            return (
                              <div key={i} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                                <div className="bg-cta text-white w-12 text-center py-1 flex-shrink-0">
                                  <div className="text-[9px] font-bold">{d.toLocaleDateString("ro-RO", { month: "short" }).toUpperCase()}</div>
                                  <div className="text-sm font-black">{d.getDate()}</div>
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-slate-900">Postare FB + IG</div>
                                  <div className="text-[11px] text-slate-500">{timeStr === "orice" ? "Orice oră" : timeStr}</div>
                                </div>
                                <button className="text-[11px] font-black text-slate-400 hover:text-red-500" onClick={() => upd({ reposts: (order.reposts || []).filter((_, j) => j !== i) })}>
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input type="date" className="flex-1 p-3 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm"
                          value={repostDay} onChange={e => setRD(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                        <select className="p-3 bg-slate-50 border-2 border-slate-200 focus:border-slate-900 outline-none text-sm" value={repostTime} onChange={e => setRT(e.target.value)}>
                          <option value="orice">Orice oră</option>
                          {Array.from({ length: 15 }, (_, i) => i + 7).map(h => <option key={h} value={String(h).padStart(2, "0") + ":00"}>{String(h).padStart(2, "0") + ":00"}</option>)}
                        </select>
                        <button className="px-5 py-3 bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all disabled:opacity-50 border-2 border-slate-900 whitespace-nowrap"
                          onClick={() => { if (repostDay) { upd({ reposts: [...(order.reposts || []), repostDay + "|" + repostTime] }); setRD(""); setRT("orice"); } }} disabled={!repostDay}>
                          Adaugă
                        </button>
                      </div>
                      <button className="text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase mt-2" onClick={() => upd({ socialChoice: null })}>
                        <i className="fas fa-arrow-left mr-1"></i>Schimbă metoda
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AI TOOLS */}
              <AdCopyWriter businessName={order.company || order.name} />
              <BannerGenerator orderId={order.id} businessName={order.company || order.name} />

              {/* ANALYTICS */}
              {order.status === "published" && (
                <div className="bg-slate-900 text-white p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[11px] font-bold text-brand uppercase tracking-[2px]">Statistici live</div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-[2px]">
                      <span className="w-2 h-2 bg-green-500 animate-pulse"></span> Live Sync
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
                    {[
                      { l: "Vizualizări", v: (order.stats?.views || 0).toLocaleString("ro") },
                      { l: "Click-uri", v: (order.stats?.clicks || 0).toLocaleString("ro") },
                      { l: "Reach Social", v: ((order.stats?.fbReach || 0) + (order.stats?.igReach || 0)).toLocaleString("ro") },
                      { l: "Engagement", v: (order.stats?.shares || 0).toLocaleString("ro") },
                    ].map((a, i) => (
                      <div key={i} className="bg-slate-900 p-3 sm:p-4">
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2">{a.l}</div>
                        <div className="text-2xl font-black">{a.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* CONTACT */}
          <div className="bg-white border-2 border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-400">Ai întrebări? <strong className="text-slate-700">{ODS.phone}</strong></span>
            <a href={"https://wa.me/40746752240?text=Salut,+comanda+" + (order.id || "").toUpperCase()} target="_blank" rel="noopener"
              className="px-5 py-2.5 bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all flex items-center gap-2 border-2 border-green-600">
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* TAB: ORDER HISTORY */}
      {tab === "history" && (
        <div className="space-y-3">
          {allOrders.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 p-8 text-center text-slate-400 text-sm">Nu ai comenzi anterioare.</div>
          ) : allOrders.map(o => {
            const oPkg = packages.find(p => p.id === o.packageId);
            const isActive = o.id === order.id;
            return (
              <button key={o.id} onClick={() => switchOrder(o)}
                className={`w-full text-left bg-white border-2 p-4 flex items-center gap-4 transition-all ${isActive ? 'border-brand bg-brand/5' : 'border-slate-200 hover:border-slate-400'}`}>
                <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${o.isAnunt ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  <i className={`fas ${o.isAnunt ? 'fa-newspaper' : 'fa-box'}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-900 truncate">{o.packageName || oPkg?.name || o.packageId}</div>
                  <div className="text-[11px] text-slate-500">{new Date(o.date).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-slate-900">{(o.total || o.price)?.toLocaleString("ro")} lei</div>
                  <div className={`text-[10px] font-bold uppercase ${o.status === "published" ? 'text-green-600' : o.status === "review" ? 'text-amber-600' : 'text-blue-600'}`}>
                    {o.status === "published" ? "Publicat" : o.status === "review" ? "În lucru" : "Activ"}
                  </div>
                </div>
                {isActive && <i className="fas fa-check-circle text-brand flex-shrink-0"></i>}
              </button>
            );
          })}
        </div>
      )}

      {/* TAB: INVOICES */}
      {tab === "invoices" && (
        <div className="space-y-4">
          {allOrders.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 p-8 text-center text-slate-400 text-sm">Nu ai facturi.</div>
          ) : allOrders.map(o => {
            const oPkg = packages.find(p => p.id === o.packageId);
            const oTva = o.tva || Math.round((o.price || 0) * 0.19);
            const oTotal = o.total || ((o.price || 0) + oTva);
            return (
              <div key={o.id} className="bg-white border-2 border-slate-200">
                <div className="flex items-center justify-between p-4 border-b-2 border-slate-100">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proformă</div>
                    <div className="text-sm font-black text-slate-900">#{o.id?.toUpperCase().slice(0, 8)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">{new Date(o.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}</div>
                    <div className={`text-[10px] font-bold uppercase ${o.payMethod === "card" ? 'text-green-600' : 'text-blue-600'}`}>
                      {o.payMethod === "card" ? "Plătit cu cardul" : "Transfer bancar"}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">{o.packageName || oPkg?.name}</span><span className="font-bold">{(o.price || 0).toLocaleString("ro")} lei</span></div>
                  {(o.addons || []).map((a, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-400">
                      <span>{a.name} ×{a.qty}</span><span>{(a.unitPrice * a.qty).toLocaleString("ro")} lei</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span>TVA (19%)</span><span>{oTva.toLocaleString("ro")} lei</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 pt-2 border-t-2 border-slate-200">
                    <span>Total</span><span>{oTotal.toLocaleString("ro")} lei</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="text-[10px] text-slate-400">Client: <strong>{o.company || o.name}</strong>{o.cui ? ` · CUI: ${o.cui}` : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
