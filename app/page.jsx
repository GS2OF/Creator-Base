"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff,
  Check, X, Minus, ChevronRight, XCircle
} from "lucide-react";

/* ====== Design ====== */
const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

/* ====== i18n ====== */
const I18N = {
  de: {
    brandTag: "Die Adult-Agentur für nachhaltiges Creator-Wachstum",
    brandName: "Creator-Base",
    nav: { benefits: "Vorteile", services: "Leistungen", process: "Ablauf", testimonials: "Referenzen", comparison: "Vergleich" },
    hero: {
      headline_a: "Wir bieten",
      headline_b: "Mehrwert",
      headline_c: "für deinen Content.",
      sub: "Mehr Subs, PPV & Tipps – mit Strategie, 1:1-Betreuung und fairen Splits. Du behältst die Kontrolle.",
      cta_call: "Call buchen",
      cta_match: "Plattform Match",
      new: "NEU"
    },
    trust: ["1:1 Coaching", "0 € Setupkosten", "Faire Splits", "Diskrete Betreuung"],
    benefitsTitle: "Warum wir besser sind",
    benefitsSub: "Mehrwert speziell für Adult-Creatorinnen – mit Betreuung, Tools und Deals.",
    benefitsBullets: [
      { title: "Exklusive Deals (OnlyFans, MALOUM)", desc: "Bessere Konditionen, Promo-Slots & Early-Access-Features.", badge:"EXKLUSIV" },
      { title: "Proaktive Betreuung", desc: "1:1-Guidance, klare To-dos & wöchentliche Check-ins." },
      { title: "Transparente Splits", desc: "Volle Einsicht in KPIs & Maßnahmen – ohne Kleingedrucktes." },
      { title: "Skalierbare Tools", desc: "Content-Planung, Funnel & A/B-Tests, die Umsatz hebeln." },
      { title: "Starkes Netzwerk", desc: "Studios, UGC-Teams & Plattformen für bessere CPMs." },
    ],
    servicesTitle: "Leistungen für Adult-Creatorinnen",
    servicesSub: "Fokus auf Plattform-Konversion, DM-Monetarisierung & Markenschutz.",
    services: {
      growthTitle: "OnlyFans/Fansly Growth",
      growthDesc: "Pricing, Bundles, Promotions & KPI-Dashboards für Subs, Tipps & PPV.",
      dmTitle: "DM & PPV Playbooks",
      dmDesc: "Mass-DM-Vorlagen, Upsell-Leitfäden, Chat-Flows & Kauf-Trigger – ohne Spam.",
      consentTitle: "Boundaries & Consent",
      consentDesc: "Klare Content-Grenzen, Einwilligungen & Prozesse – respektvoll, sicher.",
      dmcaTitle: "Content-Schutz (DMCA)",
      dmcaDesc: "Wasserzeichen, Monitoring & Takedowns, damit nichts unkontrolliert kursiert.",
      hybridTitle: "Hybrid Models (ohne Gesicht)",
      hybridBadge: "EXKLUSIV",
      hybridDesc: "Anonym bleiben & trotzdem Umsatz? KI-unterstützte Workflows für eine synthetische Persona, passende Formate & sichere Prozesse – plattform-konform."
    },
    processTitle: "So läuft unsere Zusammenarbeit",
    processSub: "Vom ersten Hallo bis zum 90-Tage-Plan.",
    process: [
      { title: "Kontaktaufnahme", text: "Schreib kurz, wer du bist & wo du stehst – Antwort in 24h.", Icon: PhoneCall },
      { title: "Erstgespräch", text: "Kennenlernen, Ziele, Fragen. Unverbindlich & kostenlos.", Icon: Users },
      { title: "Bedarfsanalyse", text: "Audit: Plattform, Content, Kanäle, Pricing & Prozesse.", Icon: ClipboardList },
      { title: "Wünsche & Ziele", text: "Ziele + Content-Grenzen (Boundaries) sauber festlegen.", Icon: Target },
      { title: "Aktionsplan", text: "90-Tage-Plan mit To-dos, Verantwortlichkeiten & KPIs.", Icon: Rocket },
      { title: "Zusammenarbeit", text: "Transparente Splits, wöchentliche Iteration, nachhaltiges Wachstum.", Icon: Handshake },
    ],
    testiTitle: "Referenzen",
    testiSub: "Echte Stimmen aus unserer Creator-Base – diskret & auf den Punkt.",
    comparisonTitle: "Creator-Base vs. andere Agenturen",
    comparisonRows: [
      { k:"Betreuung", a:"1:1 & proaktiv", b:"Reaktiv, seltene Calls" },
      { k:"Transparenz", a:"Klare Splits + KPIs", b:"Unklare Verträge" },
      { k:"Wachstum", a:"Funnel, A/B-Tests, Plan", b:"Ad-hoc Posts" },
      { k:"Netzwerk", a:"Studios/Plattformen", b:"Einzeln" },
    ],
    contactTitle: "Kostenloses Erstgespräch sichern",
    contactSub: "Erzähl uns kurz von dir – wir melden uns innerhalb von 24 Stunden.",
    contactBullets: ["DSGVO-konform", "Keine Setup-Kosten", "Unverbindlich & ehrlich"],
    contactSend: "Anfrage senden",
    footerImprint: "Impressum", footerPrivacy: "Datenschutz", footerTerms: "AGB",

    // Modal
    modalTitle: "Plattform Match",
    progress: { loading:"KI analysiert deine Angaben…", step1:"Schritt 1/2: Prioritäten & Fragen", step2:"Schritt 2/2: Ergebnis & Vergleich" },
    introTitle: "Schreib uns kurz, was dir wichtig ist",
    introHelp: "z. B.: „Ich will anonym bleiben, 3–4k/Monat, Fokus auf Abos & PayPal, DACH-Zielgruppe.“",
    introPlaceholder: "Deine Prioritäten (Anonymität, Zielumsatz, Plattform-Vorlieben, Region …)",
    form: {
      focus: "Content-Fokus",
      focus_opts: { soft:"Soft / Teasing", erotik:"Erotik", explicit:"Explizit" },
      anon: "Anonym bleiben?",
      yes: "Ja", no: "Nein",
      goal: "Primäres Ziel",
      goal_opts: { subs:"Abos / Stammkundschaft", ppv:"PPV & DMs", discover:"Reichweite" },
      region: "Ziel-Region",
      region_opts: { global:"Global", dach:"DACH", us:"USA-lastig" },
      payout: "Zahlungs-Präferenz",
      payout_opts: { paypal:"PayPal bevorzugt", fast:"Schnelle Auszahlung", highcut:"Hoher %-Anteil" },
      eval: "Auswerten",
    },
    mustsTitle: "Must-haves (hart, optional)",
    musts: { paypal:"PayPal", de:"DE-Support", privacy:"DSGVO", anon:"Anonymität" },
    weightsTitle: "Gewichtungen (0–5)",
    weights: {
      paypal: "PayPal-Wichtigkeit", anon:"Anonymität", ppv:"Abos/PPV",
      fast:"Schnelle Auszahlung", privacy:"Datenschutz/DSGVO", de:"DE-Support",
      focus_fit:"Fokus-Fit", region_fit:"Region-Fit"
    },
    loadingLine1: "Unsere KI denkt…",
    loadingLine2: "Analysiert deine Prioritäten und erstellt das Ranking.",
    hintPaypal: "Hinweis: Viele deutsche Fans bevorzugen PayPal – wegen einfacher, diskreter Zahlung.",
    ourReco: "Unsere Empfehlung",
    featuresTitle: "Features",
    match: "Match",
    whyMalTitle: "Warum MALOUM gut passt",
    whyMalSub: "Basierend auf deinen Prioritäten:",
    back: "Zurück",
    newAnalysis: "Neue Analyse",

    // Feature labels (table)
    featLabels: {
      anon:"Anonymität möglich", ppv:"Stark für Abos & PPV", fast:"Schnelle Auszahlung",
      paypal:"PayPal verfügbar", privacy:"DSGVO/Privatsphäre", de:"DE-Support"
    },

    // Explanations (+/- bullets)
    explain: {
      anon_plus:"+ Anonym möglich", anon_partial:"± Teilweise anonym", anon_minus:"− Keine Anonymität",
      paypal_plus:"+ PayPal verfügbar", paypal_minus:"− Kein PayPal",
      ppv_plus:"+ Stark für Abos/PPV", ppv_minus:"− Schwach für Abos/PPV",
      de_plus:"+ DE-Support/DSGVO", de_minus:"− Wenig DE-Support",
      fast_plus:"+ Schnelle Auszahlung", privacy_plus:"+ Datenschutz/Privatsphäre"
    },

    // Modal close
    close: "Schließen",
  },

  en: {
    brandTag: "The adult agency for sustainable creator growth",
    brandName: "Creator-Base",
    nav: { benefits: "Benefits", services: "Services", process: "Process", testimonials: "Testimonials", comparison: "Comparison" },
    hero: {
      headline_a: "We deliver",
      headline_b: "value",
      headline_c: "for your content.",
      sub: "More subs, PPV & tips — with strategy, 1:1 support and fair splits. You keep control.",
      cta_call: "Book a call",
      cta_match: "Platform Match",
      new: "NEW"
    },
    trust: ["1:1 coaching", "€0 setup fees", "Fair splits", "Discreet support"],
    benefitsTitle: "Why we’re better",
    benefitsSub: "Value built for adult creators — with coaching, tools and deals.",
    benefitsBullets: [
      { title: "Exclusive deals (OnlyFans, MALOUM)", desc: "Better terms, promo slots & early-access features.", badge:"EXCLUSIVE" },
      { title: "Proactive support", desc: "1:1 guidance, clear to-dos & weekly check-ins." },
      { title: "Transparent splits", desc: "Full visibility into KPIs & actions — no small print." },
      { title: "Scalable tools", desc: "Content planning, funnels & A/B tests that move revenue." },
      { title: "Strong network", desc: "Studios, UGC teams & platforms for better CPMs." },
    ],
    servicesTitle: "Services for adult creators",
    servicesSub: "Focus on platform conversion, DM monetization & brand protection.",
    services: {
      growthTitle: "OnlyFans/Fansly Growth",
      growthDesc: "Pricing, bundles, promotions & KPI dashboards for subs, tips & PPV.",
      dmTitle: "DM & PPV Playbooks",
      dmDesc: "Mass DM templates, upsell guides, chat flows & purchase triggers — without spam.",
      consentTitle: "Boundaries & Consent",
      consentDesc: "Clear content boundaries, consents & processes — respectful and safe.",
      dmcaTitle: "Content Protection (DMCA)",
      dmcaDesc: "Watermarks, monitoring & takedowns so nothing spreads uncontrolled.",
      hybridTitle: "Hybrid Models (no face)",
      hybridBadge: "EXCLUSIVE",
      hybridDesc: "Stay anonymous & still earn? AI-assisted workflows for a synthetic persona, fitting formats & safe processes — platform-compliant."
    },
    processTitle: "How our collaboration works",
    processSub: "From first hello to a 90-day plan.",
    process: [
      { title: "Contact", text: "Tell us who you are & where you are — reply within 24h.", Icon: PhoneCall },
      { title: "Intro call", text: "Get to know each other, goals, questions. Free & non-binding.", Icon: Users },
      { title: "Needs analysis", text: "Audit: platform, content, channels, pricing & processes.", Icon: ClipboardList },
      { title: "Wishes & goals", text: "Define goals + content boundaries cleanly.", Icon: Target },
      { title: "Action plan", text: "90-day plan with to-dos, owners & KPIs.", Icon: Rocket },
      { title: "Collaboration", text: "Transparent splits, weekly iteration, sustainable growth.", Icon: Handshake },
    ],
    testiTitle: "Testimonials",
    testiSub: "Real voices from our creator base — discreet & to the point.",
    comparisonTitle: "Creator-Base vs. other agencies",
    comparisonRows: [
      { k:"Support", a:"1:1 & proactive", b:"Reactive, rare calls" },
      { k:"Transparency", a:"Clear splits + KPIs", b:"Vague contracts" },
      { k:"Growth", a:"Funnels, A/B tests, plan", b:"Ad-hoc posting" },
      { k:"Network", a:"Studios/platforms", b:"Single contacts" },
    ],
    contactTitle: "Secure your free intro call",
    contactSub: "Tell us a bit about you — we’ll get back within 24 hours.",
    contactBullets: ["GDPR-compliant", "No setup fees", "Honest & non-binding"],
    contactSend: "Send request",
    footerImprint: "Imprint", footerPrivacy: "Privacy", footerTerms: "Terms",

    // Modal
    modalTitle: "Platform Match",
    progress: { loading:"AI is analyzing your input…", step1:"Step 1/2: Priorities & questions", step2:"Step 2/2: Result & comparison" },
    introTitle: "Tell us briefly what matters to you",
    introHelp: `e.g. "I want to stay anonymous, 3–4k/mo, focus on subs & PayPal, DACH audience."`,
    introPlaceholder: "Your priorities (anonymity, target revenue, platform prefs, region …)",
    form: {
      focus: "Content focus",
      focus_opts: { soft:"Soft / teasing", erotik:"Erotic", explicit:"Explicit" },
      anon: "Stay anonymous?",
      yes: "Yes", no: "No",
      goal: "Primary goal",
      goal_opts: { subs:"Subscriptions / retention", ppv:"PPV & DMs", discover:"Reach" },
      region: "Target region",
      region_opts: { global:"Global", dach:"DACH (German-speaking)", us:"USA-heavy" },
      payout: "Payout preference",
      payout_opts: { paypal:"Prefer PayPal", fast:"Fast payout", highcut:"High % share" },
      eval: "Evaluate",
    },
    mustsTitle: "Must-haves (hard, optional)",
    musts: { paypal:"PayPal", de:"DE support", privacy:"GDPR", anon:"Anonymity" },
    weightsTitle: "Weights (0–5)",
    weights: {
      paypal: "PayPal importance", anon:"Anonymity", ppv:"Subs/PPV",
      fast:"Fast payout", privacy:"Privacy/GDPR", de:"DE support",
      focus_fit:"Focus fit", region_fit:"Region fit"
    },
    loadingLine1: "Our AI is thinking…",
    loadingLine2: "Evaluating your priorities and creating the ranking.",
    hintPaypal: "Note: Many German fans prefer PayPal due to easy, discreet payment.",
    ourReco: "Our recommendation",
    featuresTitle: "Features",
    match: "Match",
    whyMalTitle: "Why MALOUM fits well",
    whyMalSub: "Based on your priorities:",
    back: "Back",
    newAnalysis: "New analysis",

    featLabels: {
      anon:"Anonymity possible", ppv:"Strong for subs & PPV", fast:"Fast payout",
      paypal:"PayPal available", privacy:"Privacy/GDPR", de:"DE support"
    },

    explain: {
      anon_plus:"+ Anonymous possible", anon_partial:"± Partly anonymous", anon_minus:"− No anonymity",
      paypal_plus:"+ PayPal available", paypal_minus:"− No PayPal",
      ppv_plus:"+ Strong for subs/PPV", ppv_minus:"− Weak for subs/PPV",
      de_plus:"+ DE support/GDPR", de_minus:"− Little DE support",
      fast_plus:"+ Fast payout", privacy_plus:"+ Privacy protection"
    },

    close: "Close",
  },
};

/* ====== Helpers ====== */
const Section = ({ id, className = "", children }) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className}`}>
    {children}
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm bg-white/5 border-white/10 backdrop-blur">
    {children}
  </span>
);

/* ★ Bewertungssterne */
const Stars = ({ rating = 5 }) => {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  const empty = 5 - full;
  return (
    <div className="ml-auto flex items-center gap-0.5" aria-label={`${full} von 5 Sternen`}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`full-${i}`} className="text-base leading-none text-[#FFD85A]">★</span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} className="text-base leading-none text-white/30">★</span>
      ))}
    </div>
  );
};

/* Fallback-Avatar */
const FaceBlur = ({ name = "Model" }) => {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  const hair = `hsl(${h}, 60%, 28%)`;
  const skin = `hsl(${(h + 30) % 360}, 55%, 78%)`;
  const bg   = `hsl(${(h + 200) % 360}, 55%, 22%)`;
  return (
    <div className="size-10 rounded-full overflow-hidden relative" aria-hidden>
      <div className="absolute inset-0" style={{ background: bg }} />
      <svg viewBox="0 0 100 100" className="absolute inset-0" style={{ filter: "blur(6px)" }}>
        <circle cx="50" cy="36" r="26" fill={hair} />
        <circle cx="50" cy="40" r="18" fill={skin} />
        <ellipse cx="50" cy="80" rx="28" ry="18" fill={hair} />
      </svg>
    </div>
  );
};

/* Realistischer, unscharfer Avatar */
const AvatarReal = ({ name, src, blur = 6 }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <FaceBlur name={name} />;
  return (
    <div className="size-10 rounded-full overflow-hidden">
      <img
        src={src}
        alt={name}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ filter: `blur(${blur}px) grayscale(10%)`, transform: "scale(1.1)" }}
        onError={() => setError(true)}
      />
    </div>
  );
};

/* ====== Scoring (normalisiert, ohne Live) ====== */
const CRITERIA_DEFAULT = {
  anon: 3, ppv: 3, paypal: 3, fast: 2, privacy: 2, de: 2, focus_fit: 2, region_fit: 2,
};

const PLATFORM_FEATURES = {
  MALOUM:   { anon:1, ppv:1, paypal:1, fast:1, privacy:1, de:1 },
  OnlyFans: { anon:0, ppv:1, paypal:1, fast:1, privacy:1, de:0 },
  Fansly:   { anon:1, ppv:1, paypal:1, fast:1, privacy:1, de:0 },
  Fanvue:   { anon:0, ppv:1, paypal:1, fast:1, privacy:1, de:0 },
  ManyVids: { anon:0, ppv:1, paypal:1, fast:0, privacy:1, de:0 },
};

function violatesMustHaves(p, musts) {
  return musts.some((k) => (PLATFORM_FEATURES[p]?.[k] || 0) < 1);
}

function explainPlatform(p, form, t) {
  const f = PLATFORM_FEATURES[p] || {};
  const r = [];
  if (form.anon)  r.push(f.anon===1 ? t.explain.anon_plus : f.anon===0.5 ? t.explain.anon_partial : t.explain.anon_minus);
  if (form.payout === "paypal") r.push(f.paypal===1 ? t.explain.paypal_plus : t.explain.paypal_minus);
  if (form.goal === "ppv" || form.goal === "subs") r.push(f.ppv ? t.explain.ppv_plus : t.explain.ppv_minus);
  if (form.region === "dach")  r.push(f.de ? t.explain.de_plus : t.explain.de_minus);
  if (f.fast===1) r.push(t.explain.fast_plus);
  if (f.privacy===1) r.push(t.explain.privacy_plus);
  return r.slice(0,4);
}

function computePlatformScores(form, weightOverride = {}, mustHaves = [], t) {
  const W = { ...CRITERIA_DEFAULT, ...weightOverride };
  const platforms = Object.keys(PLATFORM_FEATURES);
  const results = [];

  for (const p of platforms) {
    if (violatesMustHaves(p, mustHaves)) continue;

    let score = 0;
    score += (PLATFORM_FEATURES[p].anon   || 0) * W.anon;
    score += (PLATFORM_FEATURES[p].ppv    || 0) * W.ppv;
    score += (PLATFORM_FEATURES[p].paypal || 0) * W.paypal;
    score += (PLATFORM_FEATURES[p].fast   || 0) * W.fast;
    score += (PLATFORM_FEATURES[p].privacy|| 0) * W.privacy;
    score += (PLATFORM_FEATURES[p].de     || 0) * W.de;

    const focusFit =
      form.focus === "soft"     ? (p === "MALOUM" ? 1 : p === "Fansly" ? 0.6 : 0.3) :
      form.focus === "erotik"   ? (p === "OnlyFans" || p === "MALOUM" ? 1 : 0.6) :
      /* explicit */              (p === "OnlyFans" ? 1 : p === "ManyVids" ? 0.8 : 0.3);

    score += W.focus_fit * focusFit;

    const regionFit =
      form.region === "dach"   ? (p === "MALOUM" ? 1 : 0.4) :
      form.region === "us"     ? (p === "OnlyFans" ? 1 : 0.6) :
      /* global */               0.7;

    score += W.region_fit * regionFit;

    results.push({ name: p, raw: score, reasons: explainPlatform(p, form, t) });
  }

  const maxPossible =
    W.anon + W.ppv + W.paypal + W.fast + W.privacy + W.de +
    W.focus_fit + W.region_fit;

  const normalized = results.map(r => ({
    ...r,
    match: Math.round((r.raw / maxPossible) * 100)
  }));

  normalized.sort((a,b)=> b.match - a.match || (a.name==="MALOUM"?-1:0));
  return normalized;
}

/* ====== Page ====== */
export default function Page() {
  const reduce = useReducedMotion();
  const [lang, setLang] = useState("de");
  const t = I18N[lang];

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("cb_lang") : null;
    if (saved === "en" || saved === "de") setLang(saved);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("cb_lang", lang);
  }, [lang]);

  /* Plattform Match – State */
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchStep, setMatchStep] = useState(1);   // 1=Fragen, 2=Ergebnis
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchContext, setMatchContext] = useState(null);

  // Body-Scroll locken, wenn Modal offen (Mobile-Fix)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (matchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [matchOpen]);

  const [pcForm, setPcForm] = useState({
    focus: "soft",      // soft | erotik | explicit
    anon: false,        // boolean
    goal: "subs",       // subs | ppv | discover
    region: "global",   // global | dach | us
    payout: "paypal",   // paypal | fast | highcut
    intro: ""           // Freitext
  });

  // Gewichtungen & Must-haves
  const [weights, setWeights] = useState({});
  const [musts, setMusts] = useState([]); // ["paypal","de","privacy","anon"]

  const progressLabel = matchLoading ? t.progress.loading : (matchStep === 1 ? t.progress.step1 : t.progress.step2);
  const progressWidth = matchLoading ? "75%" : (matchStep === 1 ? "50%" : "100%");

  function inferFromIntro(text) {
    const tt = (text || "").toLowerCase();
    const u = {};
    if (/anonym|ohne gesicht|diskret|anonymous|discreet/.test(tt)) u.anon = true;
    if (/abo|subscription|subs/.test(tt)) u.goal = "subs";
    if (/(ppv|dm|direct|nachricht|pay per view|upsell)/.test(tt)) u.goal = "ppv";
    if (/\bde\b|deutsch|german|dach/.test(tt)) u.region = "dach";
    if (/\bus\b|usa|america/.test(tt)) u.region = "us";
    if (/paypal/.test(tt)) u.payout = "paypal";
    return u;
  }

  function submitPlatformMatch(e) {
    e?.preventDefault?.();
    const inferred = inferFromIntro(pcForm.intro);
    const merged = { ...pcForm, ...inferred };
    setMatchContext(merged);
    setMatchLoading(true);
    setMatchStep(1);
    setTimeout(() => {
      const ranking = computePlatformScores(merged, weights, musts, t);
      setMatchResult(ranking);
      setMatchLoading(false);
      setMatchStep(2);
    }, 900);
  }

  /* Vergleichs-Tabellenanzeige (Features) */
  const FEATURES = [
    { key:"anon",    label: t.featLabels.anon },
    { key:"ppv",     label: t.featLabels.ppv },
    { key:"fast",    label: t.featLabels.fast },
    { key:"paypal",  label: t.featLabels.paypal },
    { key:"privacy", label: t.featLabels.privacy },
    { key:"de",      label: t.featLabels.de },
  ];

  const PROFILE = {
    MALOUM:   { anon:true,  ppv:true, fast:true,  paypal:true,  privacy:true, de:true  },
    OnlyFans: { anon:false, ppv:true, fast:true,  paypal:true,  privacy:true, de:false },
    Fansly:   { anon:true,  ppv:true, fast:true,  paypal:true,  privacy:true, de:false },
    Fanvue:   { anon:false, ppv:true, fast:true,  paypal:true,  privacy:true, de:false },
    ManyVids: { anon:false, ppv:true, fast:false, paypal:true,  privacy:true, de:false }
  };

  const IconCell = ({v}) => v === true
    ? <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="size-4" />Ja</span>
    : v === false
      ? <span className="inline-flex items-center gap-1 text-rose-400"><X className="size-4" />Nein</span>
      : <span className="inline-flex items-center gap-1 text-white/70"><Minus className="size-4" />Teilweise</span>;

  // Lokalisierte Ja/Nein/Teilweise für IconCell (kleiner Hack)
  const LocalIconCell = ({v}) => {
    const label = v === true ? (lang==="de"?"Ja":"Yes") : v === false ? (lang==="de"?"Nein":"No") : (lang==="de"?"Teilweise":"Partial");
    const Icon = v === true ? Check : v === false ? X : Minus;
    const color = v === true ? "text-emerald-400" : v === false ? "text-rose-400" : "text-white/70";
    return <span className={`inline-flex items-center gap-1 ${color}`}><Icon className="size-4"/>{label}</span>;
  };

  /* Testimonials (9x MALOUM, unscharf) – mit zweisprachigem Text */
  const TESTIMONIALS = [
    { name: "Hannah L.", role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Wöchentliche To-dos, klare Preise, DM-Templates – endlich Struktur.",
      text_en: "Weekly to-dos, clear pricing, DM templates — finally structure." },
    { name: "Mia K.",    role: "Fansly",   rating: 4, img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Diskret & fair. In 8 Wochen auf planbare 4-stellige Umsätze.",
      text_en: "Discreet & fair. Reached predictable 4-figure revenue in 8 weeks." },
    { name: "Lea S.",    role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Abo-Bundles + PPV-Plan = weniger Stress, mehr Cashflow.",
      text_en: "Sub bundles + PPV plan = less stress, more cash flow." },
    { name: "Nora P.",   role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Anonym bleiben & wachsen – die KI-Workflows sind Gold wert.",
      text_en: "Stay anonymous & grow — the AI workflows are gold." },
    { name: "Julia M.",  role: "MALOUM",   rating: 4, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Promo-Slots & Pricing-Tests haben meine Konversion verdoppelt.",
      text_en: "Promo slots & pricing tests doubled my conversion." },
    { name: "Alina R.",  role: "Fansly",   rating: 4, img: "https://images.unsplash.com/photo-1549351512-c5e12b12bda4?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Ehrlich, respektvoll, transparent. Genau so stelle ich mir’s vor.",
      text_en: "Honest, respectful, transparent. Exactly how it should be." },
    { name: "Emma T.",   role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Endlich KPIs, die Sinn machen – und ein 90-Tage-Plan.",
      text_en: "Finally KPIs that make sense — and a 90-day plan." },
    { name: "Sofia W.",  role: "MALOUM",   rating: 4, img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Persona, Content-Cadence, DM-Skripte – passt zu meinem Alltag.",
      text_en: "Persona, content cadence, DM scripts — fits my routine." },
    { name: "Lara B.",   role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Weniger Posten, mehr Wirkung. Funnels statt Zufall.",
      text_en: "Post less, impact more. Funnels, not luck." },
    { name: "Zoe F.",    role: "MALOUM",   rating: 4, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Check-ins halten mich accountable. Wachstum ist messbar.",
      text_en: "Check-ins keep me accountable. Growth is measurable." },
    { name: "Paula D.",  role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Faire Splits & echte Hilfe. Kein leeres Agentur-Blabla.",
      text_en: "Fair splits & real help. No empty agency talk." },
    { name: "Kim A.",    role: "OnlyFans", rating: 4, img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "PayPal-Fokus für DE-Fans war der Gamechanger.",
      text_en: "PayPal focus for DE fans was the game changer." },
  ];

  return (
    <>
      {/* background glow */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle at 50% 50%, ${ACCENT}55, transparent 60%)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle at 50% 50%, #6a00ff55, transparent 60%)` }}
        />
      </div>

      {/* NAV */}
      <Section className="py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg grid place-items-center font-bold" style={{ background: ACCENT }}>CB</div>
            <span className="font-semibold tracking-tight">{t.brandName}</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">Agency</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">18+</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#vorteile" className="hover:text-white">{t.nav.benefits}</a>
            <a href="#leistungen" className="hover:text-white">{t.nav.services}</a>
            <a href="#prozess" className="hover:text-white">{t.nav.process}</a>
            <a href="#referenzen" className="hover:text-white">{t.nav.testimonials}</a>
            <a href="#vergleich" className="hover:text-white">{t.nav.comparison}</a>
          </nav>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <button
              onClick={()=> setLang(l => l==="de" ? "en" : "de")}
              className="rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-xs hover:bg-white/20"
              title={lang==="de" ? "Switch to English" : "Auf Deutsch wechseln"}
              aria-label="Language switch"
            >
              {lang === "de" ? "EN" : "DE"}
            </button>

            <a href="#kontakt" className="hidden md:inline-flex rounded-lg px-4 py-2" style={{ background: ACCENT }}>
              {lang==="de" ? "Kostenloses Erstgespräch" : "Free intro call"}
            </a>
          </div>
        </div>
      </Section>

      {/* HERO */}
      <Section className="pt-6 pb-10 md:pt-10 md:pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.001 : 0.5 }}
          >
            <Pill>
              <Sparkles className="size-4" />
              <span>{t.brandTag}</span>
            </Pill>

            <div className="mt-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                {t.hero.headline_a}{" "}
                <span
                  className="rounded px-2 -mx-1 ring-1 ring-white/10"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.45)` }}
                >
                  {t.hero.headline_b}
                </span>{" "}
                {t.hero.headline_c}
              </h1>
              <p className="mt-4 text-white/80 text-base md:text-lg max-w-prose">
                {t.hero.sub}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#kontakt" className="gap-2 px-5 py-3 rounded-xl inline-flex items-center" style={{ background: ACCENT }}>
                {t.hero.cta_call} <ArrowRight className="size-5" />
              </a>
              {/* Platform Match – neutral */}
              <button
                type="button"
                onClick={() => { setMatchOpen(true); setMatchStep(1); setMatchResult(null); setMatchLoading(false); }}
                className="relative px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              >
                {t.hero.cta_match}
                <span
                  className="absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: ACCENT + "26", color: ACCENT }}
                >
                  {t.hero.new}
                </span>
              </button>
            </div>

            {/* Trust points */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/70">
              {t.trust.map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" style={{ color: ACCENT }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.001 : 0.55, delay: reduce ? 0 : 0.05 }}
            className="relative md:mt-10 lg:mt-16 xl:mt-20"
          >
            <div className="rounded-xl bg-[#0f0f14] border border-white/10 overflow-hidden shadow-lg" role="img" aria-label="Creator Dashboard — 90 Tage">
              <div className="px-4 py-2 flex items-center justify-between text-xs text-white/70 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full bg-red-500"></span>
                  <span className="inline-block size-2.5 rounded-full bg-yellow-500"></span>
                  <span className="inline-block size-2.5 rounded-full bg-emerald-500"></span>
                  <span className="ml-3 text-white/60">Creator Dashboard — 90 Days</span>
                </div>
                <span className="inline-flex items-center gap-1"><LineChart className="size-3" /> +38% / 30D</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60">{lang==="de"?"Monatsumsatz":"Monthly revenue"}</div>
                    <div className="mt-1 text-lg font-semibold">€12.4k</div>
                    <div className="text-[10px] text-emerald-400">+18% WoW</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60">{lang==="de"?"Neue Subs":"New subs"}</div>
                    <div className="mt-1 text-lg font-semibold">+427</div>
                    <div className="text-[10px] text-emerald-400">+22% WoW</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60">PPV</div>
                    <div className="mt-1 text-lg font-semibold">€6.8k</div>
                    <div className="text-[10px] text-emerald-400">+31% WoW</div>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white/5 p-2.5">
                  <svg viewBox="0 0 300 100" className="w-full h-24 md:h-28" role="img" aria-label="Revenue trend">
                    <polyline points="0,80 50,70 100,72 150,65 200,60 250,58 300,50" fill="none" stroke="#ffffff33" strokeWidth="2" />
                    <polyline points="0,85 40,78 80,75 120,68 160,62 200,55 240,45 300,40" fill="none" stroke={ACCENT} strokeWidth="3" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* VORTEILE / BENEFITS */}
      <Section id="vorteile" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.benefitsTitle}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.benefitsSub}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-4">
            {t.benefitsBullets.slice(0,3).map((b,i)=>(
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">
                    {b.title}
                    {b.badge && (
                      <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                        {b.badge}
                      </span>
                    )}
                  </p>
                  <p className="text-white/75 text-sm">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <ul className="space-y-4">
            {t.benefitsBullets.slice(3).map((b,i)=>(
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-white/75 text-sm">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* LEISTUNGEN / SERVICES */}
      <Section id="leistungen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.servicesTitle}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.servicesSub}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <LineChart className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">{t.services.growthTitle}</h3>
            <p className="text-sm text-white/80">{t.services.growthDesc}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <Users className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">{t.services.dmTitle}</h3>
            <p className="text-sm text-white/80">{t.services.dmDesc}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <ShieldCheck className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">{t.services.consentTitle}</h3>
            <p className="text-sm text-white/80">{t.services.consentDesc}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <ShieldCheck className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">{t.services.dmcaTitle}</h3>
            <p className="text-sm text-white/80">{t.services.dmcaDesc}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <EyeOff className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">
              {t.services.hybridTitle}
              <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                {t.services.hybridBadge}
              </span>
            </h3>
            <p className="text-sm text-white/80">{t.services.hybridDesc}</p>
          </div>
        </div>
      </Section>

      {/* PROZESS / PROCESS */}
      <Section id="prozess" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.processTitle}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.processSub}</p>

        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute top-0 w-[2px] bg-white/15 left-2 sm:left-3"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: reduce ? 0 : 0.8 }}
          />
          <ol className="relative pl-6 sm:pl-8 space-y-8">
            {t.process.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduce ? 0.001 : 0.4, delay: reduce ? 0 : i * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[3px] top-1 size-3 rounded-full" style={{ background: ACCENT }} />
                <div className="flex items-center gap-2 mb-1">
                  <s.Icon className="size-4" style={{ color: ACCENT }} />
                  <h4 className="font-semibold">{s.title}</h4>
                </div>
                <p className="text-white/75 text-sm">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      {/* REFERENZEN / TESTIMONIALS */}
      <Section id="referenzen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.testiTitle}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.testiSub}</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((ttem, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <AvatarReal name={ttem.name} src={ttem.img} />
                <div>
                  <div className="font-semibold">{ttem.name}</div>
                  <div className="text-xs text-white/60">{ttem.role}</div>
                </div>
                <Stars rating={ttem.rating} />
              </div>
              <p className="mt-3 text-white/80 text-sm">“{lang==="de" ? ttem.text_de : ttem.text_en}”</p>
            </div>
          ))}
        </div>
      </Section>

      {/* VERGLEICH / COMPARISON */}
      <Section id="vergleich" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.comparisonTitle}</h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm md:text-base border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-white/70">
                <th className="py-3 px-4">{lang==="de"?"Kriterium":"Criterion"}</th>
                <th className="py-3 px-4">{t.brandName}</th>
                <th className="py-3 px-4">{lang==="de"?"Andere":"Others"}</th>
              </tr>
            </thead>
            <tbody>
              {t.comparisonRows.map((row, i) => (
                <tr key={i} className="align-top">
                  <td className="py-3 px-4 text-white/80">{row.k}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-1 size-4" style={{ color: ACCENT }} />
                      <span className="text-white">{row.a}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/60">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* KONTAKT / CONTACT */}
      <Section id="kontakt" className="py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{t.contactTitle}</h2>
            <p className="mt-2 text-white/75 max-w-prose">{t.contactSub}</p>
            <ul className="mt-5 space-y-2 text-white/75 text-sm">
              {t.contactBullets.map((b,i)=>(
                <li key={i} className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> {b}</li>
              ))}
            </ul>
          </div>

          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="p-6 rounded-2xl border bg-white/5 border-white/10 backdrop-blur"
          >
            <input type="hidden" name="access_key" value="a4174bd0-9c62-4f19-aa22-5c22a03e8da2" />
            <input type="hidden" name="subject" value={lang==="de" ? "Neue Anfrage – Creator-Base" : "New inquiry – Creator-Base"} />
            <input type="hidden" name="from_name" value="Creator-Base Website" />
            <input type="hidden" name="replyto" value="email" />
            <input type="hidden" name="redirect" value="https://www.creator-base.com/danke" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            <div className="grid gap-4">
              <div>
                <label className="text-sm text-white/80">{lang==="de"?"Dein Name":"Your name"}</label>
                <input name="name" required placeholder={lang==="de"?"Vor- und Nachname":"First & last name"}
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">E-Mail</label>
                <input type="email" name="email" required placeholder="name@mail.com"
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">{lang==="de"?"Kurz zu dir":"Tell us a bit about you"}</label>
                <textarea name="message" rows={4} placeholder={lang==="de"?"Wo stehst du? Welche Ziele hast du?":"Where are you right now? What are your goals?"}
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded" style={{ background: ACCENT }}>
                {t.contactSend}
              </button>
            </div>
          </form>
        </div>
      </Section>

      {/* ==== PLATFORM MATCH MODAL ==== */}
      {matchOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setMatchOpen(false)} />

          {/* Scroll-Container (Mobile fix) */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="min-h-full flex items-start md:items-center justify-center p-4">
              <div className="mx-4 md:mx-0 rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl overflow-hidden w-full md:w-[880px] max-h-[calc(100dvh-2rem)] flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/60">{t.brandName}</div>
                    <div className="text-lg font-semibold">{t.modalTitle}</div>
                  </div>
                  <button onClick={()=>setMatchOpen(false)} className="text-white/70 hover:text-white flex items-center gap-1">
                    <XCircle className="size-5" /> {t.close}
                  </button>
                </div>

                {/* Content scrollable */}
                <div className="overflow-y-auto">
                  {/* Progress */}
                  <div className="px-5 py-2">
                    <div className="h-1 w-full bg-white/10 rounded">
                      <div className="h-1 rounded" style={{ width: progressWidth, background:ACCENT }} />
                    </div>
                    <div className="mt-2 text-xs text-white/60">{progressLabel}</div>
                  </div>

                  {/* STEP 1 (Form) */}
                  {matchStep === 1 && !matchLoading && (
                    <form onSubmit={submitPlatformMatch} className="px-5 pb-24 grid gap-4">
                      {/* KI-Intro */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-white/60">{lang==="de"?"KI-gestützt":"AI-assisted"}</div>
                        <div className="text-lg font-semibold mt-1">{t.introTitle}</div>
                        <p className="text-white/70 text-sm mt-1">{t.introHelp}</p>
                        <textarea
                          value={pcForm.intro}
                          onChange={(e)=>setPcForm(v=>({...v, intro:e.target.value}))}
                          rows={3}
                          placeholder={t.introPlaceholder}
                          className="w-full mt-3 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>

                      {/* Auswahlfragen (ohne Live) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/80">{t.form.focus}</label>
                          <select value={pcForm.focus} onChange={e=>setPcForm(v=>({...v, focus:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="soft">{t.form.focus_opts.soft}</option>
                            <option value="erotik">{t.form.focus_opts.erotik}</option>
                            <option value="explicit">{t.form.focus_opts.explicit}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{t.form.anon}</label>
                          <select value={pcForm.anon?'yes':'no'} onChange={e=>setPcForm(v=>({...v, anon:e.target.value==='yes'}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="no">{t.form.no}</option>
                            <option value="yes">{t.form.yes}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{t.form.goal}</label>
                          <select value={pcForm.goal} onChange={e=>setPcForm(v=>({...v, goal:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="subs">{t.form.goal_opts.subs}</option>
                            <option value="ppv">{t.form.goal_opts.ppv}</option>
                            <option value="discover">{t.form.goal_opts.discover}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{t.form.region}</label>
                          <select value={pcForm.region} onChange={e=>setPcForm(v=>({...v, region:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="global">{t.form.region_opts.global}</option>
                            <option value="dach">{t.form.region_opts.dach}</option>
                            <option value="us">{t.form.region_opts.us}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{t.form.payout}</label>
                          <select value={pcForm.payout} onChange={e=>setPcForm(v=>({...v, payout:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="paypal">{t.form.payout_opts.paypal}</option>
                            <option value="fast">{t.form.payout_opts.fast}</option>
                            <option value="highcut">{t.form.payout_opts.highcut}</option>
                          </select>
                        </div>
                      </div>

                      {/* Must-haves */}
                      <div>
                        <div className="text-sm text-white/80 mb-2">{t.mustsTitle}</div>
                        {[
                          {k:"paypal", label:t.musts.paypal},
                          {k:"de", label:t.musts.de},
                          {k:"privacy", label:t.musts.privacy},
                          {k:"anon", label:t.musts.anon},
                        ].map(({k,label}) => (
                          <button
                            type="button"
                            key={k}
                            onClick={()=> setMusts(m => m.includes(k) ? m.filter(x=>x!==k) : [...m,k])}
                            className={`mr-2 mb-2 px-2 py-1 rounded text-xs border ${
                              musts.includes(k) ? "bg-emerald-500/20 border-emerald-400" : "bg-white/10 border-white/20"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Gewichtungen */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-sm font-semibold mb-3">{t.weightsTitle}</div>
                        {[
                          {k:"paypal", label:t.weights.paypal},
                          {k:"anon", label:t.weights.anon},
                          {k:"ppv", label:t.weights.ppv},
                          {k:"fast", label:t.weights.fast},
                          {k:"privacy", label:t.weights.privacy},
                          {k:"de", label:t.weights.de},
                          {k:"focus_fit", label:t.weights.focus_fit},
                          {k:"region_fit", label:t.weights.region_fit},
                        ].map(({k,label}) => (
                          <div key={k} className="grid grid-cols-[140px_1fr_38px] items-center gap-3 py-1">
                            <label className="text-xs text-white/75">{label}</label>
                            <input
                              type="range" min={0} max={5} step={1}
                              value={weights[k] ?? CRITERIA_DEFAULT[k]}
                              onChange={(e)=>setWeights(w=>({...w, [k]: Number(e.target.value)}))}
                            />
                            <span className="text-xs text-white/60 tabular-nums w-8 text-right">
                              {weights[k] ?? CRITERIA_DEFAULT[k]}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Sticky Footer: nur Auswerten */}
                      <div className="sticky bottom-0 -mx-5 px-5 py-3 border-t border-white/10 bg-[#0f0f14]/95 backdrop-blur">
                        <div className="flex items-center justify-end">
                          <button type="submit" className="px-4 py-2 rounded inline-flex items-center gap-1" style={{ background: ACCENT }}>
                            {t.form.eval} <ChevronRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Loading */}
                  {matchStep === 1 && matchLoading && (
                    <div className="px-5 py-16 flex flex-col items-center text-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white/20 animate-spin"
                        style={{ borderTopColor: ACCENT }}
                        aria-label="AI thinking…"
                      />
                      <div className="text-white/80 font-medium">{t.loadingLine1}</div>
                      <div className="text-white/60 text-sm">{t.loadingLine2}</div>
                    </div>
                  )}

                  {/* STEP 2 – Result */}
                  {matchStep === 2 && matchResult && (
                    <div className="px-5 pb-24">
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                        {t.hintPaypal}
                      </div>

                      {/* Top 3 */}
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {matchResult.slice(0,3).map((p) => (
                          <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xl font-semibold">{p.name}</div>
                                <div className="text-white/70 text-sm">{t.match} {p.match}%</div>
                              </div>
                              {p.name === "MALOUM" && (
                                <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                                  {t.ourReco}
                                </span>
                              )}
                            </div>

                            <div className="mt-3">
                              <div className="text-white/70 text-sm mb-1">{t.featuresTitle}</div>
                              <ul className="space-y-2">
                                {FEATURES.map(f => {
                                  const v = PROFILE[p.name]?.[f.key];
                                  return (
                                    <li key={f.key} className="flex items-center justify-between">
                                      <span className="text-white/80">{f.label}</span>
                                      <LocalIconCell v={v} />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            {/* Gründe kurz */}
                            {p.reasons?.length > 0 && (
                              <div className="mt-3 text-xs text-white/70">
                                {p.reasons.slice(0,3).map((r,i)=> <div key={i}>• {r}</div>)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Explanation MALOUM */}
                      <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="text-lg font-semibold">{t.whyMalTitle}</div>
                        <div className="text-white/70 text-sm">{t.whyMalSub}</div>
                        <ul className="mt-3 space-y-2 text-white/90">
                          {(() => {
                            const r = [];
                            if (!matchContext) return null;
                            if (matchContext.anon) r.push(lang==="de"
                              ? "Du willst anonym bleiben – MALOUM unterstützt Hybrid-Modelle & Pseudonyme sehr gut."
                              : "You want to stay anonymous — MALOUM supports hybrid models & pseudonyms very well.");
                            if (matchContext.goal === "subs" || matchContext.goal === "ppv") r.push(lang==="de"
                              ? "Fokus auf Abos & PPV – planbare Bundles und stabile Monetarisierung."
                              : "Focus on subs & PPV — predictable bundles and stable monetization.");
                            if (matchContext.payout === "paypal" || matchContext.region === "dach") r.push(lang==="de"
                              ? "Auszahlungen via PayPal & DE-Support – schnell & unkompliziert."
                              : "Payouts via PayPal & DE support — fast and straightforward.");
                            if (matchContext.region === "dach") r.push(lang==="de"
                              ? "DSGVO-orientierte Prozesse & deutschsprachiger Support."
                              : "GDPR-oriented processes & German-language support.");
                            if (r.length === 0) r.push(lang==="de"
                              ? "Solider Allround-Fit für planbares Wachstum und saubere Prozesse."
                              : "Solid all-round fit for predictable growth and clean processes.");
                            return r.map((txt, i) => <li key={i}>• {txt}</li>);
                          })()}
                        </ul>
                      </div>

                      {/* Sticky Footer Ergebnis: Zurück / Neu */}
                      <div className="sticky bottom-0 -mx-5 px-5 py-3 border-t border-white/10 bg-[#0f0f14]/95 backdrop-blur">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={()=>{ setMatchStep(1); setMatchLoading(false); }}
                            className="px-4 py-2 rounded bg-white/10 border border-white/20"
                          >
                            {t.back}
                          </button>
                          <button
                            onClick={()=>{ setMatchStep(1); setMatchResult(null); setMatchContext(null); }}
                            className="px-4 py-2 rounded"
                            style={{ background: ACCENT }}
                          >
                            {t.newAnalysis}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Section className="py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/70 text-sm">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-lg grid place-items-center font-bold" style={{ background: ACCENT }}>CB</div>
            <span>© {new Date().getFullYear()} {t.brandName}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#">{t.footerImprint}</a>
            <a href="#">{t.footerPrivacy}</a>
            <a href="#">{t.footerTerms}</a>
          </div>
        </div>
      </Section>
    </>
  );
}
