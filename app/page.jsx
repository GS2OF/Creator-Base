"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff,
  Check, X, Minus, ChevronRight, XCircle, Link2, Languages
} from "lucide-react";

/* THEME */
const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

/* ====== i18n ====== */
type Lang = "de" | "en";
const I18N: Record<Lang, any> = {
  de: {
    nav: { vorteile:"Vorteile", leistungen:"Leistungen", prozess:"Ablauf", referenzen:"Referenzen", vergleich:"Vergleich" },
    hero: {
      pill: "Die Adult-Agentur für nachhaltiges Creator-Wachstum",
      h1_a:"Wir bieten", h1_b:"Mehrwert", h1_c:"für deinen Content.",
      sub:"Mehr Subs, PPV & Tipps – mit Strategie, 1:1-Betreuung und fairen Splits. Du behältst die Kontrolle.",
      cta_call:"Call buchen", cta_match:"Plattform Match", new:"NEU"
    },
    trust: ["1:1 Coaching", "0 € Setupkosten", "Faire Splits", "Diskrete Betreuung"],
    vorteile_h:"Warum wir besser sind",
    vorteile_p:"Mehrwert speziell für Adult-Creatorinnen – mit Betreuung, Tools und Deals.",
    exklusive:"Exklusive Deals (OnlyFans, MALOUM)", exklusiv:"EXKLUSIV",
    v_items:[
      ["Proaktive Betreuung","1:1-Guidance, klare To-dos & wöchentliche Check-ins."],
      ["Transparente Splits","Volle Einsicht in KPIs & Maßnahmen – ohne Kleingedrucktes."],
      ["Skalierbare Tools","Content-Planung, Funnel & A/B-Tests, die Umsatz hebeln."],
      ["Starkes Netzwerk","Studios, UGC-Teams & Plattformen für bessere CPMs."]
    ],
    leistungen_h:"Leistungen für Adult-Creatorinnen",
    leistungen_p:"Fokus auf Plattform-Konversion, DM-Monetarisierung & Markenschutz.",
    l_cards:[
      ["OnlyFans/Fansly Growth","Pricing, Bundles, Promotions & KPI-Dashboards für Subs, Tipps & PPV."],
      ["DM & PPV Playbooks","Mass-DM-Vorlagen, Upsell-Leitfäden, Chat-Flows & Kauf-Trigger – ohne Spam."],
      ["Boundaries & Consent","Klare Content-Grenzen, Einwilligungen & Prozesse – respektvoll, sicher."],
      ["Content-Schutz (DMCA)","Wasserzeichen, Monitoring & Takedowns, damit nichts unkontrolliert kursiert."],
      ["Diskretion & Privatsphäre","DSGVO-konforme Abläufe, Alias-Strategien & sensible Kommunikation."],
      ["Hybrid Models (ohne Gesicht)","Anonym bleiben & trotzdem Umsatz? KI-unterstützte Workflows für eine synthetische Persona."]
    ],
    prozess_h:"So läuft unsere Zusammenarbeit",
    prozess_p:"Vom ersten Hallo bis zum 90-Tage-Plan.",
    steps:[
      ["Kontaktaufnahme","Schreib kurz, wer du bist & wo du stehst – Antwort in 24h."],
      ["Erstgespräch","Kennenlernen, Ziele, Fragen. Unverbindlich & kostenlos."],
      ["Bedarfsanalyse","Audit: Plattform, Content, Kanäle, Pricing & Prozesse."],
      ["Wünsche & Ziele","Ziele + Content-Grenzen (Boundaries) sauber festlegen."],
      ["Aktionsplan","90-Tage-Plan mit To-dos, Verantwortlichkeiten & KPIs."],
      ["Zusammenarbeit","Transparente Splits, wöchentliche Iteration, nachhaltiges Wachstum."]
    ],
    refs_h:"Referenzen",
    refs_p:"Echte Stimmen aus unserer Creator-Base – diskret & auf den Punkt.",
    vergleich_h:"Creator-Base vs. andere Agenturen",
    vergleich_rows:[
      ["Betreuung","1:1 & proaktiv","Reaktiv, seltene Calls"],
      ["Transparenz","Klare Splits + KPIs","Unklare Verträge"],
      ["Wachstum","Funnel, A/B-Tests, Plan","Ad-hoc Posts"],
      ["Netzwerk","Studios/Plattformen","Einzeln"]
    ],
    kontakt_h:"Kostenloses Erstgespräch sichern",
    kontakt_p:"Erzähl uns kurz von dir – wir melden uns innerhalb von 24 Stunden.",
    kontakt_bullets:["DSGVO-konform","Keine Setup-Kosten","Unverbindlich & ehrlich"],
    kontakt_send:"Anfrage senden",
    footer_impressum:"Impressum", footer_privacy:"Datenschutz", footer_agb:"AGB",

    /* Plattform Match */
    pm_title:"Plattform Match",
    pm_progress_1:"Schritt 1/2: Prioritäten & Fragen",
    pm_progress_loading:"KI analysiert deine Angaben…",
    pm_progress_2:"Schritt 2/2: Ergebnis & Vergleich",
    pm_intro_title:"Schreib uns kurz, was dir wichtig ist",
    pm_intro_hint:"z. B.: „Ich will anonym bleiben, 3–4k/Monat verdienen, Fokus auf Abos & PayPal, DACH-Zielgruppe.“",
    pm_intro_ph:"Deine Prioritäten (Anonymität, Zielumsatz, Plattform-Vorlieben, Region …)",
    pm_copy:"Link kopieren", pm_copied:"Kopiert!",
    pm_btn_cancel:"Abbrechen", pm_btn_analyze:"Auswerten", pm_btn_back:"Zurück", pm_btn_close:"Schließen",
    pm_sliders_h:"Prioritäten (wirken direkt aufs Ranking)",
    s_anon:"Anonymität wichtig",
    s_paypal:"Bequeme Zahlungen (PayPal)",
    s_dach:"Fokus DACH/DE",
    s_monetize:"Monetarisierung statt Reichweite",
    hint_anon:"Höher = Plattformen mit guter Pseudonym/Hybrid-Unterstützung.",
    hint_paypal:"Höher = Plattformen mit einfacher, diskreter Zahlung.",
    hint_dach:"Höher = DSGVO & DE-Support relevanter.",
    hint_monetize:"Höher = Abos/PPV wichtiger als reine Reichweite.",
    pm_notice:"Hinweis: Viele deutsche Fans bevorzugen PayPal – wegen einfacher, diskreter Zahlung.",
    pm_feat:"Features",
    pm_why_h:"Warum MALOUM die richtige Empfehlung ist",
    pm_why_p:"Basierend auf deinen Prioritäten:",
  },
  en: {
    nav: { vorteile:"Benefits", leistungen:"Services", prozess:"Process", referenzen:"References", vergleich:"Comparison" },
    hero: {
      pill:"The adult agency for sustainable creator growth",
      h1_a:"We deliver", h1_b:"value", h1_c:"for your content.",
      sub:"More subs, PPV & tips — with strategy, 1:1 support and fair splits. You keep control.",
      cta_call:"Book a call", cta_match:"Platform Match", new:"NEW"
    },
    trust:["1:1 coaching","€0 setup","Fair splits","Discreet support"],
    vorteile_h:"Why we’re better",
    vorteile_p:"Value tailored for adult creators — with support, tools and deals.",
    exklusive:"Exclusive deals (OnlyFans, MALOUM)", exklusiv:"EXCLUSIVE",
    v_items:[
      ["Proactive support","1:1 guidance, clear to-dos & weekly check-ins."],
      ["Transparent splits","Full KPI & action visibility — no fine print."],
      ["Scalable tools","Planning, funnels & A/B tests that lift revenue."],
      ["Strong network","Studios, UGC teams & platforms for better CPMs."]
    ],
    leistungen_h:"Services for adult creators",
    leistungen_p:"Focus on platform conversion, DM monetization & brand protection.",
    l_cards:[
      ["OnlyFans/Fansly growth","Pricing, bundles, promos & KPI dashboards for subs, tips & PPV."],
      ["DM & PPV playbooks","Mass-DM templates, upsell scripts, chat flows — without spam."],
      ["Boundaries & consent","Clear content limits, consent & safe processes."],
      ["Content protection (DMCA)","Watermarks, monitoring & takedowns."],
      ["Discretion & privacy","GDPR-compliant processes & sensitive comms."],
      ["Hybrid models (faceless)","Stay anonymous and still monetize with AI-assisted workflows."]
    ],
    prozess_h:"How we work together",
    prozess_p:"From first hello to your 90-day plan.",
    steps:[
      ["Get in touch","Tell us where you are — reply within 24h."],
      ["Intro call","Meet, goals, questions. Free & non-binding."],
      ["Needs analysis","Audit: platform, content, channels, pricing & processes."],
      ["Goals & boundaries","Define targets & content boundaries."],
      ["Action plan","90-day plan: tasks, ownership, KPIs."],
      ["Collaboration","Transparent splits, weekly iteration, sustainable growth."]
    ],
    refs_h:"References",
    refs_p:"Real voices from our creator base — discreet & concise.",
    vergleich_h:"Creator-Base vs other agencies",
    vergleich_rows:[
      ["Support","1:1 & proactive","Reactive, rare calls"],
      ["Transparency","Clear splits + KPIs","Vague contracts"],
      ["Growth","Funnels, A/B tests, plan","Ad-hoc posting"],
      ["Network","Studios/platforms","Solo"]
    ],
    kontakt_h:"Secure a free intro call",
    kontakt_p:"Tell us briefly about you — we’ll get back within 24 hours.",
    kontakt_bullets:["GDPR-compliant","No setup fees","Honest & non-binding"],
    kontakt_send:"Send request",
    footer_impressum:"Imprint", footer_privacy:"Privacy", footer_agb:"T&C",

    /* Platform Match */
    pm_title:"Platform Match",
    pm_progress_1:"Step 1/2: Priorities & questions",
    pm_progress_loading:"AI is analysing your inputs…",
    pm_progress_2:"Step 2/2: Result & comparison",
    pm_intro_title:"Tell us briefly what matters",
    pm_intro_hint:'e.g. “I want anonymity, 3–4k/month, focus on subs & PayPal, DACH audience.”',
    pm_intro_ph:"Your priorities (anonymity, target revenue, platform prefs, region …)",
    pm_copy:"Copy link", pm_copied:"Copied!",
    pm_btn_cancel:"Cancel", pm_btn_analyze:"Analyze", pm_btn_back:"Back", pm_btn_close:"Close",
    pm_sliders_h:"Priorities (directly affect ranking)",
    s_anon:"Anonymity important",
    s_paypal:"Convenient payments (PayPal)",
    s_dach:"Focus DACH/DE",
    s_monetize:"Monetization over reach",
    hint_anon:"Higher = platforms with strong pseudonym/faceless support.",
    hint_paypal:"Higher = simple, discreet payment matters more.",
    hint_dach:"Higher = GDPR & German support more relevant.",
    hint_monetize:"Higher = subs/PPV matter more than pure reach.",
    pm_notice:"Note: Many German fans prefer PayPal due to simple, discreet payments.",
    pm_feat:"Features",
    pm_why_h:"Why MALOUM is the right recommendation",
    pm_why_p:"Based on your priorities:",
  }
};

/* ====== Layout helpers ====== */
const Section = ({ id, className = "", children }:{id?:string, className?:string, children:any}) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className}`}>{children}</section>
);

const Pill = ({ children }:{children:any}) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm bg-white/5 border-white/10 backdrop-blur">
    {children}
  </span>
);

/* ★ Stars */
const Stars = ({ rating = 5 }:{rating?:number}) => {
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

/* Fallback avatar (vector blur) */
const FaceBlur = ({ name = "Model" }:{name?:string}) => {
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

/* Realistic blurred avatar using Unsplash */
const AvatarReal = ({ name, src, blur = 6 }:{name:string, src?:string, blur?:number}) => {
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

/* Slider */
const Slider = ({ label, value, onChange, hint }:{label:string, value:number, onChange:(v:number)=>void, hint?:string}) => (
  <div>
    <div className="flex items-center justify-between">
      <label className="text-sm text-white/80">{label}</label>
      <span className="text-xs text-white/70 px-2 py-0.5 rounded bg-white/5 border border-white/10">{value}/10</span>
    </div>
    {hint && <div className="text-[11px] text-white/50 mt-0.5">{hint}</div>}
    <input
      type="range" min={0} max={10} step={1}
      value={value}
      onChange={(e)=>onChange(parseInt(e.target.value,10))}
      className="w-full mt-2 accent-white"
    />
  </div>
);

/* ====== Page ====== */
export default function Page() {
  const reduce = useReducedMotion();
  const [lang, setLang] = useState<Lang>("de");
  const t = I18N[lang];

  /* ==== Plattform Match – State & Logik ==== */
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchStep, setMatchStep] = useState<1|2>(1);  // 1=Fragen, 2=Ergebnis
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{name:string, raw:number, score:number}[]|null>(null);
  const [matchContext, setMatchContext] = useState<any>(null);
  const [copied, setCopied] = useState(false); // Feedback für Link kopieren

  // Body scroll lock when modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (matchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [matchOpen]);

  const [pcForm, setPcForm] = useState<any>({
    focus: "soft",         // soft | erotik | explicit
    anon: false,
    goal: "subs",          // subs | ppv | discover
    region: "global",      // global | dach | us
    payout: "paypal",      // paypal | fast | highcut
    intro: "",
    // Prioritäten (Balken 0..10)
    weightAnon: 6,
    weightPaypal: 6,
    weightDACH: 5,
    weightMonetize: 7,
  });

  // Hash open (#plattform-match)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#plattform-match") {
      setMatchOpen(true);
      setMatchStep(1);
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (matchOpen) {
      if (window.location.hash !== "#plattform-match") history.pushState(null, "", "#plattform-match");
    } else {
      if (window.location.hash === "#plattform-match") history.pushState(null, "", " ");
    }
  }, [matchOpen]);

  function inferFromIntro(text:string) {
    const t = (text || "").toLowerCase();
    const u:any = {};
    if (/anonym|ohne gesicht|diskret/.test(t)) { u.anon = true; u.weightAnon = Math.max(7, pcForm.weightAnon); }
    if (/abo|subscription|subs/.test(t))       { u.goal = "subs"; u.weightMonetize = Math.max(7, pcForm.weightMonetize); }
    if (/(ppv|dm|direct|nachricht|pay per view|upsell)/.test(t)) { u.goal = "ppv"; u.weightMonetize = Math.max(7, pcForm.weightMonetize); }
    if (/\bde\b|deutsch|german|dach/.test(t))  { u.region = "dach"; u.weightDACH = Math.max(7, pcForm.weightDACH); }
    if (/\bus\b|usa/.test(t)) { u.region = "us"; }
    if (/paypal/.test(t)) { u.payout = "paypal"; u.weightPaypal = Math.max(7, pcForm.weightPaypal); }
    return u;
  }

  // scale helper (0..10 weight, 5 neutral)
  const scaleBy = (w:number) => (v:number) => v * (w / 5);

  // normalize 0..10
  function normalizeScores(arr:{name:string, raw:number}[]) {
    const vals = arr.map(a=>a.raw);
    const min = Math.min(...vals), max = Math.max(...vals);
    if (max - min < 1e-6) return arr.map(a => ({...a, score: 5.0}));
    return arr.map(a => ({...a, score: +(10 * (a.raw - min) / (max - min)).toFixed(1)}));
  }

  function computePlatformScores(f:any) {
    const w = {
      anon: f.weightAnon ?? 5,
      paypal: f.weightPaypal ?? 5,
      dach: f.weightDACH ?? 5,
      monetize: f.weightMonetize ?? 5,
    };
    const S_anon = scaleBy(w.anon);
    const S_pay  = scaleBy(w.paypal);
    const S_dach = scaleBy(w.dach);
    const S_mon  = scaleBy(w.monetize);
    const S_reach= scaleBy(10 - w.monetize); // Gegenpol

    const s:any = { MALOUM: 3, OnlyFans: 0, Fansly: 1, Fanvue: 0, ManyVids: 0 };

    // Content focus
    if (f.focus === "soft")     { s.MALOUM += 2; s.Fansly += 1; }
    if (f.focus === "erotik")   { s.MALOUM += 2; s.OnlyFans += 2; s.Fansly += 1; }
    if (f.focus === "explicit") { s.OnlyFans += 3; s.ManyVids += 2; s.MALOUM += 1; }

    // Anonymity
    if (f.anon) { s.MALOUM += S_anon(3); s.Fansly += S_anon(1); }

    // Goals
    if (f.goal === "subs")     { s.MALOUM += S_mon(2); s.OnlyFans += S_mon(2); s.Fansly += S_mon(2); }
    if (f.goal === "ppv")      { s.OnlyFans += S_mon(3); s.MALOUM += S_mon(2); s.ManyVids += S_mon(1); }
    if (f.goal === "discover") { s.MALOUM += S_reach(1.5); s.Fansly += S_reach(2); }

    // Region
    if (f.region === "dach")   { s.MALOUM += S_dach(2); }
    if (f.region === "us")     { s.OnlyFans += 2; s.Fansly += 1; }
    if (f.region === "global") { s.MALOUM += 1; s.OnlyFans += 1; s.Fansly += 1; }

    // Payout
    if (f.payout === "paypal") { s.MALOUM += S_pay(2); s.OnlyFans += S_pay(2); s.Fansly += S_pay(2); s.Fanvue += S_pay(1); s.ManyVids += S_pay(1); }
    if (f.payout === "fast")   { s.MALOUM += 1; s.OnlyFans += 1; s.Fanvue += 1; }
    if (f.payout === "highcut"){ s.Fanvue += 1; s.ManyVids += 1; }

    s.MALOUM += 0.2; // tiebreaker

    const raw = Object.entries(s).map(([name, raw]) => ({ name, raw: raw as number }));
    const norm = normalizeScores(raw);
    norm.sort((a,b)=>b.raw - a.raw);
    return norm;
  }

  function submitPlatformMatch(e?:React.FormEvent) {
    e?.preventDefault?.();
    const inferred = inferFromIntro(pcForm.intro);
    const merged = { ...pcForm, ...inferred };
    setMatchContext(merged);
    setMatchLoading(true);
    setMatchStep(1);
    setTimeout(() => {
      const ranking = computePlatformScores(merged);
      setMatchResult(ranking);
      setMatchLoading(false);
      setMatchStep(2);
    }, 900);
  }

  function copyShareLink() {
    try {
      if (typeof window === "undefined") return;
      if (window.location.hash !== "#plattform-match") {
        history.pushState(null, "", "#plattform-match");
      }
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(()=>setCopied(false), 1500);
    } catch {}
  }

  const FEATURES = [
    { key:"anon",    label:"Anonymität / Anonymity" },
    { key:"ppv",     label:"Abos & PPV / Subs & PPV" },
    { key:"live",    label:"Live-Streams" },
    { key:"fast",    label:"Schnelle Auszahlung / Fast payout" },
    { key:"paypal",  label:"PayPal" },
    { key:"privacy", label:"DSGVO / Privacy" },
    { key:"de",      label:"DE-Support" }
  ];
  const PROFILE:any = {
    MALOUM:   { anon:true,  ppv:true, live:false, fast:true,  paypal:true,  privacy:true, de:true  },
    OnlyFans: { anon:false, ppv:true, live:true,  fast:true,  paypal:true,  privacy:true, de:false },
    Fansly:   { anon:true,  ppv:true, live:true,  fast:true,  paypal:true,  privacy:true, de:false },
    Fanvue:   { anon:false, ppv:true, live:false, fast:true,  paypal:true,  privacy:true, de:false },
    ManyVids: { anon:false, ppv:true, live:false, fast:false, paypal:true,  privacy:true, de:false }
  };
  const IconCell = ({v}:{v:boolean|null|undefined}) => v === true
    ? <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="size-4" />Ja</span>
    : v === false
      ? <span className="inline-flex items-center gap-1 text-rose-400"><X className="size-4" />Nein</span>
      : <span className="inline-flex items-center gap-1 text-white/70"><Minus className="size-4" />Teilweise</span>;

  // Progress UI
  const progressLabel = matchLoading ? t.pm_progress_loading : (matchStep === 1 ? t.pm_progress_1 : t.pm_progress_2);
  const progressWidth = matchLoading ? "75%" : (matchStep === 1 ? "50%" : "100%");

  /* Testimonials – 9x MALOUM */
  const TESTIMONIALS = [
    { name: "Hannah L.", role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Wöchentliche To-dos, klare Preise, DM-Templates – endlich Struktur.", text_en:"Weekly to-dos, clear pricing, DM templates — finally structure." },
    { name: "Mia K.",    role: "Fansly", rating: 4, img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Diskret & fair. In 8 Wochen auf planbare 4-stellige Umsätze.", text_en:"Discreet & fair. Reached predictable 4-figure revenue in 8 weeks." },
    { name: "Lea S.",    role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Abo-Bundles + PPV-Plan = weniger Stress, mehr Cashflow.", text_en:"Sub bundles + PPV plan = less stress, more cashflow." },
    { name: "Nora P.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Anonym bleiben & wachsen – die KI-Workflows sind Gold wert.", text_en:"Stay anonymous & grow — the AI workflows are gold." },
    { name: "Julia M.",  role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Promo-Slots & Pricing-Tests haben meine Konversion verdoppelt.", text_en:"Promo slots & pricing tests doubled my conversion." },
    { name: "Alina R.",  role: "Fansly", rating: 4, img: "https://images.unsplash.com/photo-1549351512-c5e12b12bda4?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Ehrlich, respektvoll, transparent. Genau so stelle ich mir’s vor.", text_en:"Honest, respectful, transparent. Exactly what I want." },
    { name: "Emma T.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Endlich KPIs, die Sinn machen – und ein 90-Tage-Plan.", text_en:"Finally KPIs that make sense — and a 90-day plan." },
    { name: "Sofia W.",  role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Persona, Content-Cadence, DM-Skripte – passt zu meinem Alltag.", text_en:"Persona, cadence, DM scripts — fits my routine." },
    { name: "Lara B.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Weniger Posten, mehr Wirkung. Funnels statt Zufall.", text_en:"Post less, impact more. Funnels over randomness." },
    { name: "Zoe F.",    role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Check-ins halten mich accountable. Wachstum ist messbar.", text_en:"Check-ins keep me accountable. Growth is measurable." },
    { name: "Paula D.",  role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"Faire Splits & echte Hilfe. Kein leeres Agentur-Blabla.", text_en:"Fair splits & real help. No empty agency talk." },
    { name: "Kim A.",    role: "OnlyFans", rating: 4, img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text_de:"PayPal-Fokus für DE-Fans war der Gamechanger.", text_en:"PayPal focus for DE fans was the game changer." },
  ];

  return (
    <>
      {/* background glow */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-3xl opacity-30"
             style={{ background: `radial-gradient(circle at 50% 50%, ${ACCENT}55, transparent 60%)` }} />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
             style={{ background: `radial-gradient(circle at 50% 50%, #6a00ff55, transparent 60%)` }} />
      </div>

      {/* NAV */}
      <Section className="py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg grid place-items-center font-bold" style={{ background: ACCENT }}>CB</div>
            <span className="font-semibold tracking-tight">Creator-Base</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">Agency</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">18+</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#vorteile" className="hover:text-white">{t.nav.vorteile}</a>
            <a href="#leistungen" className="hover:text-white">{t.nav.leistungen}</a>
            <a href="#prozess" className="hover:text-white">{t.nav.prozess}</a>
            <a href="#referenzen" className="hover:text-white">{t.nav.referenzen}</a>
            <a href="#vergleich" className="hover:text-white">{t.nav.vergleich}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={()=>setLang(l=>l==="de"?"en":"de")}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20"
              title="Language">
              <Languages className="size-4" />
              <span className="text-xs">{lang==="de"?"EN":"DE"}</span>
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
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.001 : 0.5 }}
          >
            <Pill><Sparkles className="size-4" /><span>{t.hero.pill}</span></Pill>
            <div className="mt-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                {t.hero.h1_a}{" "}
                <span className="rounded px-2 -mx-1 ring-1 ring-white/10"
                      style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.45)` }}>{t.hero.h1_b}</span>{" "}
                {t.hero.h1_c}
              </h1>
              <p className="mt-4 text-white/80 text-base md:text-lg max-w-prose">{t.hero.sub}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#kontakt" className="gap-2 px-5 py-3 rounded-xl inline-flex items-center" style={{ background: ACCENT }}>
                {t.hero.cta_call} <ArrowRight className="size-5" />
              </a>
              <button
                type="button"
                onClick={() => { setMatchOpen(true); setMatchStep(1); setMatchResult(null); setMatchLoading(false); }}
                className="relative px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              >
                {t.hero.cta_match}
                <span className="absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{ background: ACCENT + "26", color: ACCENT }}>
                  {t.hero.new}
                </span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/70">
              {(t.trust as string[]).map((txt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" style={{ color: ACCENT }} />
                  <span>{txt}</span>
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
                  <span className="ml-3 text-white/60">Creator Dashboard — 90 Tage</span>
                </div>
                <span className="inline-flex items-center gap-1"><LineChart className="size-3" /> +38% / 30T</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60">Monatsumsatz</div>
                    <div className="mt-1 text-lg font-semibold">€12.4k</div>
                    <div className="text-[10px] text-emerald-400">+18% WoW</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60">Neue Subs</div>
                    <div className="mt-1 text-lg font-semibold">+427</div>
                    <div className="text-[10px] text-emerald-400">+22% WoW</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60">PPV Umsatz</div>
                    <div className="mt-1 text-lg font-semibold">€6.8k</div>
                    <div className="text-[10px] text-emerald-400">+31% WoW</div>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white/5 p-2.5">
                  <svg viewBox="0 0 300 100" className="w-full h-24 md:h-28" role="img" aria-label="Umsatzentwicklung">
                    <polyline points="0,80 50,70 100,72 150,65 200,60 250,58 300,50" fill="none" stroke="#ffffff33" strokeWidth="2" />
                    <polyline points="0,85 40,78 80,75 120,68 160,62 200,55 240,45 300,40" fill="none" stroke={ACCENT} strokeWidth="3" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* VORTEILE */}
      <Section id="vorteile" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.vorteile_h}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.vorteile_p}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">
                  {t.exklusive}
                  <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                    {t.exklusiv}
                  </span>
                </p>
                <p className="text-white/75 text-sm">Bessere Konditionen, Promo-Slots & Early-Access-Features.</p>
              </div>
            </li>
            {t.v_items.slice(0,2).map(([h, p]:any, i:number)=>(
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div><p className="font-semibold">{h}</p><p className="text-white/75 text-sm">{p}</p></div>
              </li>
            ))}
          </ul>
          <ul className="space-y-4">
            {t.v_items.slice(2).map(([h, p]:any, i:number)=>(
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div><p className="font-semibold">{h}</p><p className="text-white/75 text-sm">{p}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* LEISTUNGEN */}
      <Section id="leistungen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.leistungen_h}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.leistungen_p}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {t.l_cards.map(([h, p]:any, i:number)=>(
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
                {[LineChart, Users, ShieldCheck, ShieldCheck, Handshake, EyeOff][i % 6]({ className:"size-5", style:{ color: ACCENT } } as any)}
              </div>
              <h3 className="font-semibold mb-1">{h}</h3>
              <p className="text-sm text-white/80">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PROZESS */}
      <Section id="prozess" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.prozess_h}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.prozess_p}</p>

        <div className="relative">
          <motion.div aria-hidden className="absolute top-0 w-[2px] bg-white/15 left-2 sm:left-3"
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.2 }}
            style={{ transformOrigin: "top" }} transition={{ duration: reduce ? 0 : 0.8 }} />
          <ol className="relative pl-6 sm:pl-8 space-y-8">
            {t.steps.map(([title, text]:any, i:number) => (
              <motion.li key={title} initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduce ? 0.001 : 0.4, delay: reduce ? 0 : i * 0.05 }} className="relative">
                <span className="absolute -left-[3px] top-1 size-3 rounded-full" style={{ background: ACCENT }} />
                <div className="flex items-center gap-2 mb-1">
                  {[PhoneCall, Users, ClipboardList, Target, Rocket, Handshake][i]({ className:"size-4", style:{ color: ACCENT } } as any)}
                  <h4 className="font-semibold">{title}</h4>
                </div>
                <p className="text-white/75 text-sm">{text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      {/* REFERENZEN */}
      <Section id="referenzen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.refs_h}</h2>
        <p className="text-white/75 max-w-2xl mb-6">{t.refs_p}</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((tt, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <AvatarReal name={tt.name} src={tt.img} />
                <div>
                  <div className="font-semibold">{tt.name}</div>
                  <div className="text-xs text-white/60">{tt.role}</div>
                </div>
                <Stars rating={tt.rating} />
              </div>
              <p className="mt-3 text-white/80 text-sm">“{lang==="de" ? tt.text_de : tt.text_en}”</p>
            </div>
          ))}
        </div>
      </Section>

      {/* VERGLEICH */}
      <Section id="vergleich" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t.vergleich_h}</h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm md:text-base border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-white/70">
                <th className="py-3 px-4">Kriterium / Criterion</th>
                <th className="py-3 px-4">Creator-Base</th>
                <th className="py-3 px-4">Andere / Others</th>
              </tr>
            </thead>
            <tbody>
              {t.vergleich_rows.map(([k,a,b]:any, i:number)=>(
                <tr key={i} className="align-top">
                  <td className="py-3 px-4 text-white/80">{k}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-1 size-4" style={{ color: ACCENT }} />
                      <span className="text-white">{a}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/60">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* KONTAKT */}
      <Section id="kontakt" className="py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{t.kontakt_h}</h2>
            <p className="mt-2 text-white/75 max-w-prose">{t.kontakt_p}</p>
            <ul className="mt-5 space-y-2 text-white/75 text-sm">
              {t.kontakt_bullets.map((b:string,i:number)=>(
                <li key={i} className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> {b}</li>
              ))}
            </ul>
          </div>

          <form action="https://api.web3forms.com/submit" method="POST"
                className="p-6 rounded-2xl border bg-white/5 border-white/10 backdrop-blur">
            <input type="hidden" name="access_key" value="a4174bd0-9c62-4f19-aa22-5c22a03e8da2" />
            <input type="hidden" name="subject" value="Neue Anfrage – Creator-Base" />
            <input type="hidden" name="from_name" value="Creator-Base Website" />
            <input type="hidden" name="replyto" value="email" />
            <input type="hidden" name="redirect" value="https://www.creator-base.com/danke" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            <div className="grid gap-4">
              <div>
                <label className="text-sm text-white/80">{lang==="de"?"Dein Name":"Your name"}</label>
                <input name="name" required placeholder={lang==="de"?"Vor- und Nachname":"Full name"}
                       className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">E-Mail</label>
                <input type="email" name="email" required placeholder="name@mail.com"
                       className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">{lang==="de"?"Kurz zu dir":"Tell us a bit"}</label>
                <textarea name="message" rows={4}
                          placeholder={lang==="de"?"Wo stehst du? Welche Ziele hast du?":"Where are you now? Your goals?"}
                          className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded" style={{ background: ACCENT }}>
                {t.kontakt_send}
              </button>
            </div>
          </form>
        </div>
      </Section>

      {/* ==== Plattform Match Modal ==== */}
      {matchOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setMatchOpen(false)} />
          {/* Scroll-Container */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="min-h-full flex items-start md:items-center justify-center p-4">
              <div className="mx-4 md:mx-0 rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl overflow-hidden w-full md:w-[880px] max-h-[calc(100dvh-2rem)] flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/60">Creator-Base</div>
                    <div className="text-lg font-semibold">{t.pm_title}</div>
                  </div>
                  <button onClick={()=>setMatchOpen(false)} className="text-white/70 hover:text-white flex items-center gap-1">
                    <XCircle className="size-5" /> {t.pm_btn_close}
                  </button>
                </div>

                {/* Progress */}
                <div className="px-5 py-2">
                  <div className="h-1 w-full bg-white/10 rounded">
                    <div className="h-1 rounded" style={{ width: progressWidth, background:ACCENT }} />
                  </div>
                  <div className="mt-2 text-xs text-white/60">{progressLabel}</div>
                </div>

                {/* Content area (scrollable) */}
                <div className="px-5 pb-24 overflow-y-auto">
                  {/* STEP 1 (Form) */}
                  {matchStep === 1 && !matchLoading && (
                    <form onSubmit={submitPlatformMatch} className="grid gap-4">
                      {/* Intro */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-white/60">KI-gestützt / AI-assisted</div>
                        <div className="text-lg font-semibold mt-1">{t.pm_intro_title}</div>
                        <p className="text-white/70 text-sm mt-1">{t.pm_intro_hint}</p>
                        <textarea
                          value={pcForm.intro}
                          onChange={(e)=>setPcForm((v:any)=>({...v, intro:e.target.value}))}
                          rows={3}
                          placeholder={t.pm_intro_ph}
                          className="w-full mt-3 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>

                      {/* Short selects */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/80">{lang==="de"?"Content-Fokus":"Content focus"}</label>
                          <select value={pcForm.focus} onChange={e=>setPcForm((v:any)=>({...v, focus:e.target.value}))}
                                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="soft">{lang==="de"?"Soft / Teasing":"Soft / teasing"}</option>
                            <option value="erotik">{lang==="de"?"Erotik":"Erotic"}</option>
                            <option value="explicit">{lang==="de"?"Explizit":"Explicit"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{lang==="de"?"Anonym bleiben?":"Stay anonymous?"}</label>
                          <select value={pcForm.anon?'yes':'no'} onChange={e=>setPcForm((v:any)=>({...v, anon:e.target.value==='yes'}))}
                                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="no">{lang==="de"?"Nein":"No"}</option>
                            <option value="yes">{lang==="de"?"Ja":"Yes"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{lang==="de"?"Primäres Ziel":"Primary goal"}</label>
                          <select value={pcForm.goal} onChange={e=>setPcForm((v:any)=>({...v, goal:e.target.value}))}
                                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="subs">{lang==="de"?"Abos / Stammkundschaft":"Subscriptions / retention"}</option>
                            <option value="ppv">PPV & DMs</option>
                            <option value="discover">{lang==="de"?"Reichweite":"Reach/discovery"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{lang==="de"?"Ziel-Region":"Target region"}</label>
                          <select value={pcForm.region} onChange={e=>setPcForm((v:any)=>({...v, region:e.target.value}))}
                                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="global">Global</option>
                            <option value="dach">DACH</option>
                            <option value="us">USA</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{lang==="de"?"Zahlungen":"Payments"}</label>
                          <select value={pcForm.payout} onChange={e=>setPcForm((v:any)=>({...v, payout:e.target.value}))}
                                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="paypal">PayPal</option>
                            <option value="fast">{lang==="de"?"Schnelle Auszahlung":"Fast payout"}</option>
                            <option value="highcut">{lang==="de"?"Hoher %-Anteil":"High revenue share"}</option>
                          </select>
                        </div>
                      </div>

                      {/* Sliders */}
                      <div className="mt-2 rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="font-semibold mb-3">{t.pm_sliders_h}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Slider label={t.s_anon} value={pcForm.weightAnon} onChange={(v)=>setPcForm((x:any)=>({...x, weightAnon:v}))} hint={t.hint_anon}/>
                          <Slider label={t.s_paypal} value={pcForm.weightPaypal} onChange={(v)=>setPcForm((x:any)=>({...x, weightPaypal:v}))} hint={t.hint_paypal}/>
                          <Slider label={t.s_dach} value={pcForm.weightDACH} onChange={(v)=>setPcForm((x:any)=>({...x, weightDACH:v}))} hint={t.hint_dach}/>
                          <Slider label={t.s_monetize} value={pcForm.weightMonetize} onChange={(v)=>setPcForm((x:any)=>({...x, weightMonetize:v}))} hint={t.hint_monetize}/>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Loading */}
                  {matchStep === 1 && matchLoading && (
                    <div className="py-14 flex flex-col items-center text-center gap-3">
                      <div className="h-10 w-10 rounded-full border-2 border-white/20 animate-spin" style={{ borderTopColor: ACCENT }} aria-label="KI denkt…" />
                      <div className="text-white/80 font-medium">{t.pm_progress_loading}</div>
                      <div className="text-white/60 text-sm">{lang==="de"?"Analysiert deine Prioritäten und erstellt das Ranking.":"Analysing your priorities and building the ranking."}</div>
                    </div>
                  )}

                  {/* STEP 2 – Result */}
                  {matchStep === 2 && matchResult && (
                    <div className="pb-4">
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">{t.pm_notice}</div>

                      {/* Top recommendations */}
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {matchResult.slice(0,3).map((p)=>(
                          <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xl font-semibold">{p.name}</div>
                                <div className="text-white/70 text-sm">Score {p.score.toFixed(1)}/10</div>
                              </div>
                              {p.name === "MALOUM" && (
                                <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                                  {lang==="de"?"Unsere Empfehlung":"Our pick"}
                                </span>
                              )}
                            </div>
                            {/* score bar */}
                            <div className="mt-3 h-2 w-full bg-white/10 rounded">
                              <div className="h-2 rounded" style={{ width: `${p.score*10}%`, background: ACCENT }} />
                            </div>

                            <div className="mt-3">
                              <div className="text-white/70 text-sm mb-1">{t.pm_feat}</div>
                              <ul className="space-y-2">
                                {FEATURES.map(f => {
                                  const v = PROFILE[p.name]?.[f.key];
                                  return (
                                    <li key={f.key} className="flex items-center justify-between">
                                      <span className="text-white/80">{f.label}</span>
                                      <IconCell v={v} />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Why */}
                      <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="text-lg font-semibold">{t.pm_why_h}</div>
                        <div className="text-white/70 text-sm">{t.pm_why_p}</div>
                        <ul className="mt-3 space-y-2 text-white/90">
                          {(() => {
                            const r:string[] = [];
                            if (!matchContext) return null;
                            if (matchContext.anon) r.push(lang==="de"
                              ? "Du willst anonym bleiben – MALOUM unterstützt Hybrid-Modelle & Pseudonyme sehr gut."
                              : "You want anonymity — MALOUM supports hybrid/faceless models very well.");
                            if (matchContext.goal === "subs" || matchContext.goal === "ppv") r.push(lang==="de"
                              ? "Fokus auf Abos & PPV – planbare Bundles und stabile Monetarisierung."
                              : "Focus on subs & PPV — predictable bundles and steady monetization.");
                            if (matchContext.payout === "paypal" || matchContext.region === "dach") r.push(lang==="de"
                              ? "Auszahlungen via PayPal – schnell & unkompliziert (beliebt bei DE-Fans)."
                              : "PayPal payouts — quick & convenient (popular with DE fans).");
                            if (matchContext.region === "dach") r.push(lang==="de"
                              ? "Datenschutz & Support – DSGVO-orientierte Prozesse, DE-Support."
                              : "Privacy & support — GDPR-oriented processes and German support.");
                            if (r.length === 0) r.push(lang==="de"
                              ? "Solider Allround-Fit für planbares Wachstum und saubere Prozesse."
                              : "A solid all-round fit for predictable growth and clean processes.");
                            return r.map((txt, i) => <li key={i}>• {txt}</li>);
                          })()}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky action bar (mobile friendly). Hide during loading. */}
                {!matchLoading && (
                  <div className="sticky bottom-0 left-0 right-0 bg-[#0f0f14] border-t border-white/10 px-5 py-3 flex items-center justify-between gap-2">
                    {matchStep === 1 ? (
                      <>
                        <button onClick={copyShareLink}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/10 border border-white/20 hover:bg-white/20 text-sm">
                          <Link2 className="size-4" /> {copied ? t.pm_copied : t.pm_copy}
                        </button>
                        <div className="ml-auto flex items-center gap-2">
                          <button onClick={()=>setMatchOpen(false)}
                                  className="px-4 py-2 rounded bg-white/10 border border-white/20">{t.pm_btn_cancel}</button>
                          <button onClick={submitPlatformMatch}
                                  className="px-4 py-2 rounded" style={{ background: ACCENT }}>{t.pm_btn_analyze} <ChevronRight className="inline size-4" /></button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-white/50">{lang==="de"?"Ergebnis basiert auf deinen Prioritäten.":"Result based on your priorities."}</div>
                        <div className="ml-auto flex items-center gap-2">
                          <button onClick={()=>{ setMatchStep(1); setMatchLoading(false); }}
                                  className="px-4 py-2 rounded bg-white/10 border border-white/20">{t.pm_btn_back}</button>
                          <button onClick={()=>setMatchOpen(false)}
                                  className="px-4 py-2 rounded bg-white/10 border border-white/20">{t.pm_btn_close}</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
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
            <span>© {new Date().getFullYear()} Creator-Base</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#">{t.footer_impressum}</a>
            <a href="#">{t.footer_privacy}</a>
            <a href="#">{t.footer_agb}</a>
          </div>
        </div>
      </Section>
    </>
  );
}
