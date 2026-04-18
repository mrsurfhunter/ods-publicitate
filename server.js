import express from 'express';
import compression from 'compression';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(compression());
app.use(express.json({ limit: '2mb' }));

// Serve Vite build — hashed assets get long cache, HTML does not
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  maxAge: '1y',
  immutable: true,
}));
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: 0,
}));

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

// ── /api/consult — AI package recommendation ──
const CONSULT_SYSTEM = `Esti consultant de publicitate pentru Ora de Sibiu (oradesibiu.ro), cea mai citita publicatie online din Sibiu cu 400.000+ vizitatori/luna, 218.000 urmaritori Facebook, 18.000 Instagram, 24.000 TikTok. Traficul este auditat BRAT.

Pachete disponibile:
1. social-single: 1 postare FB+IG, 500 lei (o singura data). Ideal pentru promovari punctuale.
2. social-pack: 4 postari/luna FB+IG + 2 stories + raport, 700 lei/luna (600 lei la abonament). Ideal pentru prezenta constanta pe social media.
3. mini-business: 1 articol pe site (prima pagina 7 zile) + 4 postari/luna + 2 stories, 1200 lei/luna (1000 lei la abonament). Ideal pentru afaceri mici care vor si articol.
4. advertorial: 1 articol profesional (prima pagina 30 zile) + 4 postari/luna + 2 stories + programare + aprobare, 1800 lei/luna (1500 la abonament). CEL MAI POPULAR. Ideal pentru vizibilitate maxima cu articol de calitate.
5. banner: banner 300x250 pe site, ~1.5M afisari/luna, 1800 lei/luna (1500 la abonament). Ideal pentru brand awareness continuu.
6. premium: TOT (banner + articol + 8 postari/luna + 4 stories + push 15k + newsletter 600 + TikTok + raport), 3000 lei/luna (2500 la abonament). Ideal pentru campanii complete.

Raspunde EXCLUSIV in format JSON valid, fara markdown, fara backticks:
{
  "primary": "id-pachet",
  "secondary": "id-pachet-sau-null",
  "reasoning": "2-3 propozitii in romana, la persoana a 2-a singular (tu), explicand DE CE aceste pachete sunt potrivite pentru afacerea clientului. Fii specific — mentioneaza tipul afacerii si obiectivul.",
  "primaryBenefits": ["beneficiu1 relevant pentru client", "beneficiu2", "beneficiu3"],
  "secondaryBenefits": ["beneficiu1", "beneficiu2"]
}

Reguli:
- Recomanda MAXIM 2 pachete (un primar si optional un secundar).
- Pachetul primar trebuie sa fie cel mai potrivit, nu cel mai scump.
- Respecta bugetul clientului. Daca bugetul e "sub-700", NU recomanda advertorial.
- Daca clientul vrea "once", recomanda social-single, NU abonamente.
- Daca clientul vrea "ongoing", mentioneaza pretul de abonament.
- Beneficiile trebuie sa fie personalizate pentru tipul afacerii.
- Tonul: profesional dar prietenos, fara exagerari.
- NU inventa pachete. NU modifica preturile.`;

const VALID_PKG_IDS = ['social-single', 'social-pack', 'mini-business', 'advertorial', 'banner', 'premium'];

function fallbackRecommendation({ budget, timeline }) {
  const isOnce = timeline === 'once';
  let primary, secondary;

  if (budget === 'sub-700') {
    primary = isOnce ? 'social-single' : 'social-pack';
    secondary = isOnce ? null : 'social-single';
  } else if (budget === '700-1500') {
    primary = 'mini-business';
    secondary = 'social-pack';
  } else if (budget === '1500-2000') {
    primary = 'advertorial';
    secondary = 'banner';
  } else if (budget === 'peste-2000') {
    primary = 'premium';
    secondary = 'advertorial';
  } else {
    primary = 'advertorial';
    secondary = 'mini-business';
  }

  return {
    primary,
    secondary,
    reasoning: 'Pe baza preferintelor tale, aceste pachete ofera cel mai bun raport calitate-pret pentru promovarea afacerii tale in Sibiu.',
    primaryBenefits: ['Vizibilitate pe cea mai citita publicatie din Sibiu', 'Reach garantat pe Facebook si Instagram', 'Publicare rapida'],
    secondaryBenefits: secondary ? ['Alternativa mai accesibila', 'Promovare eficienta'] : [],
  };
}

app.post('/api/consult', async (req, res) => {
  const { businessType, goal, budget, timeline } = req.body || {};
  if (!businessType || !goal || !budget || !timeline) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json(fallbackRecommendation({ budget, timeline }));
  }

  const userMsg = `Tipul afacerii: ${businessType}\nObiectiv: ${goal}\nBuget: ${budget}\nFrecventa: ${timeline}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const client = new Anthropic({ apiKey });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        temperature: 0.3,
        system: CONSULT_SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      });

      let raw = message.content.map(b => b.text || '').join('\n').trim();
      // Strip markdown backticks if present
      raw = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');

      const data = JSON.parse(raw);

      // Validate package IDs
      if (!VALID_PKG_IDS.includes(data.primary)) throw new Error('Invalid primary package');
      if (data.secondary && !VALID_PKG_IDS.includes(data.secondary)) data.secondary = null;

      return res.json({
        primary: data.primary,
        secondary: data.secondary || null,
        reasoning: data.reasoning || '',
        primaryBenefits: Array.isArray(data.primaryBenefits) ? data.primaryBenefits.slice(0, 4) : [],
        secondaryBenefits: Array.isArray(data.secondaryBenefits) ? data.secondaryBenefits.slice(0, 3) : [],
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
