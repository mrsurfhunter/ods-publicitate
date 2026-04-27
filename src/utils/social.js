const ENDPOINT = "https://agent.ora.red/webhook/social-stats";
const CACHE_KEY = "ods-social-stats";
const CACHE_TTL = 3600000; // 1 hour

const DEFAULTS = {
  facebook: { followers: 220000, label: "Urmăritori Facebook" },
  instagram: { followers: 18609, label: "Followers Instagram" },
  tiktok: { followers: 25000, label: "Urmăritori TikTok" },
};

export async function fetchSocialStats() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached._ts < CACHE_TTL) return cached;
  } catch {}

  try {
    const r = await fetch(ENDPOINT);
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    d._ts = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(d));
    return d;
  } catch {
    return DEFAULTS;
  }
}

export function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".", ",") + "M";
  return n.toLocaleString("ro-RO");
}
