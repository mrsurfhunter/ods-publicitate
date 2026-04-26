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
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

const STYLES = {
  success: "bg-green-50 border-green-500 text-green-700",
  error: "bg-red-50 border-red-500 text-red-700",
  info: "bg-blue-50 border-blue-500 text-blue-700",
};

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  return (
    <div
      className={`px-5 py-3 border-2 shadow-lg pointer-events-auto cursor-pointer font-semibold text-sm max-w-[360px] transition-all duration-300 ${STYLES[toast.type] || STYLES.info}`}
      style={{ transform: visible ? "translateX(0)" : "translateX(100px)", opacity: visible ? 1 : 0 }}
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
