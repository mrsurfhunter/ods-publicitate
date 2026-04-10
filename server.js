import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Security middleware ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://cdn.oradesibiu.ro", "https://www.oradesibiu.ro"],
      connectSrc: ["'self'", "https://www.oradesibiu.ro"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// ── Logging ──────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '2mb' }));

// Serve Vite build in production
app.use(express.static(path.join(__dirname, 'dist')));

// ── Rate limiting ────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Prea multe cereri. Reîncercați în câteva minute.' },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Limita de cereri AI atinsă. Reîncercați în câteva minute.' },
});

app.use('/api/leads', apiLimiter);
app.use('/api/orders', apiLimiter);
app.use('/api/ai', aiLimiter);
app.use('/api/consult', aiLimiter);

// ── Input sanitization helpers ───────────────────────────────
function sanitize(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().substring(0, maxLen);
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

// ── Claude model config ──────────────────────────────────────
const AI_MODEL = process.env.AI_MODEL || 'claude-sonnet-4-20250514';

// ── /api/ai — generic AI proxy (text enhancement) ──
app.post('/api/ai', async (req, res) => {
  const system = sanitize(req.body?.system, 1000);
  const user = sanitize(req.body?.user, 5000);
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
      model: AI_MODEL,
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const text = message.content.map(b => b.text || '').join('\n').trim();
    res.json({ text });
  } catch (e) {
    console.error('AI error:', e.message);
    res.status(500).json({ error: 'Eroare la procesarea AI. Reîncercați.' });
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
  const businessType = sanitize(req.body?.businessType, 200);
  const goal = sanitize(req.body?.goal, 200);
  const budget = sanitize(req.body?.budget, 50);
  const timeline = sanitize(req.body?.timeline, 50);

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
        model: AI_MODEL,
        max_tokens: 500,
        temperature: 0.3,
        system: CONSULT_SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      });

      let raw = message.content.map(b => b.text || '').join('\n').trim();
      raw = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');

      const data = JSON.parse(raw);

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
  if (!cui || cui.length < 2 || cui.length > 13) {
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

// ── Data persistence helpers ─────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(file) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { /* ignore */ }
  return [];
}

function writeJSON(file, data) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── /api/leads — save lead data ──
app.post('/api/leads', (req, res) => {
  const id = sanitize(req.body?.id, 50);
  const name = sanitize(req.body?.name, 200);
  const email = sanitize(req.body?.email, 200).toLowerCase();
  const phone = sanitize(req.body?.phone, 30);
  const company = sanitize(req.body?.company, 200);
  const source = sanitize(req.body?.source, 50);
  const createdAt = req.body?.createdAt;
  const consultAnswers = req.body?.consultAnswers;

  if (!name || !email) return res.status(400).json({ error: 'Missing name or email' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Email invalid' });

  const leads = readJSON(LEADS_FILE);
  const existing = leads.findIndex(l => l.id === id);
  const entry = {
    id: id || Date.now().toString(36),
    name, email, phone, company,
    source: source || 'unknown',
    createdAt: createdAt || new Date().toISOString(),
    consultAnswers: consultAnswers || null,
    ip: req.ip, ua: req.get('user-agent') || '',
    updatedAt: new Date().toISOString(),
  };
  if (existing >= 0) leads[existing] = { ...leads[existing], ...entry };
  else leads.unshift(entry);
  writeJSON(LEADS_FILE, leads);
  res.json({ ok: true });
});

app.get('/api/leads/check', (req, res) => {
  const email = sanitize(req.query?.email, 200).toLowerCase();
  if (!email) return res.status(400).json({ error: 'Missing email' });
  const leads = readJSON(LEADS_FILE);
  const found = leads.find(l => l.email?.toLowerCase() === email);
  res.json({ exists: !!found, name: found?.name || null });
});

// ── /api/orders — server-side order persistence ──
app.post('/api/orders', (req, res) => {
  const body = req.body;
  if (!body || !body.id) return res.status(400).json({ error: 'Missing order data' });

  const order = {
    id: sanitize(body.id, 50),
    name: sanitize(body.name, 200),
    email: sanitize(body.email, 200).toLowerCase(),
    phone: sanitize(body.phone, 30),
    company: sanitize(body.company, 200),
    packageId: sanitize(body.packageId, 50),
    packageName: sanitize(body.packageName, 200),
    price: Number(body.price) || 0,
    payMethod: sanitize(body.payMethod, 20),
    subscription: !!body.subscription,
    date: body.date || new Date().toISOString(),
    status: sanitize(body.status, 20) || 'pending',
    isAnunt: !!body.isAnunt,
    anuntText: sanitize(body.anuntText, 5000),
    anuntDays: Number(body.anuntDays) || 0,
    anuntWords: Number(body.anuntWords) || 0,
    anuntCategory: sanitize(body.anuntCategory, 50),
    ip: req.ip,
    ua: req.get('user-agent') || '',
    createdAt: new Date().toISOString(),
  };

  const orders = readJSON(ORDERS_FILE);
  const existing = orders.findIndex(o => o.id === order.id);
  if (existing >= 0) {
    orders[existing] = { ...orders[existing], ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.unshift(order);
  }
  writeJSON(ORDERS_FILE, orders);
  console.log(`Order saved: ${order.id} - ${order.packageName} - ${order.price} lei`);
  res.json({ ok: true, id: order.id });
});

app.get('/api/orders', (req, res) => {
  const email = sanitize(req.query?.email, 200).toLowerCase();
  if (!email) return res.status(400).json({ error: 'Missing email' });
  const orders = readJSON(ORDERS_FILE);
  const userOrders = orders.filter(o => o.email === email);
  res.json(userOrders);
});

// ── /api/wp/* — WordPress proxy (credentials stay on server) ──
const WP_URL = process.env.WP_URL || 'https://www.oradesibiu.ro';
const WP_REST = '/wp-json/wp/v2';
const WP_USER = process.env.WP_USER || '';
const WP_PASS = process.env.WP_PASS || '';

function wpAuth() {
  if (!WP_USER || !WP_PASS) return null;
  return 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64');
}

app.post('/api/wp/media', async (req, res) => {
  const auth = wpAuth();
  if (!auth) return res.status(503).json({ error: 'WordPress not configured' });

  try {
    // Forward the raw body for file upload
    const contentType = req.headers['content-type'];
    const r = await fetch(WP_URL + WP_REST + '/media', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': contentType,
        'Content-Disposition': req.headers['content-disposition'] || '',
      },
      body: req.body,
    });
    if (!r.ok) throw new Error('WP HTTP ' + r.status);
    const d = await r.json();
    res.json({ id: d.id, url: d.source_url });
  } catch (e) {
    console.error('WP media upload error:', e.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/wp/posts', async (req, res) => {
  const auth = wpAuth();
  if (!auth) return res.status(503).json({ error: 'no-config' });

  try {
    // Get advertorial category
    let catId = null;
    try {
      const cr = await fetch(WP_URL + WP_REST + '/categories?slug=advertorial', {
        headers: { Authorization: auth },
      });
      const cats = await cr.json();
      if (cats.length > 0) catId = cats[0].id;
    } catch { /* ignore */ }

    const body = {
      title: sanitize(req.body?.title, 500),
      content: req.body?.content || '',
      status: 'draft',
      categories: catId ? [catId] : [],
    };
    if (req.body?.featuredImage) body.featured_media = Number(req.body.featuredImage);

    body.content = '<!-- wp:paragraph --><p><em>Publicitate</em></p><!-- /wp:paragraph -->' + body.content;

    const r = await fetch(WP_URL + WP_REST + '/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('WP HTTP ' + r.status);
    const result = await r.json();
    res.json({ success: true, id: result.id, link: result.link });
  } catch (e) {
    console.error('WP post creation error:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(process.uptime()),
  });
});

// ── SPA fallback ──
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ODS Publicitate server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  AI Model: ${AI_MODEL}`);
  console.log(`  WordPress: ${WP_USER ? 'configured' : 'not configured'}`);
});
