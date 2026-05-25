import { useRef, useState } from "react";
import { gid } from "../../utils/storage";

const MIN_LANDSCAPE_RATIO = 1.2; // width/height — sub asta = portret/patrat

export default function ImageUploader({ label, images, onChange, multi, preferLandscape, hideTextHint }) {
  const ref = useRef();
  const [warning, setWarning] = useState("");
  const MAX_SIZE = 5 * 1024 * 1024;

  const checkOrientation = (dataUrl) => new Promise(resolve => {
    if (!preferLandscape) return resolve(null);
    const im = new Image();
    im.onload = () => {
      const ratio = im.naturalWidth / im.naturalHeight;
      if (ratio < MIN_LANDSCAPE_RATIO) {
        resolve(`Imaginea pare verticală (${im.naturalWidth}×${im.naturalHeight}). Pe site apare pe lat (16:9) — mai ai una orizontală?`);
      } else resolve(null);
    };
    im.onerror = () => resolve(null);
    im.src = dataUrl;
  });

  const handleFiles = async (files) => {
    let newWarning = "";
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE) { alert(`${file.name} depășește limita de 5MB.`); continue; }
      const dataUrl = await new Promise(res => {
        const r = new FileReader();
        r.onload = e => res(e.target.result);
        r.readAsDataURL(file);
      });
      const w = await checkOrientation(dataUrl);
      if (w) newWarning = w;
      const img = { id: gid(), name: file.name, data: dataUrl, file };
      images = multi ? [...images, img] : [img];
      onChange(images);
    }
    setWarning(newWarning);
  };

  return (
    <div>
      {label && (
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</label>
      )}

      {preferLandscape && !hideTextHint && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 text-[11px] leading-relaxed text-blue-900">
          <div className="font-bold mb-1"><i className="fas fa-circle-info mr-1"></i> Cum trebuie să fie imaginea principală</div>
          <ul className="list-disc list-inside space-y-0.5 text-blue-800">
            <li><strong>Orizontală (peisaj)</strong>, minim 1200×675 px (raport 16:9)</li>
            <li><strong>Fără text pe imagine</strong> — Facebook și Instagram reduc reach-ul pentru imagini cu text suprapus. Punem noi titlu peste.</li>
          </ul>
        </div>
      )}

      <div
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-slate-300 cursor-pointer hover:border-slate-900 hover:text-slate-900 transition-all bg-slate-50"
        style={{ padding: images.length > 0 ? 12 : 28 }}
      >
        {images.length === 0 && (
          <div className="text-center">
            <i className="fas fa-camera text-2xl text-slate-300 mb-2"></i>
            <div className="text-xs text-slate-400 font-medium">
              Click pentru a adăuga {multi ? "fotografii" : "fotografia principală"}
            </div>
          </div>
        )}
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <div key={img.id} className="relative w-18 h-18 overflow-hidden border-2 border-slate-200 group">
                <img src={img.data} className="w-full h-full object-cover" alt="" />
                <div
                  onClick={e => { e.stopPropagation(); onChange(images.filter((_, j) => j !== i)); setWarning(""); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white flex items-center justify-center text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >×</div>
              </div>
            ))}
            {multi && (
              <div className="w-18 h-18 border-2 border-dashed border-slate-200 flex items-center justify-center text-2xl text-slate-300">+</div>
            )}
          </div>
        )}
      </div>

      {warning && (
        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-snug">
          <i className="fas fa-triangle-exclamation mr-1"></i> {warning}
        </div>
      )}

      <input ref={ref} type="file" accept="image/*" multiple={multi} className="hidden" onChange={e => handleFiles(e.target.files)} />
    </div>
  );
}
