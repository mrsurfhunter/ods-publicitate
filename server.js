import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: '2mb' }));

// Serve Vite build — hashed assets get long cache
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  maxAge: '1y',
  immutable: true,
}));
app.use(express.static(path.join(__dirname, 'dist')));

// ── Platform config (packages, addons, promotions) ──
const CONFIG_FILE = path.join(__dirname, 'data', 'platform-config.json');

const CONFIG_DEFAULT = path.join(__dirname, 'platform-config.default.json');

// Seed config on first run: try default file, then write inline fallback
if (!fs.existsSync(CONFIG_FILE)) {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(CONFIG_DEFAULT)) {
    fs.copyFileSync(CONFIG_DEFAULT, CONFIG_FILE);
    console.log('Seeded platform config from default file');
  } else {
    // Inline minimal seed so the app works even without the default file
    const seed = {
      packages: [
        { id: "social-single", name: "Postare Singulară", cat: "oneTime", price: 300, sub: null, color: "#F59E0B", headline: "O postare profesională pe Facebook și Instagram", inc: [{ w: "1 postare Facebook", d: "220.000+ urmăritori" }, { w: "1 postare Instagram", d: "18.000+ urmăritori" }, { w: "1 story Facebook + Instagram", d: "Format vertical" }, { w: "Link direct", d: "Site, FB, telefon sau WhatsApp" }], delivery: "Publicare în maxim 24h", hasArticle: false, active: true },
        { id: "boost-express", name: "Boost Express", cat: "oneTime", price: 450, sub: null, color: "#F97316", headline: "Postare + boost Meta Ads cu reach garantat 5.000+", inc: [{ w: "1 postare Facebook + Instagram", d: "Design profesional" }, { w: "1 story pe ambele platforme", d: "Format vertical" }, { w: "Boost Meta Ads inclus", d: "50 lei buget, reach 5.000+" }, { w: "Raport performanță", d: "Reach, click-uri, engagement" }], delivery: "Activ în 24-48h", hasArticle: false, active: true },
        { id: "social-monthly", name: "Social Lunar", cat: "monthly", price: 700, sub: 600, color: "#3B82F6", headline: "Prezență constantă pe rețelele Ora de Sibiu", inc: [{ w: "4 postări/lună Facebook", d: "Reach organic garantat" }, { w: "4 postări/lună Instagram", d: "Feed + Stories" }, { w: "2 story-uri/lună", d: "Format vertical" }, { w: "1 Reel/TikTok pe lună", d: "Video scurt" }, { w: "Raport lunar", d: "Reach, engagement, click-uri" }], delivery: "Prima postare în max 24h", hasArticle: false, active: true },
        { id: "articol-start", name: "Articol Start", cat: "monthly", price: 1200, sub: 1000, color: "#8B5CF6", headline: "Articol publicitar pe site + promovare social media", inc: [{ w: "1 articol publicitar pe site", d: "Prima pagină 14 zile" }, { w: "2 postări/lună FB + IG", d: "Promovare articol" }, { w: "1 story/lună", d: "Facebook + Instagram" }], delivery: "Publicat în max 5 zile", hasArticle: true, active: true },
        { id: "business", name: "Business", cat: "monthly", price: 1800, sub: 1500, color: "#059669", pop: true, headline: "Articol profesional + promovare completă pe toate canalele", inc: [{ w: "1 articol advertorial profesional", d: "Prima pagină 30 zile" }, { w: "6 postări/lună FB + IG", d: "Design profesional" }, { w: "2 story-uri/lună", d: "Facebook + Instagram" }, { w: "1 Reel/TikTok pe lună", d: "Video scurt" }, { w: "Programare + aprobare", d: "Tu decizi când apare" }, { w: "Raport lunar", d: "Toate canalele" }], delivery: "Gata în 3-5 zile", hasArticle: true, active: true },
        { id: "business-plus", name: "Business Plus", cat: "monthly", price: 2400, sub: 2000, color: "#0EA5E9", headline: "Tot din Business + push + newsletter + mai mult conținut", inc: [{ w: "Tot ce include Business", d: "Articol 30 zile + social" }, { w: "8 postări/lună FB + IG", d: "Dublu conținut" }, { w: "3 story-uri/lună", d: "Facebook + Instagram" }, { w: "2 Reels/TikTok", d: "Video scurt" }, { w: "Push notification", d: "15.000 abonați" }, { w: "Newsletter mention", d: "600 abonați" }], delivery: "Setup în 5 zile", hasArticle: true, active: true },
        { id: "premium", name: "Premium 360°", cat: "monthly", price: 3500, sub: 2800, color: "#7C3AED", headline: "Pachet complet: articol + banner + social + push + newsletter + manager dedicat", inc: [{ w: "Tot ce include Business Plus", d: "Articol + social + push + newsletter" }, { w: "Banner 300×250 pe site", d: "~1.5M afișări/lună" }, { w: "12 postări/lună FB + IG", d: "Triplu conținut" }, { w: "4 story-uri + 4 Reels/lună", d: "Video content" }, { w: "Calendar editorial", d: "Planificare lunară" }, { w: "Manager dedicat", d: "Contact direct" }], delivery: "Setup în 5 zile", hasArticle: true, active: true },
        { id: "enterprise", name: "Enterprise", cat: "monthly", price: 5000, sub: 4200, color: "#DC2626", headline: "Tot ce oferim, personalizat pentru afacerea ta", inc: [{ w: "Tot ce include Premium 360°", d: "Complet" }, { w: "4 articole/lună", d: "Conținut editorial constant" }, { w: "Meta Ads 500 lei inclus", d: "Campanie gestionată" }, { w: "1 video profesional/lună", d: "Filmat și editat" }, { w: "Acoperire eveniment", d: "Reporter + fotograf" }, { w: "Strategie lunară", d: "Planificare cu echipa" }], delivery: "Setup în 7 zile", hasArticle: true, active: true },
      ],
      addons: [
        { id: "addon-post", name: "Postare suplimentară FB+IG", icon: "fa-pen-to-square", price: 250, sub: null, unit: "/postare", multi: true, qtyPricing: [{ min: 1, price: 250 }, { min: 2, price: 200 }, { min: 3, price: 150 }], desc: "Postare profesională pe Facebook și Instagram", active: true },
        { id: "addon-banner", name: "Banner pe Site", icon: "fa-rectangle-ad", price: 1200, sub: 1000, unit: "/lună", multi: false, qtyPricing: null, desc: "Banner 300×250, ~1.5M afișări/lună", active: true },
        { id: "addon-push", name: "Push Notification", icon: "fa-bell", price: 300, sub: null, unit: "/trimitere", multi: true, qtyPricing: null, desc: "Notificare push către 15.000 abonați", active: true },
        { id: "addon-newsletter", name: "Newsletter Mention", icon: "fa-envelope", price: 250, sub: null, unit: "/trimitere", multi: true, qtyPricing: null, desc: "Menționare sponsorizată în newsletter", active: true },
        { id: "addon-boost", name: "Meta Ads Boost", icon: "fa-rocket", price: 400, sub: null, unit: "", multi: true, qtyPricing: null, desc: "Campanie Meta Ads gestionată (200 lei buget + 200 management)", active: true },
        { id: "addon-video", name: "Video Reel/TikTok", icon: "fa-video", price: 500, sub: null, unit: "/video", multi: true, qtyPricing: null, desc: "Video scurt filmat și editat", active: true },
        { id: "addon-event", name: "Acoperire Eveniment", icon: "fa-camera", price: 800, sub: null, unit: "/eveniment", multi: false, qtyPricing: null, desc: "Reporter + fotograf, articol live, galerie", active: true },
      ],
      promotions: [],
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(seed, null, 2));
    console.log('Seeded platform config from inline defaults');
  }
}

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch { /* ignore */ }
  return { packages: [], addons: [], promotions: [], updatedAt: null };
}

function writeConfig(cfg) {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  cfg.updatedAt = new Date().toISOString();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

function adminAuth(req, res) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) { res.status(503).json({ error: 'Admin not configured' }); return false; }
  if (req.headers['x-admin-key'] !== pw) { res.status(401).json({ error: 'Unauthorized' }); return false; }
  return true;
}

// Public config: active packages + addons + active promotions
app.get('/api/config', (_req, res) => {
  const cfg = readConfig();
  const now = new Date().toISOString();
  res.json({
    packages: cfg.packages.filter(p => p.active !== false),
    addons: cfg.addons.filter(a => a.active !== false),
    promotions: (cfg.promotions || []).filter(p =>
      p.active && (!p.startDate || p.startDate <= now) && (!p.endDate || p.endDate >= now)
    ),
  });
});

// Admin: full config
app.get('/api/admin/config', (req, res) => {
  if (!adminAuth(req, res)) return;
  res.json(readConfig());
});

// Admin: update packages
app.put('/api/admin/packages', (req, res) => {
  if (!adminAuth(req, res)) return;
  const { packages } = req.body;
  if (!Array.isArray(packages)) return res.status(400).json({ error: 'packages must be array' });
  const cfg = readConfig();
  cfg.packages = packages;
  writeConfig(cfg);
  res.json({ ok: true, count: packages.length });
});

// Admin: update addons
app.put('/api/admin/addons', (req, res) => {
  if (!adminAuth(req, res)) return;
  const { addons } = req.body;
  if (!Array.isArray(addons)) return res.status(400).json({ error: 'addons must be array' });
  const cfg = readConfig();
  cfg.addons = addons;
  writeConfig(cfg);
  res.json({ ok: true, count: addons.length });
});

// Admin: CRUD promotions
app.post('/api/admin/promotions', (req, res) => {
  if (!adminAuth(req, res)) return;
  const promo = req.body;
  if (!promo.id || !promo.name) return res.status(400).json({ error: 'Missing id or name' });
  const cfg = readConfig();
  if (!cfg.promotions) cfg.promotions = [];
  const idx = cfg.promotions.findIndex(p => p.id === promo.id);
  if (idx >= 0) cfg.promotions[idx] = promo;
  else cfg.promotions.push(promo);
  writeConfig(cfg);
  res.json({ ok: true });
});

app.delete('/api/admin/promotions/:id', (req, res) => {
  if (!adminAuth(req, res)) return;
  const cfg = readConfig();
  cfg.promotions = (cfg.promotions || []).filter(p => p.id !== req.params.id);
  writeConfig(cfg);
  res.json({ ok: true });
});

// ── /api/ai — generic AI proxy (text enhancement) ──
app.post('/api/ai', async (req, res) => {
  const { system, user } = req.body || {};
  if (!system || !user) {
    return res.status(400).json({ error: 'Missing system or user field' });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI not configured' });
  }
  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const text = message.content.map(b => b.text || '').join('\n').trim();
    res.json({ text });
  } catch (e) {
    console.error('AI error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── /api/consult — AI package recommendation (4-tier) ──

function buildConsultSystem() {
  const cfg = readConfig();
  const pkgs = cfg.packages.filter(p => p.active !== false);
  const adds = cfg.addons.filter(a => a.active !== false);

  const pkgList = pkgs.map((p, i) =>
    `${i + 1}. ${p.id}: ${p.name}, ${p.price} lei${p.sub ? ` (${p.sub} lei abonament)` : ''}, ${p.cat === 'monthly' ? 'lunar' : 'o dată'}. ${p.headline}`
  ).join('\n');

  const addonList = adds.map(a =>
    `- ${a.id}: ${a.name}, ${a.price} lei${a.unit}. ${a.desc}`
  ).join('\n');

  return `Ești consultant de publicitate pentru Ora de Sibiu (oradesibiu.ro), cea mai citită publicație online din Sibiu cu 400.000+ vizitatori/lună, 220.000 urmăritori Facebook, 18.600 Instagram, 25.000 TikTok. Traficul este auditat BRAT.

Pachete disponibile:
${pkgList}

Add-ons disponibile (se adaugă la orice pachet):
${addonList}

Postările suplimentare (addon-post) au preț degresiv: 250 lei/1, 200 lei/buc la 2+, 150 lei/buc la 3+.

RĂSPUNDE EXCLUSIV în format JSON valid, fără markdown, fără backticks:
{
  "tiers": [
    {
      "id": "package-id",
      "tier": "start",
      "label": "Bun pentru start",
      "reasoning": "1-2 propoziții în română, la persoana a 2-a singular",
      "benefits": ["beneficiu1", "beneficiu2", "beneficiu3"],
      "addons": ["addon-id-sugerat"]
    },
    { "id": "...", "tier": "recommended", "label": "Recomandat pentru tine", ... },
    { "id": "...", "tier": "popular", "label": "Cel mai ales de afaceri ca tine", ... },
    { "id": "...", "tier": "max", "label": "Maximum impact", ... }
  ],
  "summary": "2-3 propoziții rezumat general al recomandării"
}

Reguli per tier:
- start: sub bugetul clientului, entry-level. Ideal pentru testare.
- recommended: pe buget, cel mai potrivit. HIGHLIGHTED.
- popular: ușor peste buget, efect de ancorare. Menționează "ales de 67% din afacerile similare".
- max: premium/aspirațional. Arată ce e posibil.

Reguli per tip afacere:
- Restaurante/HoReCa → accent pe visual: Reels, Stories, poze meniu. Sugerează addon-video.
- Servicii/Imobiliare → accent pe SEO: articole, prezență Google. Recomandă pachete cu articol.
- Evenimente → one-time packages (social-single, boost-express) + addon-event.
- Sănătate → conținut de încredere: articole profesionale, reputație.

Reguli per obiectiv:
- Mai mulți clienți → reach maxim: boost, postări multe, Meta Ads.
- Brand/reputație → articol persistent pe site + social constant.
- SEO → articol indexat Google, prima pagină cât mai mult.
- Lansare → boost-express sau addon-boost pentru impact rapid.

Reguli per materiale (hasContent):
- have-nothing → recomandă pachete managed (business+), menționează că echipa redactează.
- have-photos → pachete cu articol, menționează că redacția scrie textul.
- have-all → orice pachet, menționează upload ușor în dashboard.

Reguli per timeline:
- urgent/once → one-time packages (social-single, boost-express). NU recomanda abonamente.
- few-months → abonamente lunare, menționează prețul sub.
- ongoing → abonamente pe termen lung, accent pe economie la abonament.

Reguli importante:
- EXACT 4 tiere, fiecare cu ID de pachet VALID.
- Beneficiile trebuie personalizate pentru tipul afacerii, nu generice.
- Addons: sugerează maxim 2 per tier, relevante pentru client.
- Nu inventa pachete sau prețuri. Folosește doar ID-urile de mai sus.
- Tonul: profesional dar prietenos, fără exagerări.`;
}

function getValidIds() {
  const cfg = readConfig();
  const pkgIds = cfg.packages.filter(p => p.active !== false).map(p => p.id);
  const addonIds = cfg.addons.filter(a => a.active !== false).map(a => a.id);
  return { pkgIds, addonIds };
}

function fallbackRecommendation({ businessType, goal, budget, timeline, hasContent }) {
  const cfg = readConfig();
  const pkgs = cfg.packages.filter(p => p.active !== false);
  const ladder = pkgs.sort((a, b) => a.price - b.price);

  const isOnce = timeline === 'once' || timeline === 'urgent';

  let centerIdx;
  if (budget === 'sub-500') centerIdx = 0;
  else if (budget === '500-1000') centerIdx = Math.min(2, ladder.length - 1);
  else if (budget === '1000-2000') centerIdx = Math.min(3, ladder.length - 1);
  else if (budget === '2000-3500') centerIdx = Math.min(5, ladder.length - 1);
  else if (budget === 'peste-3500') centerIdx = Math.min(6, ladder.length - 1);
  else centerIdx = Math.min(4, ladder.length - 1); // nu-stiu → business

  if (isOnce && centerIdx > 1) centerIdx = 1;

  const pick = (offset) => ladder[Math.max(0, Math.min(ladder.length - 1, centerIdx + offset))];
  const startPkg = pick(-1);
  const recPkg = pick(0);
  const popPkg = pick(1);
  const maxPkg = pick(2);

  const genericBenefits = (pkg) => {
    const b = pkg.inc.slice(0, 3).map(x => x.w + (x.d ? ' — ' + x.d : ''));
    return b;
  };

  const suggestAddons = () => {
    const adds = [];
    if (hasContent === 'have-nothing') adds.push('addon-video');
    if (goal === 'more-clients' || goal === 'launch') adds.push('addon-boost');
    if (businessType === 'eveniment') adds.push('addon-event');
    return adds.slice(0, 2);
  };

  const addons = suggestAddons();

  return {
    tiers: [
      { id: startPkg.id, tier: 'start', label: 'Bun pentru start',
        reasoning: `${startPkg.name} este o opțiune accesibilă pentru a testa promovarea pe Ora de Sibiu.`,
        benefits: genericBenefits(startPkg), addons: [] },
      { id: recPkg.id, tier: 'recommended', label: 'Recomandat pentru tine',
        reasoning: `Pe baza bugetului și obiectivelor tale, ${recPkg.name} oferă cel mai bun raport calitate-preț.`,
        benefits: genericBenefits(recPkg), addons },
      { id: popPkg.id, tier: 'popular', label: 'Ales de 67% din afaceri similare',
        reasoning: `${popPkg.name} este ales de majoritatea afacerilor din Sibiu pentru promovare eficientă.`,
        benefits: genericBenefits(popPkg), addons: [] },
      { id: maxPkg.id, tier: 'max', label: 'Maximum impact',
        reasoning: `Pentru rezultate maxime, ${maxPkg.name} acoperă toate canalele și formatele disponibile.`,
        benefits: genericBenefits(maxPkg), addons: [] },
    ],
    summary: 'Pe baza preferințelor tale, am pregătit 4 opțiuni ordonate de la cea mai accesibilă la cea cu impact maxim.',
  };
}

app.post('/api/consult', async (req, res) => {
  const { businessType, goal, budget, timeline, hasContent } = req.body || {};
  if (!businessType || !goal || !budget || !timeline) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json(fallbackRecommendation({ businessType, goal, budget, timeline, hasContent }));
  }

  const userMsg = `Tipul afacerii: ${businessType}\nObiectiv: ${goal}\nBuget: ${budget}\nMateriale: ${hasContent || 'not-sure'}\nFrecvență: ${timeline}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const client = new Anthropic({ apiKey });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        temperature: 0.4,
        system: buildConsultSystem(),
        messages: [{ role: 'user', content: userMsg }],
      });

      let raw = message.content.map(b => b.text || '').join('\n').trim();
      raw = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');

      const data = JSON.parse(raw);
      const { pkgIds, addonIds } = getValidIds();

      if (!Array.isArray(data.tiers) || data.tiers.length < 1) throw new Error('No tiers');

      const validTiers = data.tiers.filter(t => pkgIds.includes(t.id)).map(t => ({
        id: t.id,
        tier: t.tier || 'recommended',
        label: t.label || '',
        reasoning: t.reasoning || '',
        benefits: Array.isArray(t.benefits) ? t.benefits.slice(0, 4) : [],
        addons: Array.isArray(t.addons) ? t.addons.filter(a => addonIds.includes(a)).slice(0, 2) : [],
      }));

      if (validTiers.length < 1) throw new Error('No valid tiers after filtering');

      return res.json({
        tiers: validTiers,
        summary: data.summary || '',
      });
    } catch (e) {
      console.error(`Consult attempt ${attempt + 1} failed:`, e.message);
      if (attempt === 1) {
        return res.json(fallbackRecommendation({ businessType, goal, budget, timeline, hasContent }));
      }
    }
  }
});

// ── /api/cui/:cui — company lookup via firmeapi.ro ──
app.get('/api/cui/:cui', async (req, res) => {
  const cui = (req.params.cui || '').replace(/\D/g, '');
  if (!cui || cui.length < 2) {
    return res.status(400).json({ error: 'CUI invalid' });
  }
  const apiKey = process.env.FIRMEAPI_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured' });
  }
  try {
    const r = await fetch(`https://www.firmeapi.ro/api/v1/firma/${cui}`, {
      headers: { 'X-API-KEY': apiKey },
    });
    const d = await r.json();
    if (d.success && d.data) {
      const addr = d.data.adresa_sediu_social;
      const address = [addr?.strada, addr?.numar, addr?.localitate, addr?.judet].filter(Boolean).join(', ');
      return res.json({
        company: d.data.denumire || '',
        address,
        regCom: d.data.nr_reg_com || '',
        vat: d.data.tva?.platitor === true,
      });
    }
    res.status(404).json({ error: 'CUI not found' });
  } catch (e) {
    console.error('CUI lookup error:', e.message);
    res.status(500).json({ error: 'Lookup failed' });
  }
});

// ── /api/leads — save lead data ──
const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');

function readLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch { /* ignore */ }
  return [];
}

function writeLeads(leads) {
  const dir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

app.post('/api/leads', (req, res) => {
  const { id, name, email, phone, company, source, createdAt, consultAnswers } = req.body || {};
  if (!email || !name) return res.status(400).json({ error: 'Missing name or email' });
  const leads = readLeads();
  const existing = leads.findIndex(l => l.id === id);
  const entry = {
    id: id || Date.now().toString(36),
    name, email, phone: phone || '', company: company || '',
    source: source || 'unknown', createdAt: createdAt || new Date().toISOString(),
    consultAnswers: consultAnswers || null,
    ip: req.ip, ua: req.get('user-agent') || '',
    updatedAt: new Date().toISOString(),
  };
  if (existing >= 0) leads[existing] = { ...leads[existing], ...entry };
  else leads.unshift(entry);
  writeLeads(leads);
  res.json({ ok: true });
});

app.get('/api/leads/check', (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Missing email' });
  const leads = readLeads();
  const found = leads.find(l => l.email?.toLowerCase() === email);
  res.json({ exists: !!found, name: found?.name || null });
});

// ── /api/wp/* — WordPress proxy (credentials stay server-side) ──

function wpAuth() {
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASS;
  if (!user || !pass) return null;
  return 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
}

const WP_URL = (process.env.WP_URL || 'https://www.oradesibiu.ro') + '/wp-json/wp/v2';

app.post('/api/wp/upload', async (req, res) => {
  const auth = wpAuth();
  if (!auth) return res.status(503).json({ error: 'WP not configured' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const r = await fetch(WP_URL + '/media', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
      },
      body,
    });
    if (!r.ok) throw new Error('WP HTTP ' + r.status);
    const d = await r.json();
    res.json({ id: d.id, url: d.source_url });
  } catch (e) {
    console.error('WP upload error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

app.post('/api/wp/draft', async (req, res) => {
  const auth = wpAuth();
  if (!auth) return res.json({ success: false, error: 'no-config' });

  const { title, content, featuredImage } = req.body || {};
  if (!title || !content) return res.status(400).json({ success: false, error: 'Missing title or content' });

  const safeTitle = escapeHtml(title);
  const safeContent = '<!-- wp:paragraph --><p><em>Publicitate</em></p><!-- /wp:paragraph -->' +
    content.split('\n').filter(p => p.trim()).map(p =>
      `<!-- wp:paragraph --><p>${escapeHtml(p)}</p><!-- /wp:paragraph -->`
    ).join('');

  try {
    let catId = null;
    try {
      const cr = await fetch(WP_URL + '/categories?slug=advertorial', { headers: { Authorization: auth } });
      const cats = await cr.json();
      if (cats.length > 0) catId = cats[0].id;
    } catch {}
    const body = { title: safeTitle, content: safeContent, status: 'draft', categories: catId ? [catId] : [] };
    if (featuredImage) body.featured_media = featuredImage;
    const r = await fetch(WP_URL + '/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('WP HTTP ' + r.status);
    const d = await r.json();
    res.json({ success: true, id: d.id, link: d.link });
  } catch (e) {
    console.error('WP draft error:', e.message);
    res.json({ success: false, error: e.message });
  }
});

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ── SPA fallback ──
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ODS Publicitate server running on port ${PORT}`);
});
