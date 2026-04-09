export async function lookupCUI(cui) {
  const c = cui.toString().replace(/\D/g, "");
  if (!c || c.length < 2) return null;
  const body = JSON.stringify([{ cui: parseInt(c), data: new Date().toISOString().split("T")[0] }]);
  for (const url of [
    "https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva",
    "https://corsproxy.io/?" + encodeURIComponent("https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva"),
  ]) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      const d = await r.json();
      if (d.cod === 200 && d.found?.length > 0) {
        const f = d.found[0];
        return { company: f.denumire || "", address: f.adresa || "", regCom: f.nrRegCom || "", vat: f.scpTVA === true };
      }
    } catch { continue; }
  }
  return null;
}
