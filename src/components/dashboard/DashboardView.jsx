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
    if (!order.articleTitle || !order.articleText) { setWpMsg("Completati titlul si textul articolului."); return; }
    setWpL(true); setWpMsg(null);
    let featId = null;
    if (order.featuredImg?.[0]?.file) {
      const res = await wpUploadImage(order.featuredImg[0].file);
      if (res) featId = res.id;
    }
    let galleryHtml = "";
    for (const img of (order.gallery || [])) {
      if (img.file) { const res = await wpUploadImage(img.file); if (res) galleryHtml += `<!-- wp:image --><figure class="wp-block-image"><img src="${res.url}" alt=""/></figure><!-- /wp:image -->`; }
    }
    const content = order.articleText.split("\n").filter(p => p.trim()).map(p => `<!-- wp:paragraph --><p>${p}</p><!-- /wp:paragraph -->`).join("") + galleryHtml;
    const result = await wpCreateDraft({ title: order.articleTitle, content, featuredImage: featId });
    setWpL(false);
    if (result.success) { setWpMsg("ok"); upd({ wpDraftId: result.id, wpDraftUrl: result.link, status: "review" }); }
    else if (result.error === "no-config") { setWpMsg("config"); }
    else { setWpMsg("Eroare: " + result.error); }
  };

  const STEPS = [
    { l: "Plata confirmata", done: true },
    { l: pkg?.hasArticle ? "Continut trimis" : "Materiale primite", done: !!order.contentChoice },
    { l: "In lucru", done: order.status === "review" || order.status === "published" },
    { l: "Publicat", done: order.status === "published" },
  ];

  return (
    <div className="view-enter" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div className="dash-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="dash-tag">Dashboard</div>
            {user && <div className="dash-greeting">Bine ai revenit, {user.name}!</div>}
            <h2 className="dash-title">{order.company || order.name}</h2>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Pachet: <strong style={{ color: '#fff' }}>{pkg?.name}</strong></div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', borderColor: 'transparent' }} onClick={onBack}>Inapoi</button>
        </div>
      </div>

      {/* Progress */}
      <div className="card card-static card-padding" style={{ marginBottom: 16 }}>
        <div className="steps-bar" style={{ padding: 0, boxShadow: 'none', border: 'none' }}>
          {STEPS.map((s, i) => (
            <div key={i} className="step-item">
              <div className={`step-circle ${s.done ? 'done' : 'pending'}`}>{s.done ? "✓" : (i + 1)}</div>
              <div className={`step-label ${s.done ? '' : 'text-muted'}`} style={s.done ? { color: 'var(--c-success)' } : undefined}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content section */}
      {pkg?.hasArticle && (
        <div className="card card-static card-padding" style={{ marginBottom: 16 }}>
          <h3 className="heading-sm" style={{ color: 'var(--c-primary)', marginBottom: 12 }}>Continutul articolului</h3>
          {!order.contentChoice ? (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ flex: 1, minWidth: 200, padding: 18, textAlign: 'left', borderRadius: 'var(--radius)' }} onClick={() => upd({ contentChoice: "redactor", status: "review" })}>
                <div><div style={{ fontWeight: 800, fontSize: 15 }}>Vreau un redactor</div>
                <div style={{ fontSize: 12, fontWeight: 400, opacity: .8, marginTop: 4 }}>Veti fi contactat de un redactor</div></div>
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, minWidth: 200, padding: 18, textAlign: 'left', borderRadius: 'var(--radius)' }} onClick={() => upd({ contentChoice: "propriu" })}>
                <div><div style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-primary)' }}>Trimit eu materialele</div>
                <div style={{ fontSize: 12, color: 'var(--c-text2)', marginTop: 4 }}>Scriu textul si incarc pozele aici</div></div>
              </button>
            </div>
          ) : order.contentChoice === "redactor" ? (
            <div style={{ background: 'var(--c-primary-light)', borderRadius: 'var(--radius-sm)', padding: 16, border: '1px solid rgba(0,48,191,0.1)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-primary)', marginBottom: 4 }}>✍️ Un redactor va scrie articolul</div>
              <div className="text-sm text-secondary">Veti fi contactat la numarul <strong>{order.phone}</strong> in urmatoarele 24h.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-row">
                <label className="label">Titlul articolului *</label>
                <input className="input" style={{ fontSize: 16, fontWeight: 700 }} value={order.articleTitle || ""} onChange={e => upd({ articleTitle: e.target.value })} placeholder="Ex: Restaurant La Cuptor - Meniu nou de primavara in Sibiu" />
              </div>
              <div className="form-row">
                <label className="label">Textul articolului *</label>
                <textarea className="textarea" value={order.articleText || ""} onChange={e => upd({ articleText: e.target.value })} placeholder="Scrieti sau lipiti textul articolului aici." style={{ minHeight: 200 }} />
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{(order.articleText || "").trim().split(/\s+/).filter(Boolean).length} cuvinte</div>
              </div>
              <ImageUploader label="Fotografie principala (cover)" images={order.featuredImg || []} onChange={imgs => upd({ featuredImg: imgs })} multi={false} />
              <ImageUploader label="Galerie foto (optional)" images={order.gallery || []} onChange={imgs => upd({ gallery: imgs })} multi={true} />
              <button className="btn btn-dark btn-block" onClick={submitToWP} disabled={wpLoading || !order.articleTitle || !order.articleText}>
                {wpLoading ? "Se trimite..." : "Trimite articolul spre publicare"}
              </button>
              {wpMsg === "ok" && <div style={{ padding: 12, background: 'var(--c-success-bg)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--c-success)', fontWeight: 600 }}>✓ Articolul a fost trimis ca draft in WordPress!</div>}
              {wpMsg === "config" && <div style={{ padding: 12, background: 'var(--c-primary-light)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--c-primary)' }}>Articolul a fost salvat local. Configurati WP_USER + WP_PASS pentru publicare automata.</div>}
              {wpMsg && wpMsg !== "ok" && wpMsg !== "config" && <div style={{ padding: 12, background: 'var(--c-accent-light)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--c-accent)' }}>{wpMsg}</div>}
              {order.wpDraftUrl && <div style={{ padding: 12, background: 'var(--c-success-bg)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>Draft creat: <a href={order.wpDraftUrl} target="_blank" rel="noopener" style={{ color: 'var(--c-primary)' }}>{order.wpDraftUrl}</a></div>}
            </div>
          )}
        </div>
      )}

      {/* Calendar reposturi */}
      <div className="card card-static card-padding" style={{ marginBottom: 16 }}>
        <h3 className="heading-sm" style={{ color: 'var(--c-primary)', marginBottom: 10 }}>Calendar postari sociale</h3>
        <p className="text-xs text-muted" style={{ marginBottom: 12 }}>Alege zilele si ora la care vrei sa fie publicate postarile pe Facebook si Instagram:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {(order.reposts || []).map((entry, i) => {
            const parts = entry.split("|"); const dateStr = parts[0]; const timeStr = parts[1] || "orice";
            return (
              <span key={i} style={{ background: 'var(--c-primary-light)', color: 'var(--c-primary)', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                {new Date(dateStr).toLocaleDateString("ro-RO")} la {timeStr === "orice" ? "orice ora" : timeStr}
                <span style={{ cursor: 'pointer', fontWeight: 800 }} onClick={() => upd({ reposts: (order.reposts || []).filter((_, j) => j !== i) })}>×</span>
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 140px' }}>
            <label className="label">Data</label>
            <input type="date" className="input" value={repostDay} onChange={e => setRD(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div style={{ flex: '0 0 130px' }}>
            <label className="label">Ora</label>
            <select className="select" value={repostTime} onChange={e => setRT(e.target.value)}>
              <option value="orice">Orice ora</option>
              {Array.from({ length: 15 }, (_, i) => i + 7).map(h => {
                const hh = String(h).padStart(2, "0") + ":00";
                return <option key={h} value={hh}>{hh}</option>;
              })}
            </select>
          </div>
          <button className="btn btn-dark btn-sm" onClick={() => { if (repostDay) { upd({ reposts: [...(order.reposts || []), repostDay + "|" + repostTime] }); setRD(""); setRT("orice"); } }} disabled={!repostDay}>Adauga</button>
        </div>
      </div>

      {/* Stats */}
      <div className="card card-static card-padding" style={{ marginBottom: 16 }}>
        <h3 className="heading-sm" style={{ color: 'var(--c-primary)', marginBottom: 14 }}>Statistici</h3>
        {order.status !== "published" ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--c-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <div className="text-sm">Statisticile apar dupa publicare</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
            {[
              { l: "Vizualizari", v: order.stats.views, c: 'var(--c-primary)' },
              { l: "Click-uri", v: order.stats.clicks, c: 'var(--c-accent)' },
              { l: "Distribuiri", v: order.stats.shares, c: 'var(--c-success)' },
              { l: "Reach FB", v: order.stats.fbReach, c: 'var(--c-blue)' },
              { l: "Reach IG", v: order.stats.igReach, c: '#E1306C' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--c-bg)', borderRadius: 'var(--radius-sm)', padding: 12, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, color: s.c }}>{s.v.toLocaleString("ro")}</div>
                <div className="text-xs text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact */}
      <div style={{ background: 'var(--c-bg-warm)', borderRadius: 'var(--radius-sm)', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, border: '1px solid var(--c-border)' }}>
        <div className="text-xs text-muted">Ai intrebari? Contact: <strong style={{ color: 'var(--c-primary)' }}>{ODS.phone}</strong> (WhatsApp)</div>
        <a href={"https://wa.me/40746752240?text=Salut,+comanda+" + order.id.toUpperCase()} target="_blank" rel="noopener" className="btn btn-sm" style={{ background: 'var(--c-success)', color: '#fff', textDecoration: 'none' }}>WhatsApp</a>
      </div>
    </div>
  );
}
