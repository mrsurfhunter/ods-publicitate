export const ODS = {
  company: "ODS SRL Sibiu",
  cif: "39899930",
  reg: "J32/1279/2018",
  phone: "+40 746 752 240",
  email: "promovare@oradesibiu.ro",
};

export const WP = {
  url: import.meta.env.VITE_WP_URL || "https://www.oradesibiu.ro",
};

export const PKG = [
  {
    id: "social-single", name: "Postare Singulară", cat: "oneTime",
    price: 300, sub: null, color: "#F59E0B",
    headline: "O postare profesională pe Facebook și Instagram",
    inc: [
      { w: "1 postare Facebook", d: "218.000+ urmăritori" },
      { w: "1 postare Instagram", d: "18.000+ urmăritori" },
      { w: "Link direct", d: "Site, FB, telefon sau WhatsApp" },
    ],
    delivery: "Publicare în maxim 24h", hasArticle: false,
  },
  {
    id: "boost-express", name: "Boost Express", cat: "oneTime",
    price: 450, sub: null, color: "#F97316",
    headline: "Postare cu boost Meta Ads — reach garantat 5.000+",
    inc: [
      { w: "1 postare Facebook + Instagram", d: "Design profesional" },
      { w: "1 story Facebook + Instagram", d: "Format vertical" },
      { w: "Boost Meta Ads inclus", d: "50 lei buget, reach 5.000+" },
    ],
    delivery: "Publicare în maxim 24h", hasArticle: false,
  },
  {
    id: "social-monthly", name: "Social Lunar", cat: "monthly",
    price: 700, sub: 600, color: "#3B82F6",
    headline: "Prezență constantă pe rețelele Ora de Sibiu",
    inc: [
      { w: "4 postări/lună Facebook + Instagram", d: "Reach organic garantat" },
      { w: "2 story-uri/lună", d: "Format vertical, swipe-up" },
      { w: "1 Reel / TikTok", d: "24.000 urmăritori TikTok" },
      { w: "Raport lunar", d: "Reach, engagement, click-uri" },
    ],
    delivery: "Prima postare în max 24h", hasArticle: false,
  },
  {
    id: "articol-start", name: "Articol Start", cat: "monthly",
    price: 1200, sub: 1000, color: "#8B5CF6",
    headline: "Articol publicitar pe prima pagină + promovare social media",
    inc: [
      { w: "1 articol pe site", d: "Prima pagină 14 zile" },
      { w: "2 postări/lună FB + IG", d: "Promovare articol" },
      { w: "1 story/lună", d: "Facebook + Instagram" },
    ],
    delivery: "Publicat în max 5 zile lucrătoare", hasArticle: true,
  },
  {
    id: "business", name: "Business", cat: "monthly",
    price: 1800, sub: 1500, color: "#059669", pop: true,
    headline: "Articol profesional + promovare completă pe toate canalele",
    inc: [
      { w: "Articol profesional 30 zile", d: "Prima pagină, redactat de echipă" },
      { w: "6 postări/lună FB + IG", d: "Design profesional + link" },
      { w: "2 story-uri/lună", d: "Reach suplimentar" },
      { w: "1 Reel / TikTok", d: "24.000 urmăritori" },
      { w: "Programare publicare", d: "Tu decizi când apare" },
      { w: "Aprobare înainte", d: "Primești articolul pentru review" },
      { w: "Raport lunar", d: "Toate canalele" },
    ],
    delivery: "Gata în 3-5 zile. Tu alegi data.", hasArticle: true,
  },
  {
    id: "business-plus", name: "Business Plus", cat: "monthly",
    price: 2400, sub: 2000, color: "#6366F1",
    headline: "Tot din Business + push, newsletter și mai mult conținut",
    inc: [
      { w: "Tot din Business", d: "Articol 30 zile + social media" },
      { w: "Push notification", d: "15.000 abonați" },
      { w: "Newsletter mention", d: "600 abonați email" },
      { w: "8 postări/lună FB + IG", d: "Dublu conținut" },
      { w: "3 story-uri/lună", d: "" },
      { w: "2 Reels / TikTok", d: "" },
    ],
    delivery: "Setup complet în 5 zile", hasArticle: true,
  },
  {
    id: "premium", name: "Premium 360°", cat: "monthly",
    price: 3500, sub: 2800, color: "#0EA5E9",
    headline: "Vizibilitate maximă: articol + banner + social + push + newsletter",
    inc: [
      { w: "Tot din Business Plus", d: "" },
      { w: "Banner 300×250 pe site", d: "~1.5M afișări/lună" },
      { w: "12 postări/lună FB + IG", d: "3 pe săptămână" },
      { w: "4 story-uri/lună", d: "" },
      { w: "4 Reels / TikTok", d: "" },
      { w: "Calendar editorial", d: "Planificat lunar" },
      { w: "Manager dedicat", d: "Contact direct" },
    ],
    delivery: "Setup complet în 5 zile", hasArticle: true,
  },
  {
    id: "enterprise", name: "Enterprise", cat: "monthly",
    price: 5000, sub: 4200, color: "#1E293B",
    headline: "Pachet complet cu Meta Ads, video profesional și strategie",
    inc: [
      { w: "Tot din Premium 360°", d: "" },
      { w: "4 articole/lună", d: "Conținut continuu pe site" },
      { w: "Meta Ads managed", d: "500 lei buget inclus" },
      { w: "1 video profesional/lună", d: "Filmat + editat" },
      { w: "Acoperire eveniment", d: "Reporter + fotograf" },
      { w: "Strategie lunară", d: "Ședință de planificare" },
    ],
    delivery: "Onboarding complet în 7 zile", hasArticle: true,
  },
];

export const ADDONS = [
  { id: "addon-banner", name: "Banner pe Site", price: 1200, sub: 1000, unit: "/lună",
    desc: "Banner 300×250, ~1.5M afișări/lună, desktop + mobil", icon: "fa-rectangle-ad" },
  { id: "addon-push", name: "Push Notification", price: 300, sub: null, unit: "/trimitere",
    desc: "Notificare push către 15.000 abonați", icon: "fa-bell" },
  { id: "addon-newsletter", name: "Newsletter Mention", price: 250, sub: null, unit: "/trimitere",
    desc: "Menționare sponsorizată în newsletter (600 abonați)", icon: "fa-envelope" },
  { id: "addon-boost", name: "Meta Ads Boost", price: 400, sub: null, unit: "",
    desc: "Campanie Meta Ads gestionată (200 lei buget + 200 management)", icon: "fa-bullseye" },
  { id: "addon-video", name: "Video Reel/TikTok", price: 500, sub: null, unit: "/video",
    desc: "Video scurt filmat și editat pentru Reel/TikTok", icon: "fa-video" },
  { id: "addon-event", name: "Acoperire Eveniment", price: 800, sub: null, unit: "/eveniment",
    desc: "Reporter + fotograf, articol live, galerie, 2 postări + 1 story", icon: "fa-camera" },
];

export const AD_CAT = [
  { id: "aviz-mediu", label: "Aviz de mediu", icon: "\u{1F33F}" },
  { id: "pierderi", label: "Pierderi / Găsiri", icon: "\u{1F50D}" },
  { id: "decese", label: "Decese / Comemorări", icon: "\u{1F56F}️" },
  { id: "autorizatii", label: "Autorizații / Licitații", icon: "\u{1F4CB}" },
  { id: "citare", label: "Citări / Somări", icon: "⚖️" },
  { id: "diverse", label: "Diverse", icon: "\u{1F4CC}" },
];

export const CONSULT_STEPS = [
  {
    id: "businessType",
    question: "Ce tip de afacere ai?",
    options: [
      { id: "restaurant", label: "Restaurant / Cafe / Bar", icon: "fa-utensils" },
      { id: "magazin", label: "Magazin / Retail", icon: "fa-bag-shopping" },
      { id: "servicii", label: "Servicii", icon: "fa-briefcase" },
      { id: "horeca", label: "Hotel / Pensiune / Turism", icon: "fa-bed" },
      { id: "eveniment", label: "Eveniment / Festival", icon: "fa-calendar-days" },
      { id: "imobiliare", label: "Imobiliare", icon: "fa-building" },
      { id: "sanatate", label: "Sănătate / Wellness", icon: "fa-heart-pulse" },
      { id: "altceva", label: "Altceva", icon: "fa-pen", freeText: true },
    ],
  },
  {
    id: "goal",
    question: "Ce vrei să obții?",
    options: [
      { id: "more-clients", label: "Vreau mai mulți clienți", icon: "fa-chart-line" },
      { id: "brand", label: "Să fiu cunoscut în Sibiu", icon: "fa-star" },
      { id: "event", label: "Promovez un eveniment sau o ofertă", icon: "fa-bullhorn" },
      { id: "launch", label: "Lansez ceva nou", icon: "fa-rocket" },
      { id: "reputation", label: "Vreau reputație / încredere", icon: "fa-shield-halved" },
      { id: "seo", label: "Să apar pe Google când caută lumea", icon: "fa-magnifying-glass" },
    ],
  },
  {
    id: "budget",
    question: "Ce buget ai în minte?",
    options: [
      { id: "sub-500", label: "Sub 500 lei", icon: "fa-coins" },
      { id: "500-1000", label: "500 – 1.000 lei", icon: "fa-wallet" },
      { id: "1000-2000", label: "1.000 – 2.000 lei", icon: "fa-credit-card" },
      { id: "2000-3500", label: "2.000 – 3.500 lei", icon: "fa-chart-bar" },
      { id: "peste-3500", label: "Peste 3.500 lei", icon: "fa-gem" },
      { id: "nu-stiu", label: "Nu știu — recomandă-mi", icon: "fa-handshake" },
    ],
  },
  {
    id: "hasContent",
    question: "Ai materiale pregătite?",
    options: [
      { id: "have-all", label: "Am tot — texte, poze, video", icon: "fa-check-double" },
      { id: "have-photos", label: "Am poze, dar nu texte", icon: "fa-images" },
      { id: "have-nothing", label: "Nu am nimic pregătit", icon: "fa-circle-xmark" },
      { id: "not-sure", label: "Nu sunt sigur", icon: "fa-question" },
    ],
  },
  {
    id: "timeline",
    question: "Cât de des vrei să te promovezi?",
    options: [
      { id: "urgent", label: "Urgent — am nevoie săptămâna asta", icon: "fa-bolt" },
      { id: "once", label: "O singură dată", icon: "fa-calendar-check" },
      { id: "few-months", label: "Câteva luni", icon: "fa-calendar" },
      { id: "ongoing", label: "Pe termen lung", icon: "fa-infinity" },
    ],
  },
];
