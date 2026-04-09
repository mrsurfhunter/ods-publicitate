export async function postLead(data) {
  try {
    const r = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function checkLead(email) {
  try {
    const r = await fetch("/api/leads/check?email=" + encodeURIComponent(email));
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
