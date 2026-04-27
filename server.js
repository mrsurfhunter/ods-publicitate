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
const CONSULT_SYSTEM = `Esti consultant de publicitate pentru Ora de Sibiu (oradesibiu.ro), cea mai citita publicatie online din Sibiu cu 400.000+ vizitatori/luna, 218.000 urmaritori Facebook, 18.000 Instagram, 24.000 TikTok. Traficul este auditat BRAT.

Pachete disponibile (in ordinea pretului):
1. social-single: 1 postare FB+IG + link direct, 300 lei (o singura data).
2. boost-express: 1 postare FB+IG + 1 story + boost Meta Ads 50 lei (reach 5k+), 450 lei (o singura data).
3. social-monthly: 4 postari/luna FB+IG + 2 stories + 1 Reel/TikTok + raport, 700 lei/luna (600 la abonament).
4. articol-start: 1 articol pe site (prima pagina 14 zile) + 2 postari/luna + 1 story, 1200 lei/luna (1000 la abonament).
5. business: Articol profesional 30 zile + 6 postari/luna + 2 stories + 1 Reel + programare + aprobare + raport, 1800 lei/luna (1500 la abonament). CEL MAI POPULAR.
6. business-plus: Tot din Business + push 15k + newsletter 600 + 8 postari + 3 stories + 2 Reels, 2400 lei/luna (2000 la abonament).
7. premium: Tot din Business Plus + banner 300x250 + 12 postari + 4 stories + 4 Reels + calendar + manager dedicat, 3500 lei/luna (2800 la abonament).
8. enterprise: Tot din Premium + 4 articole/luna + Meta Ads 500 lei inclus + 1 video profesional + acoperire eveniment + strategie lunara, 5000 lei/luna (4200 la abonament).

Add-ons disponibile:
- addon-banner: Banner 300x250 pe site, 1.5M afisari, 1200 lei/luna (1000 la abonament)
- addon-push: Push notification 15.000 abonati, 300 lei/trimitere
- addon-newsletter: Mention sponsorizat newsletter, 250 lei/trimitere
- addon-boost: Meta Ads managed (200 buget + 200 management), 400 lei
- addon-video: Video Reel/TikTok filmat+editat, 500 lei/video
- addon-event: Reporter+fotograf+articol live+galerie+2 postari+1 story, 800 lei/eveniment

Raspunde EXCLUSIV in format JSON valid, fara markdown, fara backticks:
{
  "tiers": [
    { "id": "pachet-id", "tier": "start", "label": "Bun pentru start", "reasoning": "1 propozitie", "benefits": ["b1","b2","b3"], "addons": [] },
    { "id": "pachet-id", "tier": "recommended", "label": "Recomandat pentru tine", "reasoning": "1 propozitie", "benefits": ["b1","b2","b3"], "addons": [] },
    { "id": "pachet-id", "tier": "popular", "label": "Cel mai ales de afaceri ca tine", "reasoning": "1 propozitie", "benefits": ["b1","b2","b3"], "addons": ["addon-id"] },
    { "id": "pachet-id", "tier": "max", "label": "Maximum impact", "reasoning": "1 propozitie", "benefits": ["b1","b2","b3"], "addons": [] }
  ],
  "summary": "2-3 propozitii rezumat in romana, la persoana a 2-a singular (tu)"
}

Reguli:
- Returneaza EXACT 4 tiere: start (sub buget), recommended (pe buget), popular (usor peste buget), max (premium/aspirational).
- Fiecare tier trebuie sa aiba un pachet DIFERIT. Nu repeta acelasi pachet.
- start < recommended < popular < max (in ordinea pretului).
- Respecta bugetul: "recommended" trebuie sa fie in range-ul bugetului clientului.
- Daca bugetul e "sub-500": recommended=social-single, popular=boost-express, max=social-monthly, start se omite (trimite doar 3).
- Daca clientul vrea "once" sau "urgent": start si recommended = pachete one-time (social-single, boost-express). popular si max = lunare entry-level.
- Daca clientul vrea "ongoing": recomanda pachete lunare, mentioneaza pretul de abonament.
- Daca hasContent e "have-nothing": inclina spre pachete managed (business+), sugereaza addon-video.
- Restaurante/cafenele: accentueaza visual/Reels, sugereaza addon-video.
- Servicii profesionale: accentueaza articole SEO, sugereaza addon-boost.
- Evenimente: accentueaza one-time si addon-event.
- Beneficiile (max 4 per tier) trebuie personalizate pentru tipul afacerii si obiectivul.
- Addon-urile sugerate trebuie sa fie relevante (max 2 per tier).
- Tonul: profesional dar prietenos, fara exagerari.
- NU inventa pachete sau add-ons. NU modifica preturile.`;

const VALID_PKG_IDS = ['social-single', 'boost-express', 'social-monthly', 'articol-start', 'business', 'business-plus', 'premium', 'enterprise'];
const VALID_ADDON_IDS = ['addon-banner', 'addon-push', 'addon-newsletter', 'addon-boost', 'addon-video', 'addon-event'];

const PKG_LADDER = ['social-single', 'boost-express', 'social-monthly', 'articol-start', 'business', 'business-plus', 'premium', 'enterprise'];

function fallbackRecommendation({ budget, timeline }) {
  const isOnce = timeline === 'once' || timeline === 'urgent';

  let centerIdx;
  if (budget === 'sub-500') centerIdx = 0;
  else if (budget === '500-1000') centerIdx = isOnce ? 1 : 2;
  else if (budget === '1000-2000') centerIdx = isOnce ? 1 : 4;
  else if (budget === '2000-3500') centerIdx = 5;
  else if (budget === 'peste-3500') centerIdx = 6;
  else centerIdx = 4;

  const pick = (offset) => PKG_LADDER[Math.max(0, Math.min(PKG_LADDER.length - 1, centerIdx + offset))];

  const tiers = [];
  const startId = pick(-1);
  const recId = pick(0);
  const popId = pick(1);
  const maxId = pick(2);

  if (startId !== recId) {
    tiers.push({ id: startId, tier: 'start', label: 'Bun pentru start', reasoning: 'Optiune accesibila pentru a incepe promovarea.', benefits: ['Vizibilitate pe cea mai citita publicatie din Sibiu', 'Publicare rapida', 'Reach organic garantat'], addons: [] });
  }
  tiers.push({ id: recId, tier: 'recommended', label: 'Recomandat pentru tine', reasoning: 'Cel mai bun raport calitate-pret pentru bugetul tau.', benefits: ['Vizibilitate pe toate canalele Ora de Sibiu', 'Reach garantat pe Facebook si Instagram', 'Publicare rapida'], addons: [] });
  if (popId !== recId) {
    tiers.push({ id: popId, tier: 'popular', label: 'Cel mai ales de afaceri ca tine', reasoning: 'Ales de 67% din afacerile din Sibiu.', benefits: ['Promovare completa pe toate canalele', 'Articol profesional pe prima pagina', 'Raport detaliat lunar'], addons: ['addon-boost'] });
  }
  if (maxId !== popId && maxId !== recId) {
    tiers.push({ id: maxId, tier: 'max', label: 'Maximum impact', reasoning: 'Vizibilitate maxima pe toate canalele.', benefits: ['Tot ce include Ora de Sibiu', 'Manager dedicat', 'Calendar editorial planificat'], addons: [] });
  }

  return {
    tiers,
    summary: 'Pe baza preferintelor tale, am pregatit optiuni de promovare adaptate bugetului si obiectivelor tale in Sibiu.',
  };
}

app.post('/api/consult', async (req, res) => {
  const { businessType, goal, budget, timeline, hasContent } = req.body || {};
  if (!businessType || !goal || !budget || !timeline) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json(fallbackRecommendation({ budget, timeline }));
  }

  const userMsg = `Tipul afacerii: ${businessType}\nObiectiv: ${goal}\nBuget: ${budget}\nMateriale: ${hasContent || 'not-sure'}\nFrecventa: ${timeline}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const client = new Anthropic({ apiKey });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        temperature: 0.3,
        system: CONSULT_SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      });

      let raw = message.content.map(b => b.text || '').join('\n').trim();
      raw = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');

      const data = JSON.parse(raw);

      if (!Array.isArray(data.tiers) || data.tiers.length === 0) throw new Error('No tiers in response');

      const validTiers = data.tiers
        .filter(t => VALID_PKG_IDS.includes(t.id) && t.tier && t.label)
        .map(t => ({
          id: t.id,
          tier: t.tier,
          label: t.label || '',
          reasoning: t.reasoning || '',
          benefits: Array.isArray(t.benefits) ? t.benefits.slice(0, 4) : [],
          addons: Array.isArray(t.addons) ? t.addons.filter(a => VALID_ADDON_IDS.includes(a)) : [],
        }));

      if (validTiers.length === 0) throw new Error('No valid tiers after filtering');

      return res.json({
        tiers: validTiers,
        summary: data.summary || '',
      });
    } catch (e) {
      console.error(`Consult attempt ${attempt + 1} failed:`, e.message);
      if (attempt === 1) {
        return res.json(fallbackRecommendation({ budget, timeline }));
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
