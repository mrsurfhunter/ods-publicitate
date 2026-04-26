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
    id: "social-single", name: "Postare Social Media", cat: "oneTime",
    price: 500, sub: null, color: "#F59E0B",
    headline: "O postare profesională pe Facebook și Instagram",
    inc: [
      { w: "1 postare Facebook", d: "218.000+ urmăritori" },
      { w: "1 postare Instagram", d: "18.000+ urmăritori" },
      { w: "Link direct", d: "Site, FB, telefon sau WhatsApp" },
    ],
    delivery: "Publicare în maxim 24h", hasArticle: false,
  },
  {
    id: "social-pack", name: "Vizibilitate Social Media", cat: "monthly",
    price: 700, sub: 600, color: "#3B82F6",
    headline: "Prezență constantă pe rețelele Ora de Sibiu",
    inc: [
      { w: "4 postări/lună Facebook", d: "Reach organic garantat" },
      { w: "4 postări/lună Instagram", d: "Feed + Stories" },
      { w: "2 story-uri/lună", d: "Format vertical, swipe-up" },
      { w: "Raport lunar", d: "Reach, engagement, click-uri" },
    ],
    delivery: "Prima postare în max 24h", hasArticle: false,
  },
  {
    id: "mini-business", name: "Mini Business", cat: "monthly",
    price: 1200, sub: 1000, color: "#8B5CF6",
    headline: "Articol publicitar + promovare social media",
    inc: [
      { w: "1 articol publicitar pe site", d: "Scris de tine sau de redacția noastră" },
      { w: "Prima pagină 7 zile", d: "Vizibil tuturor vizitatorilor" },
      { w: "4 postări/lună FB + IG", d: "Promovare articol" },
      { w: "2 story-uri/lună", d: "Facebook + Instagram" },
    ],
    delivery: "Publicat în max 5 zile lucrătoare", hasArticle: true,
  },
  {
    id: "advertorial", name: "Advertorial Complet", cat: "monthly",
    price: 1800, sub: 1500, color: "#F59E0B", pop: true,
    headline: "Articol de calitate pe prima pagină + promovare completă",
    inc: [
      { w: "1 articol advertorial profesional", d: "Redactat de echipă sau furnizat de tine" },
      { w: "Prima pagină 30 de zile", d: "Cea mai citită publicație din Sibiu" },
      { w: "4 postări/lună FB + IG", d: "Design profesional + link" },
      { w: "2 story-uri/lună", d: "Reach suplimentar" },
      { w: "Programare publicare", d: "Tu decizi când apare" },
      { w: "Aprobare înainte", d: "Primești articolul pentru review" },
    ],
    delivery: "Gata în 3-5 zile. Tu alegi data.", hasArticle: true,
  },
  {
    id: "banner", name: "Banner pe Site", cat: "monthly",
    price: 1800, sub: 1500, color: "#06B6D4",
    headline: "1.5 milioane de afișări lunare pe oradesibiu.ro",
    inc: [
      { w: "Banner 300x250 px", d: "Desktop + mobil" },
      { w: "~1.5M afișări/lună", d: "Trafic auditat BRAT" },
      { w: "Redirect la click", d: "Site, FB, telefon, WhatsApp" },
      { w: "Statistici real-time", d: "Afișări și click-uri" },
    ],
    delivery: "Activ în 24h", hasArticle: false,
  },
  {
    id: "premium", name: "Premium 360\u00B0", cat: "monthly",
    price: 3000, sub: 2500, color: "#059669",
    headline: "Tot ce ai nevoie: articol + banner + social + push + newsletter",
    inc: [
      { w: "Banner desktop + mobil", d: "1.5M afișări" },
      { w: "Articol advertorial 30 zile", d: "Redactat profesional" },
      { w: "8 postări/lună FB + IG", d: "Dublu față de standard" },
      { w: "4 story-uri/lună", d: "" },
      { w: "Push 15.000 abonați", d: "" },
      { w: "Newsletter 600 abonați", d: "" },
      { w: "Promovare TikTok", d: "24k urmăritori" },
      { w: "Raport detaliat", d: "Toate canalele" },
    ],
    delivery: "Setup complet în 5 zile", hasArticle: true,
  },
];

export const AD_CAT = [
  { id: "aviz-mediu", label: "Aviz de mediu", icon: "\u{1F33F}" },
  { id: "pierderi", label: "Pierderi / Găsiri", icon: "\u{1F50D}" },
  { id: "decese", label: "Decese / Comemorări", icon: "\u{1F56F}\uFE0F" },
  { id: "autorizatii", label: "Autorizații / Licitații", icon: "\u{1F4CB}" },
  { id: "citare", label: "Citări / Somări", icon: "\u2696\uFE0F" },
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
      { id: "seo", label: "Să apar pe Google când caută lumea", icon: "fa-magnifying-glass" },
    ],
  },
  {
    id: "budget",
    question: "Ce buget ai în minte?",
    options: [
      { id: "sub-700", label: "Sub 700 lei", icon: "fa-coins" },
      { id: "700-1500", label: "700 – 1.500 lei", icon: "fa-credit-card" },
      { id: "1500-2000", label: "1.500 – 2.000 lei", icon: "fa-chart-bar" },
      { id: "peste-2000", label: "Peste 2.000 lei", icon: "fa-gem" },
      { id: "nu-stiu", label: "Nu știu — recomandă-mi", icon: "fa-handshake" },
    ],
  },
  {
    id: "timeline",
    question: "Cât de des vrei să te promovezi?",
    options: [
      { id: "once", label: "O singură dată", icon: "fa-calendar-check" },
      { id: "few-months", label: "Câteva luni", icon: "fa-calendar" },
      { id: "ongoing", label: "Pe termen lung", icon: "fa-infinity" },
    ],
  },
];
