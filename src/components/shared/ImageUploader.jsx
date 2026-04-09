import { useRef } from "react";
import { gid } from "../../utils/storage";

export default function ImageUploader({ label, images, onChange, multi }) {
  const ref = useRef();

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = e => {
        const img = { id: gid(), name: file.name, data: e.target.result, file };
        onChange(multi ? [...images, img] : [img]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="form-row">
      <label className="label">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="img-dropzone"
        style={{
          border: '2px dashed var(--c-border)', borderRadius: 'var(--radius-sm)',
          padding: images.length > 0 ? 12 : 28, cursor: 'pointer',
          textAlign: 'center', background: 'var(--c-bg)', minHeight: 60,
        }}
      >
        {images.length === 0 && (
          <div>
            <div style={{ fontSize: 24, color: 'var(--c-muted)' }}>📷</div>
            <div className="text-xs text-muted" style={{ marginTop: 4 }}>
              Click pentru a adauga {multi ? "fotografii" : "fotografia principala"}
            </div>
          </div>
        )}
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <div key={img.id} style={{ position: 'relative', width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--c-border)' }}>
                <img src={img.data} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                <div
                  onClick={e => { e.stopPropagation(); onChange(images.filter((_, j) => j !== i)); }}
                  style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer' }}
                >×</div>
              </div>
            ))}
            {multi && <div style={{ width: 72, height: 72, borderRadius: 8, border: '2px dashed var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--c-muted)' }}>+</div>}
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple={multi} style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
    </div>
  );
}
