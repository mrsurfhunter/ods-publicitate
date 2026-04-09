export const ODS = {
  company: "ODS SRL Sibiu",
  cif: "39899930",
  reg: "J32/1279/2018",
  phone: "+40 746 752 240",
  email: "promovare@oradesibiu.ro",
};

export const WP = {
  url: import.meta.env.VITE_WP_URL || "https://www.oradesibiu.ro",
  rest: "/wp-json/wp/v2",
  user: import.meta.env.VITE_WP_USER || "",
  pass: import.meta.env.VITE_WP_PASS || "",
};

export const PKG = [
  {
    id: "social-single", name: "Postare Social Media", cat: "oneTime",
    price: 500, sub: null, color: "#F59E0B",
    headline: "O postare profesionala pe Facebook si Instagram",
    inc: [
      { w: "1 postare Facebook", d: "218.000+ urmaritori" },
      { w: "1 postare Instagram", d: "18.000+ urmaritori" },
      { w: "Link direct", d: "Site, FB, telefon sau WhatsApp" },
    ],
    delivery: "Publicare in maxim 24h", hasArticle: false,
  },
  {
    id: "social-pack", name: "Vizibilitate Social Media", cat: "monthly",
    price: 700, sub: 600, color: "#3B82F6",
    headline: "Prezenta constanta pe retelele Ora de Sibiu",
    inc: [
      { w: "4 postari/luna Facebook", d: "Reach organic garantat" },
      { w: "4 postari/luna Instagram", d: "Feed + Stories" },
      { w: "2 story-uri/luna", d: "Format vertical, swipe-up" },
      { w: "Raport lunar", d: "Reach, engagement, click-uri" },
    ],
    delivery: "Prima postare in max 24h", hasArticle: false,
  },
  {
    id: "mini-business", name: "Mini Business", cat: "monthly",
    price: 1200, sub: 1000, color: "#8B5CF6",
    headline: "Articol publicitar + promovare social media",
    inc: [
      { w: "1 articol publicitar pe site", d: "Scris de tine sau de redactia noastra" },
      { w: "Prima pagina 7 zile", d: "Vizibil tuturor vizitatorilor" },
      { w: "4 postari/luna FB + IG", d: "Promovare articol" },
      { w: "2 story-uri/luna", d: "Facebook + Instagram" },
    ],
    delivery: "Publicat in max 5 zile lucratoare", hasArticle: true,
  },
  {
    id: "advertorial", name: "Advertorial Complet", cat: "monthly",
    price: 1800, sub: 1500, color: "#F59E0B", pop: true,
    headline: "Articol de calitate pe prima pagina + promovare completa",
    inc: [
      { w: "1 articol advertorial profesional", d: "Redactat de echipa sau furnizat de tine" },
      { w: "Prima pagina 30 de zile", d: "Cea mai citita publicatie din Sibiu" },
      { w: "4 postari/luna FB + IG", d: "Design profesional + link" },
      { w: "2 story-uri/luna", d: "Reach suplimentar" },
      { w: "Programare publicare", d: "Tu decizi cand apare" },
      { w: "Aprobare inainte", d: "Primesti articolul pentru review" },
    ],
    delivery: "Gata in 3-5 zile. Tu alegi data.", hasArticle: true,
  },
  {
    id: "banner", name: "Banner pe Site", cat: "monthly",
    price: 1800, sub: 1500, color: "#06B6D4",
    headline: "1.5 milioane de afisari lunare pe oradesibiu.ro",
    inc: [
      { w: "Banner 300x250 px", d: "Desktop + mobil" },
      { w: "~1.5M afisari/luna", d: "Trafic auditat BRAT" },
      { w: "Redirect la click", d: "Site, FB, telefon, WhatsApp" },
      { w: "Statistici real-time", d: "Afisari si click-uri" },
    ],
    delivery: "Activ in 24h", hasArticle: false,
  },
  {
    id: "premium", name: "Premium 360\u00B0", cat: "monthly",
    price: 3000, sub: 2500, color: "#059669",
    headline: "Tot ce ai nevoie: articol + banner + social + push + newsletter",
    inc: [
      { w: "Banner desktop + mobil", d: "1.5M afisari" },
      { w: "Articol advertorial 30 zile", d: "Redactat profesional" },
      { w: "8 postari/luna FB + IG", d: "Dublu fata de standard" },
      { w: "4 story-uri/luna", d: "" },
      { w: "Push 15.000 abonati", d: "" },
      { w: "Newsletter 600 abonati", d: "" },
      { w: "Promovare TikTok", d: "24k urmaritori" },
      { w: "Raport detaliat", d: "Toate canalele" },
    ],
    delivery: "Setup complet in 5 zile", hasArticle: true,
  },
];

export const AD_CAT = [
  { id: "aviz-mediu", label: "Aviz de mediu", icon: "\u{1F33F}" },
  { id: "pierderi", label: "Pierderi / Gasiri", icon: "\u{1F50D}" },
  { id: "decese", label: "Decese / Comemorari", icon: "\u{1F56F}\uFE0F" },
  { id: "autorizatii", label: "Autorizatii / Licitatii", icon: "\u{1F4CB}" },
  { id: "citare", label: "Citari / Somare", icon: "\u2696\uFE0F" },
  { id: "diverse", label: "Diverse", icon: "\u{1F4CC}" },
];

export const CONSULT_STEPS = [
  {
    id: "businessType",
    question: "Ce tip de afacere ai?",
    options: [
      { id: "restaurant", label: "Restaurant / Cafe / Bar", icon: "\u{1F37D}\uFE0F" },
      { id: "magazin", label: "Magazin / Retail", icon: "\u{1F6CD}\uFE0F" },
      { id: "servicii", label: "Servicii", icon: "\u{1F4BC}" },
      { id: "eveniment", label: "Eveniment / Festival", icon: "\u{1F389}" },
      { id: "imobiliare", label: "Imobiliare", icon: "\u{1F3E0}" },
      { id: "sanatate", label: "Sanatate / Wellness", icon: "\u{1FA7A}" },
      { id: "altceva", label: "Altceva", icon: "\u{270D}\uFE0F", freeText: true },
    ],
  },
  {
    id: "goal",
    question: "Ce vrei sa obtii?",
    options: [
      { id: "more-clients", label: "Vreau mai multi clienti", icon: "\u{1F4C8}" },
      { id: "brand", label: "Sa fiu cunoscut in Sibiu", icon: "\u{2B50}" },
      { id: "event", label: "Promovez un eveniment sau o oferta", icon: "\u{1F4E3}" },
      { id: "seo", label: "Sa apar pe Google cand cauta lumea", icon: "\u{1F50D}" },
    ],
  },
  {
    id: "budget",
    question: "Ce buget ai in minte?",
    options: [
      { id: "sub-700", label: "Sub 700 lei", icon: "\u{1F4B0}" },
      { id: "700-1500", label: "700 \u2013 1.500 lei", icon: "\u{1F4B3}" },
      { id: "1500-2000", label: "1.500 \u2013 2.000 lei", icon: "\u{1F3AF}" },
      { id: "peste-2000", label: "Peste 2.000 lei", icon: "\u{1F680}" },
      { id: "nu-stiu", label: "Nu stiu \u2014 recomanda-mi", icon: "\u{1F914}" },
    ],
  },
  {
    id: "timeline",
    question: "Cat de des vrei sa te promovezi?",
    options: [
      { id: "once", label: "O singura data", icon: "1\uFE0F\u20E3" },
      { id: "few-months", label: "Cateva luni", icon: "\u{1F4C5}" },
      { id: "ongoing", label: "Pe termen lung", icon: "\u267E\uFE0F" },
    ],
  },
];
