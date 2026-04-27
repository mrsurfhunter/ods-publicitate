import { useState, useEffect, useRef } from "react";

const STYLES = [
  { id: "modern", l: "Modern & Clean", icon: "fa-wand-magic-sparkles" },
  { id: "bold", l: "Bold & Colorat", icon: "fa-bolt" },
  { id: "elegant", l: "Elegant & Minimalist", icon: "fa-gem" },
  { id: "playful", l: "Jucăuș & Creativ", icon: "fa-palette" },
  { id: "corporate", l: "Corporate & Serios", icon: "fa-briefcase" },
];

const FORMATS = [
  { id: "square", l: "Postare (1:1)", w: 1024, h: 1024, icon: "fa-square" },
  { id: "story", l: "Story (9:16)", w: 1024, h: 1792, icon: "fa-mobile-screen" },
  { id: "landscape", l: "Banner (16:9)", w: 1792, h: 1024, icon: "fa-rectangle-wide" },
];

export default function BannerGenerator({ orderId, businessName: initBiz }) {
  const [form, setForm] = useState({
    businessName: initBiz || "",
    offer: "",
    tagline: "",
    colors: "",
    style: "modern",
    format: "square",
    imageDescription: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [credits, setCredits] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    fetch(`/api/banners/credits/${orderId}`)
      .then(r => r.json())
      .then(setCredits)
      .catch(() => {});
  }, [orderId]);

  const upd = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage({ name: file.name, preview: reader.result });
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!form.businessName.trim()) return;
    setLoading(true);
    setError(null);
    setBanners([]);
    try {
      const body = {
        ...form,
        orderId,
        imageDescription: uploadedImage
          ? (form.imageDescription || "product/business photo provided by client") + ". Use warm, inviting tones matching the uploaded image."
          : form.imageDescription,
      };
      const r = await fetch("/api/banners/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) {
        if (data.needPayment) {
          setError("payment");
        } else {
          setError(data.error || "Eroare la generare");
        }
      } else {
        setBanners(data.banners || []);
        setCredits(prev => prev ? { ...prev, setsUsed: data.setsUsed, freeRemaining: data.freeRemaining } : prev);
      }
    } catch (e) {
      setError("Eroare de conexiune");
    }
    setLoading(false);
  };

  const purchaseSet = async () => {
    try {
      const r = await fetch("/api/banners/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (r.ok) {
        const data = await r.json();
        setCredits(prev => ({ ...prev, paidSets: data.paidSets, freeRemaining: data.freeRemaining }));
        setError(null);
      }
    } catch {}
  };

  const downloadBanner = (dataUrl, index) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `banner-${form.businessName.replace(/\s+/g, "-").toLowerCase()}-v${index + 1}.png`;
    a.click();
  };

  const canGenerate = credits && credits.freeRemaining > 0;

  return (
    <div className="bg-white border-2 border-slate-200">
      <div className="p-4 sm:p-6 border-b-2 border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-image text-lg"></i>
            </div>
            <div>
              <h3 className="font-black text-slate-900">Generator Bannere AI</h3>
              <p className="text-xs text-slate-500">3 variante generate automat pentru social media</p>
            </div>
          </div>
          {credits && (
            <div className="text-right">
              <div className={`text-sm font-black ${credits.freeRemaining > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                {credits.freeRemaining > 0 ? (
                  <><i className="fas fa-gift mr-1"></i>{credits.freeRemaining} set{credits.freeRemaining !== 1 ? 'uri' : ''} gratuit{credits.freeRemaining !== 1 ? 'e' : ''}</>
                ) : (
                  <><i className="fas fa-coins mr-1"></i>10 lei / set de 3</>
                )}
              </div>
              {credits.setsUsed > 0 && (
                <div className="text-[10px] text-slate-400">{credits.setsUsed} set{credits.setsUsed !== 1 ? 'uri' : ''} generat{credits.setsUsed !== 1 ? 'e' : ''}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FORM */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Numele afacerii *</label>
            <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm font-bold"
              value={form.businessName} onChange={e => upd("businessName", e.target.value)}
              placeholder="Restaurant La Cuptor" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ce promovezi</label>
            <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm"
              value={form.offer} onChange={e => upd("offer", e.target.value)}
              placeholder="Meniu nou de primăvară, reducere 20%..." />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mesaj principal pe banner</label>
          <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm font-bold"
            value={form.tagline} onChange={e => upd("tagline", e.target.value)}
            placeholder="Descoperă gusturile primăverii! -20% tot meniul" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Culorile brandului</label>
            <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm"
              value={form.colors} onChange={e => upd("colors", e.target.value)}
              placeholder="roșu și alb, #e30613" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Descriere element vizual (opțional)</label>
            <input className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 outline-none text-sm"
              value={form.imageDescription} onChange={e => upd("imageDescription", e.target.value)}
              placeholder="farfurie cu paste, interior restaurant..." />
          </div>
        </div>

        {/* STYLE */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stil</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => upd("style", s.id)}
                className={`px-3 py-2 text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                  form.style === s.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-purple-400'
                }`}>
                <i className={`fas ${s.icon} text-[10px]`}></i> {s.l}
              </button>
            ))}
          </div>
        </div>

        {/* FORMAT */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Format</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => upd("format", f.id)}
                className={`px-3 py-2 text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                  form.format === f.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-purple-400'
                }`}>
                <i className={`fas ${f.icon} text-[10px]`}></i> {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Imagine proprie (opțional)
          </label>
          <div className="flex items-center gap-3">
            <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="px-4 py-2.5 bg-slate-50 text-slate-600 text-xs font-bold border-2 border-slate-200 hover:border-purple-400 transition-all flex items-center gap-2">
              <i className="fas fa-upload"></i>
              {uploadedImage ? "Schimbă imaginea" : "Încarcă imagine"}
            </button>
            {uploadedImage && (
              <div className="flex items-center gap-2">
                <img src={uploadedImage.preview} alt="" className="w-10 h-10 object-cover border border-slate-200" />
                <span className="text-xs text-slate-500">{uploadedImage.name}</span>
                <button onClick={() => setUploadedImage(null)} className="text-red-400 hover:text-red-600 text-xs">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Imaginea va fi folosită ca referință pentru stilul bannerului</p>
        </div>

        {/* GENERATE BUTTON */}
        {error === "payment" ? (
          <div className="p-4 bg-amber-50 border-2 border-amber-300">
            <div className="flex items-center gap-3 mb-3">
              <i className="fas fa-coins text-amber-500 text-lg"></i>
              <div>
                <div className="text-sm font-black text-slate-900">Setul gratuit a fost folosit</div>
                <div className="text-xs text-slate-500">Fiecare set suplimentar de 3 variante costă <strong>10 lei</strong></div>
              </div>
            </div>
            <button onClick={purchaseSet}
              className="w-full py-3 bg-amber-500 text-white font-black text-xs uppercase tracking-widest border-2 border-amber-500 hover:bg-amber-600 transition-all">
              <i className="fas fa-unlock mr-2"></i>Cumpără set suplimentar — 10 lei
            </button>
          </div>
        ) : (
          <button onClick={generate} disabled={loading || !form.businessName.trim() || (!canGenerate && !loading)}
            className="w-full py-4 bg-purple-600 text-white font-black text-sm uppercase tracking-widest border-2 border-purple-600 hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <><i className="fas fa-spinner animate-spin mr-2"></i>Se generează 3 variante... (30-60 sec)</>
            ) : (
              <><i className="fas fa-wand-magic-sparkles mr-2"></i>Generează 3 variante de banner</>
            )}
          </button>
        )}

        {error && error !== "payment" && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            <i className="fas fa-exclamation-triangle mr-1"></i> {error}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {banners.length > 0 && (
        <div className="border-t-2 border-slate-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-900">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              {banners.length} variante generate
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click pentru download</span>
          </div>
          <div className={`grid gap-4 ${form.format === 'story' ? 'grid-cols-3' : form.format === 'landscape' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {banners.map((src, i) => (
              <div key={i} className="group relative border-2 border-slate-200 hover:border-purple-400 transition-all cursor-pointer"
                onClick={() => downloadBanner(src, i)}>
                <img src={src} alt={`Banner varianta ${i + 1}`} className="w-full" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <i className="fas fa-download text-2xl mb-1"></i>
                    <div className="text-xs font-bold">Varianta {i + 1}</div>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1">
                  V{i + 1}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">
            Click pe banner pentru a-l descărca. Poți genera un alt set {credits?.freeRemaining > 0 ? 'gratuit' : 'cu 10 lei'}.
          </p>
        </div>
      )}
    </div>
  );
}
