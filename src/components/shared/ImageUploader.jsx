import { useRef } from "react";
import { gid } from "../../utils/storage";

export default function ImageUploader({ label, images, onChange, multi }) {
  const ref = useRef();
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_SIZE) { alert(`${file.name} depășește limita de 5MB.`); return; }
      const reader = new FileReader();
      reader.onload = e => {
        const img = { id: gid(), name: file.name, data: e.target.result, file };
        onChange(multi ? [...images, img] : [img]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</label>
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
                  onClick={e => { e.stopPropagation(); onChange(images.filter((_, j) => j !== i)); }}
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
      <input ref={ref} type="file" accept="image/*" multiple={multi} className="hidden" onChange={e => handleFiles(e.target.files)} />
    </div>
  );
}
