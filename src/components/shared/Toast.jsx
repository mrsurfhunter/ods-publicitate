import { useState, useEffect, useCallback, createContext, useContext } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const colors = {
    success: { bg: "var(--c-success-bg, #ecfdf5)", border: "var(--c-success, #059669)", color: "var(--c-success, #059669)" },
    error: { bg: "#fef2f2", border: "#dc2626", color: "#dc2626" },
    info: { bg: "var(--c-primary-light, #eff6ff)", border: "var(--c-primary, #0030BF)", color: "var(--c-primary, #0030BF)" },
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div
      style={{
        padding: "12px 20px", borderRadius: 8, background: c.bg,
        border: `1px solid ${c.border}`, color: c.color,
        fontFamily: "var(--font-heading, 'Bitter')", fontSize: 13, fontWeight: 600,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", pointerEvents: "auto",
        transform: visible ? "translateX(0)" : "translateX(100px)",
        opacity: visible ? 1 : 0, transition: "all 0.3s ease",
        cursor: "pointer", maxWidth: 360,
      }}
      onClick={onDismiss}
    >
      {toast.message}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
