import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const STATS = [
  { icon: "fab fa-facebook-f", val: "218k", color: "text-blue-400" },
  { icon: "fab fa-instagram", val: "18k", color: "text-pink-400" },
  { icon: "fab fa-tiktok", val: "24k", color: "text-cyan-400" },
];

export default function TopBar({ myOrders, onHome, onOpenOrder, onLogin, onConsult, onDashboard }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-lg shadow-navy/20 noprint">
      <div className="max-w-6xl mx-auto h-16 flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
          <img src="https://cdn.oradesibiu.ro/wp-content/uploads/2023/01/odsalbAsset-1.png" alt="Ora de Sibiu" className="h-6 sm:h-7" crossOrigin="anonymous" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          <span className="text-sm font-black text-white tracking-tight hidden" style={{display:'none'}}>OdS</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[10px] font-black text-white/40 tracking-[2px] sm:tracking-[3px] uppercase border-l border-white/20 pl-1.5 sm:pl-2">
              Publicitate
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 bg-[#e30613] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Business Console
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <i className={`${s.icon} text-[10px] ${s.color}`}></i>
                <span className="text-[10px] font-bold text-white/70">{s.val}</span>
              </div>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              {onDashboard && (
                <button onClick={onDashboard} className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-white/60 hover:text-white transition-colors">
                  <i className="fas fa-th-large text-[10px]"></i> Dashboard
                </button>
              )}
              <div ref={dropRef} className="relative">
                <div
                  className="w-9 h-9 rounded-full bg-white/15 border-2 border-white/25 text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-white/25 transition-colors"
                  onClick={() => setDropOpen(!dropOpen)}
                >
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
                {dropOpen && (
                  <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 min-w-[220px] py-1 z-[200] animate-fadeIn">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </div>
                    {myOrders.length > 0 && (
                      <>
                        <div className="px-4 pt-2 pb-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Comenzi</div>
                        {myOrders.slice(0, 5).map(o => (
                          <button key={o.id} className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => { onOpenOrder(o.id); setDropOpen(false); }}>
                            {o.packageName}
                          </button>
                        ))}
                        <div className="h-px bg-slate-100 mx-2" />
                      </>
                    )}
                    <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => { onConsult(); setDropOpen(false); }}>
                      Consultare nouă
                    </button>
                    <div className="h-px bg-slate-100 mx-2" />
                    <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-400 hover:bg-slate-50 transition-colors" onClick={() => { logout(); setDropOpen(false); }}>
                      Deconectează-te
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="text-[11px] font-bold text-white/60 hover:text-white transition-colors" onClick={onLogin}>
              Am deja cont
            </button>
          )}
          <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 hover:text-white/70 transition-colors">
            <i className="fab fa-whatsapp text-sm"></i>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
