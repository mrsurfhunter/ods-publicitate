import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function TopBar({ myOrders, onHome, onOpenOrder, onLogin, onConsult }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="topbar noprint">
      <div className="topbar-inner">
        <div className="topbar-logo" onClick={onHome}>
          <img src="https://cdn.oradesibiu.ro/wp-content/uploads/2023/01/odsalbAsset-1.png" alt="Ora de Sibiu" className="topbar-logo-img" />
          <span className="topbar-logo-pub">PUBLICITATE</span>
        </div>
        <div className="topbar-actions">
          {isAuthenticated ? (
            <div ref={dropRef} style={{ position: "relative" }}>
              <div className="topbar-user" onClick={() => setDropOpen(!dropOpen)}>
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              {dropOpen && (
                <div className="topbar-dropdown">
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--c-border)" }}>
                    <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: "var(--c-text)" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "var(--c-muted)" }}>{user.email}</div>
                  </div>
                  {myOrders.length > 0 && (
                    <>
                      <div style={{ padding: "6px 16px", fontSize: 10, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Comenzi</div>
                      {myOrders.slice(0, 5).map(o => (
                        <button key={o.id} className="topbar-dropdown-item" onClick={() => { onOpenOrder(o.id); setDropOpen(false); }}>
                          {o.packageName}
                        </button>
                      ))}
                      <div className="topbar-dropdown-sep" />
                    </>
                  )}
                  <button className="topbar-dropdown-item" onClick={() => { onConsult(); setDropOpen(false); }}>
                    Consultare noua
                  </button>
                  <div className="topbar-dropdown-sep" />
                  <button className="topbar-dropdown-item" style={{ color: "var(--c-muted)" }} onClick={() => { logout(); setDropOpen(false); }}>
                    Deconecteaza-te
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="topbar-link" onClick={onLogin}>
              Am deja cont
            </button>
          )}
          <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="topbar-link" style={{ color: "rgba(255,255,255,0.5)" }}>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
