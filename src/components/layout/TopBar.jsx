export default function TopBar({ myOrders, onHome, onOpenOrder }) {
  return (
    <div className="topbar noprint">
      <div className="topbar-inner">
        <div className="topbar-logo" onClick={onHome}>Ora de Sibiu</div>
        <div className="topbar-actions">
          {myOrders.length > 0 && (
            <select
              onChange={e => { if (e.target.value) onOpenOrder(e.target.value); }}
              value=""
              style={{ padding: '5px 10px', fontSize: 11, borderRadius: 6, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontFamily: 'var(--font-body)' }}
            >
              <option value="" style={{ color: 'var(--c-navy)' }}>Comenzile mele ({myOrders.length})</option>
              {myOrders.map(o => (
                <option key={o.id} value={o.id} style={{ color: 'var(--c-navy)' }}>
                  {o.packageName} — {new Date(o.date).toLocaleDateString("ro-RO")}
                </option>
              ))}
            </select>
          )}
          <a href="https://wa.me/40746752240" target="_blank" rel="noopener" className="topbar-link">WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
