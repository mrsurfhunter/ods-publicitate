export async function lookupCUI(cui) {
  const c = cui.toString().replace(/\D/g, "");
  if (!c || c.length < 2) return null;
  try {
    const r = await fetch("/api/cui/" + c);
    if (!r.ok) return null;
    const d = await r.json();
    if (d.company) return d;
  } catch { /* ignore */ }
  return null;
}
