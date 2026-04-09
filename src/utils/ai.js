export async function callAI(sys, usr) {
  try {
    const r = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sys, user: usr }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    return d.text || null;
  } catch {
    return null;
  }
}

export async function callConsult(data) {
  try {
    const r = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  } catch {
    return null;
  }
}
