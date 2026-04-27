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

export const DEFAULT_PKG = [
  {
    id: "social-single", name: "Postare Singulară", cat: "oneTime",
    price: 300, sub: null, color: "#F59E0B",
    headline: "O postare profesională pe Facebook și Instagram",
    inc: [
      { w: "1 postare Facebook", d: "220.000+ urmăritori" },
      { w: "1 postare Instagram", d: "18.000+ urmăritori" },
      { w: "1 story Facebook + Instagram", d: "Format vertical" },
      { w: "Link direct", d: "Site, FB, telefon sau WhatsApp" },
    ],
    delivery: "Publicare în maxim 24h", hasArticle: false, active: true,
  },
  {
    id: "boost-express", name: "Boost Express", cat: "oneTime",
    price: 450, sub: null, color: "#F97316",
    headline: "Postare + boost Meta Ads cu reach garantat 5.000+",
    inc: [
      { w: "1 postare Facebook + Instagram", d: "Design profesional" },
      { w: "1 story pe ambele platforme", d: "Format vertical" },
      { w: "Boost Meta Ads inclus", d: "50 lei buget publicitar, reach 5.000+" },
      { w: "Raport performanță", d: "Reach, click-uri, engagement" },
    ],
    delivery: "Activ în 24-48h", hasArticle: false, active: true,
  },
  {
    id: "eveniment-start", name: "Eveniment Start", cat: "oneTime",
    price: 1000, sub: null, color: "#E11D48",
    headline: "Promovare eveniment cu postări social media + evidențiere în recomandările de weekend",
    inc: [
      { w: "2 postări Facebook + Instagram", d: "Anunț + reminder eveniment" },
      { w: "2 story-uri FB + IG", d: "Countdown + ziua evenimentului" },
      { w: "Evidențiere Weekend", d: "Apariție în recomandările de weekend OdS" },
      { w: "Link direct eveniment", d: "Site, Facebook Event sau WhatsApp" },
    ],
    delivery: "Publicare în 24-48h", hasArticle: false, active: true,
  },
  {
    id: "eveniment-plus", name: "Eveniment Plus", cat: "oneTime",
    price: 1800, sub: null, color: "#BE123C",
    headline: "Articol dedicat + campanie social media completă + push notification pentru evenimentul tău",
    inc: [
      { w: "1 articol dedicat pe site", d: "Prima pagină 7 zile, SEO optimizat" },
      { w: "4 postări Facebook + Instagram", d: "Teaser, anunț, reminder, recap" },
      { w: "4 story-uri FB + IG", d: "Countdown complet" },
      { w: "1 Reel/TikTok", d: "Video teaser eveniment" },
      { w: "Push notification", d: "15.000 abonați, ziua evenimentului" },
      { w: "Evidențiere Weekend", d: "Top recomandări OdS" },
    ],
    delivery: "Campanie activă 7 zile înainte", hasArticle: true, active: true,
  },
  {
    id: "eveniment-premium", name: "Eveniment Full Coverage", cat: "oneTime",
    price: 3000, sub: null, color: "#9F1239",
    headline: "Acoperire completă: articol + social + push + newsletter + banner pe site + recap post-eveniment",
    inc: [
      { w: "2 articole pe site", d: "Anunț + recap post-eveniment cu galerie" },
      { w: "8 postări Facebook + Instagram", d: "Campanie completă pre/during/post" },
      { w: "6 story-uri + 2 Reels", d: "Conținut video complet" },
      { w: "Push notification", d: "15.000 abonați" },
      { w: "Newsletter mention", d: "600 abonați email" },
      { w: "Banner pe site 7 zile", d: "300×250, ~350k afișări" },
      { w: "Evidențiere Weekend", d: "Poziție premium în recomandări OdS" },
    ],
    delivery: "Campanie activă 14 zile", hasArticle: true, active: true,
  },
  {
    id: "social-monthly", name: "Social Lunar", cat: "monthly",
    price: 700, sub: 600, color: "#3B82F6",
    headline: "Prezență constantă pe rețelele Ora de Sibiu",
    inc: [
      { w: "4 postări/lună Facebook", d: "Reach organic garantat" },
      { w: "4 postări/lună Instagram", d: "Feed + Stories" },
      { w: "2 story-uri/lună", d: "Format vertical, swipe-up" },
      { w: "1 Reel/TikTok pe lună", d: "Video scurt vertical" },
      { w: "Raport lunar", d: "Reach, engagement, click-uri" },
    ],
    delivery: "Prima postare în max 24h", hasArticle: false, active: true,
  },
  {
    id: "articol-start", name: "Articol Start", cat: "monthly",
    price: 1200, sub: 1000, color: "#8B5CF6",
    headline: "Articol publicitar pe site + promovare social media",
    inc: [
      { w: "1 articol publicitar pe site", d: "Redactat de echipă sau furnizat de tine" },
      { w: "Prima pagină 14 zile", d: "Vizibil tuturor vizitatorilor" },
      { w: "2 postări/lună FB + IG", d: "Promovare articol" },
      { w: "1 story/lună", d: "Facebook + Instagram" },
    ],
    delivery: "Publicat în max 5 zile lucrătoare", hasArticle: true, active: true,
  },
  {
    id: "business", name: "Business", cat: "monthly",
    price: 1800, sub: 1500, color: "#059669", pop: true,
    headline: "Articol profesional + promovare completă pe toate canalele",
    inc: [
      { w: "1 articol advertorial profesional", d: "Redactat de echipă, prima pagină 30 zile" },
      { w: "6 postări/lună FB + IG", d: "Design profesional + link" },
      { w: "2 story-uri/lună", d: "Facebook + Instagram" },
      { w: "1 Reel/TikTok pe lună", d: "Video scurt vertical" },
      { w: "Programare publicare", d: "Tu decizi când apare" },
      { w: "Aprobare înainte", d: "Primești articolul pentru review" },
      { w: "Raport lunar detaliat", d: "Toate canalele" },
    ],
    delivery: "Gata în 3-5 zile. Tu alegi data.", hasArticle: true, active: true,
  },
  {
    id: "business-plus", name: "Business Plus", cat: "monthly",
    price: 2400, sub: 2000, color: "#0EA5E9",
    headline: "Tot din Business + push notification + newsletter + mai mult conținut",
    inc: [
      { w: "Tot ce include Business", d: "Articol 30 zile + social media" },
      { w: "8 postări/lună FB + IG", d: "Dublu conținut social" },
      { w: "3 story-uri/lună", d: "Facebook + Instagram" },
      { w: "2 Reels/TikTok pe lună", d: "Video scurt vertical" },
      { w: "Push notification", d: "15.000 abonați" },
      { w: "Newsletter mention", d: "600 abonați email" },
    ],
    delivery: "Setup complet în 5 zile", hasArticle: true, active: true,
  },
  {
    id: "premium", name: "Premium 360°", cat: "monthly",
    price: 3500, sub: 2800, color: "#7C3AED",
    headline: "Pachet complet: articol + banner + social + push + newsletter + manager dedicat",
    inc: [
      { w: "Tot ce include Business Plus", d: "Articol + social + push + newsletter" },
      { w: "Banner 300×250 pe site", d: "~1.5M afișări/lună" },
      { w: "12 postări/lună FB + IG", d: "Triplu conținut social" },
      { w: "4 story-uri/lună", d: "Facebook + Instagram" },
      { w: "4 Reels/TikTok pe lună", d: "Video scurt vertical" },
      { w: "Calendar editorial", d: "Planificare lunară completă" },
      { w: "Manager dedicat", d: "Persoană de contact directă" },
    ],
    delivery: "Setup complet în 5 zile", hasArticle: true, active: true,
  },
  {
    id: "enterprise", name: "Enterprise", cat: "monthly",
    price: 5000, sub: 4200, color: "#DC2626",
    headline: "Soluția completă: tot ce oferim, personalizat pentru afacerea ta",
    inc: [
      { w: "Tot ce include Premium 360°", d: "Banner + articol + social + push + newsletter" },
      { w: "4 articole/lună", d: "Conținut editorial constant" },
      { w: "Meta Ads 500 lei inclus", d: "Campanie gestionată complet" },
      { w: "1 video profesional/lună", d: "Filmat și editat de echipă" },
      { w: "Acoperire eveniment", d: "Reporter + fotograf, articol live" },
      { w: "Strategie lunară", d: "Ședință de planificare cu echipa" },
    ],
    delivery: "Setup complet în 7 zile", hasArticle: true, active: true,
  },
];

export const DEFAULT_ADDONS = [
  { id: "addon-post", name: "Postare suplimentară FB+IG", icon: "fa-pen-to-square",
    price: 250, sub: null, unit: "/postare", multi: true,
    qtyPricing: [{ min: 1, price: 250 }, { min: 2, price: 200 }, { min: 3, price: 150 }],
    desc: "O postare profesională pe Facebook și Instagram, design inclus", active: true },
  { id: "addon-banner-header", name: "Banner Header 970×250", icon: "fa-window-maximize",
    price: 2500, sub: 2000, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Poziție premium above-the-fold, sub meniu, pe toate paginile. ~1.5M afișări/lună.", active: true },
  { id: "addon-banner-sidebar", name: "Banner Sidebar 300×250", icon: "fa-table-cells",
    price: 1200, sub: 1000, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Sidebar dreapta pe pagini articol, sticky la scroll. ~800k afișări/lună desktop.", active: true },
  { id: "addon-banner-sidebar-large", name: "Banner Sidebar 300×600", icon: "fa-rectangle-list",
    price: 1800, sub: 1500, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Half-page sidebar dreapta, suprafață dublă. ~800k afișări/lună desktop.", active: true },
  { id: "addon-banner-inarticle", name: "Banner În-Articol 728×90", icon: "fa-newspaper",
    price: 800, sub: 600, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Între paragrafele articolelor, 728×90 desktop / 300×250 mobil. ~500k afișări/lună.", active: true },
  { id: "addon-banner-week", name: "Banner pe Săptămână", icon: "fa-calendar-week",
    price: 500, sub: null, unit: "/săptămână", multi: true,
    qtyPricing: [{ min: 1, price: 500 }, { min: 2, price: 400 }, { min: 4, price: 350 }],
    desc: "Banner 300×250 sidebar, cumpărat pe săptămâni. Ideal pentru campanii scurte.", active: true },
  { id: "addon-push", name: "Push Notification", icon: "fa-bell",
    price: 300, sub: null, unit: "/trimitere", multi: true, qtyPricing: null,
    desc: "Notificare push către 15.000 abonați", active: true },
  { id: "addon-newsletter", name: "Newsletter Mention", icon: "fa-envelope",
    price: 250, sub: null, unit: "/trimitere", multi: true, qtyPricing: null,
    desc: "Menționare sponsorizată în newsletter (600 abonați)", active: true },
  { id: "addon-boost", name: "Meta Ads Boost", icon: "fa-rocket",
    price: 400, sub: null, unit: "", multi: true, qtyPricing: null,
    desc: "Campanie Meta Ads gestionată (200 lei buget + 200 management)", active: true },
  { id: "addon-video", name: "Video Reel/TikTok", icon: "fa-video",
    price: 500, sub: null, unit: "/video", multi: true, qtyPricing: null,
    desc: "Video scurt filmat și editat pentru Reel/TikTok", active: true },
  { id: "addon-echipa", name: "Echipă la eveniment", icon: "fa-users",
    price: 500, sub: null, unit: "/eveniment", multi: false, qtyPricing: null, weekendExtra: 20,
    desc: "Reporter + fotograf prezent la eveniment/lansare/conferință. +20% weekend sau după ora 17.", active: true },
  { id: "addon-livestream", name: "Transmisie Live FB + YouTube", icon: "fa-tower-broadcast",
    price: 1000, sub: null, unit: "/30 min", multi: true,
    qtyPricing: [{ min: 1, price: 1000 }, { min: 2, price: 800 }], weekendExtra: 20,
    desc: "Live streaming pe Facebook și YouTube Ora de Sibiu. Echipă tehnică + moderare. +20% weekend/după ora 17.", active: true },
  { id: "addon-eveniment-recap", name: "Recap Post-Eveniment", icon: "fa-newspaper",
    price: 600, sub: null, unit: "/articol", multi: false, qtyPricing: null,
    desc: "Articol recap cu galerie foto + distribuire social media. Publicat în 48h după eveniment.", active: true },
  { id: "addon-google-ads", name: "Administrare Google Ads", icon: "fa-magnifying-glass-dollar",
    price: 900, sub: 750, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Setup + administrare campanii Google Ads. Raportare lunară. Buget publicitar separat.", active: true },
  { id: "addon-fb-ads", name: "Administrare Facebook Ads", icon: "fa-bullhorn",
    price: 800, sub: 650, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Setup + administrare campanii Facebook & Instagram Ads. Raportare lunară. Buget publicitar separat.", active: true },
  { id: "addon-fb-page", name: "Management Pagină Facebook", icon: "fa-thumbs-up",
    price: 1200, sub: 1000, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Creare pagină + administrare completă: 12 postări/lună, moderare comentarii, raport lunar.", active: true },
  { id: "addon-ig-profile", name: "Management Profil Instagram", icon: "fa-camera-retro",
    price: 1200, sub: 1000, unit: "/lună", multi: false, qtyPricing: null,
    desc: "Setup profil + administrare: 12 postări/lună, stories, hashtag strategy, raport lunar.", active: true },
];

export function getAddonUnitPrice(addon, qty = 1) {
  if (addon.qtyPricing) {
    const sorted = [...addon.qtyPricing].sort((a, b) => b.min - a.min);
    for (const tier of sorted) {
      if (qty >= tier.min) return tier.price;
    }
  }
  return addon.price;
}

export const AD_CAT = [
  { id: "aviz-mediu", label: "Aviz de mediu", icon: "fa-leaf" },
  { id: "pierderi", label: "Pierderi / Găsiri", icon: "fa-magnifying-glass" },
  { id: "decese", label: "Decese / Comemorări", icon: "fa-cross" },
  { id: "autorizatii", label: "Autorizații / Licitații", icon: "fa-file-lines" },
  { id: "citare", label: "Citări / Somări", icon: "fa-scale-balanced" },
  { id: "diverse", label: "Diverse", icon: "fa-thumbtack" },
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
      { id: "horeca", label: "Hotel / Pensiune / Turism", icon: "fa-bed" },
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
      { id: "launch", label: "Lansez ceva nou", icon: "fa-rocket" },
      { id: "reputation", label: "Vreau reputație / încredere", icon: "fa-shield-halved" },
    ],
  },
  {
    id: "budget",
    question: "Ce buget ai în minte?",
    options: [
      { id: "sub-500", label: "Sub 500 lei", icon: "fa-coins" },
      { id: "500-1000", label: "500 – 1.000 lei", icon: "fa-credit-card" },
      { id: "1000-2000", label: "1.000 – 2.000 lei", icon: "fa-chart-bar" },
      { id: "2000-3500", label: "2.000 – 3.500 lei", icon: "fa-gem" },
      { id: "peste-3500", label: "Peste 3.500 lei", icon: "fa-crown" },
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
