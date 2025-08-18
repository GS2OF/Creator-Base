"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff,
  Check, X, Minus, ChevronRight, XCircle, Copy
} from "lucide-react";

/* ==== Theme ==== */
const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

/* ==== Layout Helpers ==== */
const Section = ({ id, className = "", children }: any) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className}`}>{children}</section>
);

const Pill = ({ children }: any) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm bg-white/5 border-white/10 backdrop-blur">
    {children}
  </span>
);

/* ==== Stars (4/5 & 5/5) ==== */
const Stars = ({ rating = 5 }: { rating?: number }) => {
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

/* ==== Avatar: realistisch + blur, Fallback Silhouette ==== */
const FaceBlur = ({ name = "Model" }: { name?: string }) => {
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

const AvatarReal = ({ name, src, blur = 6 }: { name: string; src?: string; blur?: number }) => {
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

/* =========================================================================================
   Platform Match v2 –  Sliders, Advanced, Fair Scoring, DE/EN, Deep-Link
   ========================================================================================= */

type Lang = "de" | "en";

/* i18n strings */
const I18N: Record<Lang, any> = {
  de: {
    title: "Plattform Match",
    stepLabel1: "Schritt 1/2: Prioritäten",
    stepLabel2: "Schritt 2/2: Ergebnis",
    thinking: "KI analysiert deine Angaben…",
    copyLink: "Link kopieren",
    copied: "Kopiert!",
    evaluate: "Auswerten",
    back: "Zurück",
    close: "Schließen",
    hintPaypal: "Viele DACH-Fans zahlen gern per PayPal.",
    sliders: {
      anon: { label: "Anonymität", left: "Pseudonym & Blur", right: "Gesicht ok", hint: "Wie wichtig ist Anonymität?" },
      paypal: { label: "Friktionsarme Zahlungen (PayPal)", left: "Sehr wichtig", right: "Egal", hint: "Weniger Hürden = mehr Käufe." },
      dach: { label: "DACH-Fokus / DE-Support", left: "Wichtig", right: "Global/US ok", hint: "Deutsch & DSGVO gewünscht?" },
      monetize: { label: "Monetarisierung vs. Reichweite", left: "Subs/PPV jetzt", right: "Erst Discovery", hint: "Schnelle Umsätze oder Reichweite?" },
      policy: { label: "Policy-Risiko", left: "Strikt/low risk", right: "Mehr Freiheit ok", hint: "Wie restriktiv soll es sein?" },
      ux: { label: "Bedienbarkeit & Support", left: "Einfach + Support", right: "Pro-Features (Self)", hint: "Wie wichtig ist Einfachheit?" }
    },
    advTitle: "Erweiterte Optionen",
    adv: {
      payout: { label: "Payout-Speed", left: "Wichtig", right: "Egal" },
      dm: { label: "DM-Automation", left: "Sehr wichtig", right: "Unwichtig" },
      paywall: { label: "Paywall-Flex", left: "Bundles/Trials", right: "Standard reicht" },
      links: { label: "Externe Links / Funnel", left: "Wichtig", right: "Egal" },
      chargeback: { label: "Chargeback-Schutz", left: "Sehr wichtig", right: "Egal" },
      analytics: { label: "Analytics-Tiefe", left: "Deep/Cohorts", right: "Basic ok" },
      kyc: { label: "KYC-Hürde", left: "Niedrig", right: "Egal" },
      live: { label: "Live-Streaming", left: "Wichtig", right: "Unwichtig" }
    },
    results: {
      top3: "Top-Empfehlungen",
      whyFit: "Warum passt diese Plattform zu dir?",
      headsUp: "Hinweis",
      headsUpText: "Viele deutsche Fans bevorzugen PayPal – einfache, diskrete Zahlung.",
      chips: {
        dachPayPal: "DACH/PayPal Fit",
        anon: "Anonym möglich",
        subsPpv: "Abo/PPV stark",
        lowRisk: "Niedr. Policy-Risiko",
        easyStart: "Einfacher Start",
        dmAuto: "DM-Automationen",
        fastPayouts: "Schnelle Auszahlungen",
        analytics: "Analytics pro",
        funnel: "Funnel-freundlich",
        paywall: "Paywall-Flex"
      }
    },
    platformBadge: "Unsere Empfehlung"
  },
  en: {
    title: "Platform Match",
    stepLabel1: "Step 1/2: Priorities",
    stepLabel2: "Step 2/2: Results",
    thinking: "Our AI is thinking…",
    copyLink: "Copy link",
    copied: "Copied!",
    evaluate: "Evaluate",
    back: "Back",
    close: "Close",
    hintPaypal: "Many DACH fans prefer PayPal.",
    sliders: {
      anon: { label: "Anonymity", left: "Pseudonym & blur", right: "Face okay", hint: "How important is anonymity?" },
      paypal: { label: "Low-friction payments (PayPal)", left: "Very important", right: "Doesn't matter", hint: "Fewer hurdles = more buys." },
      dach: { label: "DACH focus / German support", left: "Important", right: "Global/US ok", hint: "German & GDPR preferred?" },
      monetize: { label: "Monetization vs. Discovery", left: "Subs/PPV now", right: "Discovery first", hint: "Fast revenue or reach first?" },
      policy: { label: "Policy risk", left: "Strict/low risk", right: "More freedom ok", hint: "How strict do you want it?" },
      ux: { label: "Ease of use & support", left: "Simple + support", right: "Pro features (self)", hint: "How important is simplicity?" }
    },
    advTitle: "Advanced options",
    adv: {
      payout: { label: "Payout speed", left: "Important", right: "Doesn't matter" },
      dm: { label: "DM automation", left: "Very important", right: "Unimportant" },
      paywall: { label: "Paywall flexibility", left: "Bundles/trials", right: "Standard is fine" },
      links: { label: "External links / funnel", left: "Important", right: "Doesn't matter" },
      chargeback: { label: "Chargeback protection", left: "Very important", right: "Doesn't matter" },
      analytics: { label: "Analytics depth", left: "Deep/cohorts", right: "Basic ok" },
      kyc: { label: "KYC hurdles", left: "Low", right: "Doesn't matter" },
      live: { label: "Live streaming", left: "Important", right: "Unimportant" }
    },
    results: {
      top3: "Top recommendations",
      whyFit: "Why this platform fits you",
      headsUp: "Heads-up",
      headsUpText: "Many German fans prefer PayPal – easy and discreet.",
      chips: {
        dachPayPal: "DACH & PayPal fit",
        anon: "Anon friendly",
        subsPpv: "Subs/PPV strong",
        lowRisk: "Low policy risk",
        easyStart: "Easy start",
        dmAuto: "DM automations",
        fastPayouts: "Fast payouts",
        analytics: "Analytics depth",
        funnel: "Funnel-friendly",
        paywall: "Paywall flexibility"
      }
    },
    platformBadge: "Our pick"
  }
};

/* Slider Component */
function Slider({
  label, left, right, hint, value, onChange
}: { label: string; left: string; right: string; hint?: string; value: number; onChange: (v: number) => void; }) {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">{label}</div>
        <div className="text-xs text-white/60">{Math.round(pct)}</div>
      </div>
      {hint && <div className="text-xs text-white/50 mt-0.5">{hint}</div>}
      <div className="mt-2">
        <input
          type="range" min={0} max={100} value={pct}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(90deg, ${ACCENT} ${pct}%, #ffffff22 ${pct}%)`,
            height: 4, borderRadius: 999
          }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/60">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

/* Impact Chips */
const Chip = ({ children }: any) => (
  <span className="text-[11px] md:text-xs px-2 py-1 rounded-full border border-white/15 bg-white/5 text-white/80">{children}</span>
);

/* Weights (Einfluss) */
const WEIGHTS: Record<string, number> = {
  anon: 1.3,
  paypal: 1.2,
  dach: 1.2,
  monetize: 1.1,
  policy: 1.0,
  ux: 0.9,
  payout: 0.6,
  dm: 0.6,
  paywall: 0.5,
  links: 0.5,
  chargeback: 0.4,
  analytics: 0.4,
  kyc: 0.3,
  live: 0.0 // bewusst neutralisiert (kann später aktiviert werden)
};

/* Plattform-Profile (0..5) */
const PLATFORM: Record<string, Record<string, number>> = {
  MALOUM:   { anon:5, paypal:5, dach:5, monetize:4, policy:4, ux:4, payout:4, dm:4, paywall:4, links:4, chargeback:4, analytics:4, kyc:4, live:2 },
  OnlyFans: { anon:2, paypal:5, dach:3, monetize:5, policy:3, ux:4, payout:4, dm:4, paywall:5, links:3, chargeback:3, analytics:4, kyc:3, live:3 },
  Fansly:   { anon:4, paypal:5, dach:3, monetize:4, policy:3, ux:4, payout:4, dm:4, paywall:4, links:3, chargeback:3, analytics:3, kyc:3, live:4 },
  Fanvue:   { anon:2, paypal:4, dach:2, monetize:4, policy:3, ux:3, payout:4, dm:3, paywall:3, links:3, chargeback:3, analytics:3, kyc:3, live:2 },
  ManyVids: { anon:2, paypal:4, dach:2, monetize:3, policy:3, ux:3, payout:3, dm:3, paywall:3, links:3, chargeback:3, analytics:3, kyc:3, live:1 }
};

const ALL_KEYS = Object.keys(WEIGHTS);

/* Compute Score (0..10, fair) */
function computeScores(prefs: Record<string, number>) {
  const normUser: Record<string, number> = {};
  ALL_KEYS.forEach(k => { normUser[k] = Math.max(0, Math.min(1, (prefs[k] ?? 0) / 100)); });

  const theoreticalMax = ALL_KEYS.reduce((sum, k) => sum + WEIGHTS[k] * normUser[k] * 1, 0) || 1;

  const out = Object.entries(PLATFORM).map(([name, prof]) => {
    let raw = 0;
    ALL_KEYS.forEach(k => {
      const p = Math.max(0, Math.min(1, (prof[k] ?? 0) / 5));
      raw += WEIGHTS[k] * normUser[k] * p;
    });

    // DACH Soft-Boost
    const userDach = normUser.dach;
    const platDach = Math.max(0, Math.min(1, (prof.dach ?? 0) / 5));
    if (userDach >= 0.6 && platDach >= 0.6) raw *= 1.08;

    // Diminishing Returns Cap
    const capped = Math.min(raw, theoreticalMax * 0.9);

    const norm10 = 10 * (capped / theoreticalMax);
    return { name, score: norm10, raw: capped, max: theoreticalMax };
  });

  // Sort high to low
  out.sort((a, b) => b.score - a.score);

  // Diversity re-rank: bring MALOUM in if close to #3 (≤ 0.6)
  const malIndex = out.findIndex(p => p.name === "MALOUM");
  if (malIndex > 2) {
    const delta = out[2].score - out[malIndex].score;
    if (delta <= 0.6) {
      const mal = out.splice(malIndex, 1)[0];
      out.splice(2, 1, mal);
    }
  }

  return out;
}

/* Impact Chips generator */
function chipsFor(name: string, prefs: Record<string, number>, lang: Lang) {
  const t = I18N[lang].results.chips;
  const chips: string[] = [];
  const pf = PLATFORM[name];

  const high = (k: string, thr = 70) => (prefs[k] ?? 0) >= thr;
  const strong = (k: string, thr = 4) => (pf[k] ?? 0) >= thr;

  if (high("dach") && strong("dach") && strong("paypal")) chips.push(t.dachPayPal);
  if (high("anon") && strong("anon")) chips.push(t.anon);
  if (high("monetize") && strong("monetize")) chips.push(t.subsPpv);
  if (high("policy") && strong("policy")) chips.push(t.lowRisk);
  if (high("ux") && strong("ux")) chips.push(t.easyStart);
  if (high("dm") && strong("dm")) chips.push(t.dmAuto);
  if (high("payout") && strong("payout")) chips.push(t.fastPayouts);
  if (high("analytics") && strong("analytics")) chips.push(t.analytics);
  if (high("links") && strong("links")) chips.push(t.funnel);
  if (high("paywall") && strong("paywall")) chips.push(t.paywall);

  return chips.slice(0, 5);
}

/* Reasons generator (2–4 bullets) */
function reasonsFor(name: string, prefs: Record<string, number>, lang: Lang) {
  const pf = PLATFORM[name];
  const lines: string[] = [];
  const add = (de: string, en: string) => lines.push(lang === "de" ? de : en);

  if ((prefs.anon ?? 0) >= 60 && (pf.anon ?? 0) >= 4)
    add("Anonym bleiben ist dir wichtig – diese Plattform unterstützt das gut.",
        "Anonymity matters to you – this platform supports it well.");

  if ((prefs.paypal ?? 0) >= 60 && (pf.paypal ?? 0) >= 4)
    add("PayPal/geringe Hürden: höhere Kaufbereitschaft deiner Fans.",
        "PayPal/low friction: higher purchase intent from fans.");

  if ((prefs.dach ?? 0) >= 60 && (pf.dach ?? 0) >= 4)
    add("DACH/DE-Support & DSGVO sind hier stark ausgeprägt.",
        "DACH/German support & GDPR are well covered.");

  if ((prefs.monetize ?? 0) >= 60 && (pf.monetize ?? 0) >= 4)
    add("Fokus auf Abos/PPV für planbare Umsätze.",
        "Focus on subs/PPV for predictable revenue.");

  if ((prefs.ux ?? 0) >= 60 && (pf.ux ?? 0) >= 4)
    add("Einfache Bedienung & schneller Support erleichtern den Alltag.",
        "Simple UX & fast support reduce overhead.");

  if (lines.length === 0)
    add("Solider Allround-Fit für deine Ziele.",
        "Solid all-round fit for your goals.");

  return lines.slice(0, 4);
}

/* Query helpers */
function prefsToQuery(prefs: Record<string, number>, lang: Lang) {
  const q = new URLSearchParams();
  q.set("match", "");
  q.set("v", "2");
  q.set("lang", lang);
  for (const k of ALL_KEYS) q.set(k, String(Math.round(prefs[k] ?? 0)));
  return q.toString().replace("=", ""); // keep ?match&v=2...
}

function readQuery(): { lang?: Lang; prefs?: Record<string, number> } {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  if (!sp.has("match")) return {};
  const lang = (sp.get("lang") as Lang) || "de";
  const prefs: Record<string, number> = {};
  ALL_KEYS.forEach(k => { const v = Number(sp.get(k) ?? ""); if (!Number.isNaN(v)) prefs[k] = Math.max(0, Math.min(100, v)); });
  return { lang, prefs };
}

/* =========================================================================================
   Page
   ========================================================================================= */
export default function Page() {
  const reduce = useReducedMotion();

  /* ==== Modal State ==== */
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchStep, setMatchStep] = useState<1 | 2>(1);
  const [matchLoading, setMatchLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("de");

  // Lock body scroll when modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (matchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [matchOpen]);

  /* ==== Prefs (Sliders) ==== */
  const [prefs, setPrefs] = useState<Record<string, number>>({
    anon: 60, paypal: 80, dach: 75, monetize: 70, policy: 50, ux: 60,
    payout: 60, dm: 60, paywall: 60, links: 60, chargeback: 50, analytics: 50, kyc: 50, live: 0
  });

  // Hydrate from URL or localStorage
  useEffect(() => {
    const fromQ = readQuery();
    if (fromQ.lang) setLang(fromQ.lang);
    if (fromQ.prefs) { setPrefs(p => ({ ...p, ...fromQ.prefs })); }
    else {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("cb_match_v2_state");
        if (raw) {
          try { const saved = JSON.parse(raw); if (saved?.prefs) setPrefs((p) => ({ ...p, ...saved.prefs })); if (saved?.lang) setLang(saved.lang); } catch {}
        }
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("cb_match_v2_state", JSON.stringify({ prefs, lang }));
  }, [prefs, lang]);

  // Update URL on Step 1 changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!matchOpen || matchStep !== 1) return;
    const base = window.location.origin + window.location.pathname;
    const qs = prefsToQuery(prefs, lang);
    window.history.replaceState(null, "", `${base}?${qs}`);
  }, [prefs, lang, matchOpen, matchStep]);

  /* ==== Progress Bar ==== */
  const progressLabel = matchLoading
    ? I18N[lang].thinking
    : (matchStep === 1 ? I18N[lang].stepLabel1 : I18N[lang].stepLabel2);
  const progressWidth = matchLoading ? "75%" : (matchStep === 1 ? "50%" : "100%");

  /* ==== Evaluate ==== */
  const [result, setResult] = useState<{ name: string; score: number; chips: string[]; reasons: string[] }[] | null>(null);

  function onEvaluate(e?: React.FormEvent) {
    e?.preventDefault?.();
    setMatchLoading(true);
    setMatchStep(1);
    setTimeout(() => {
      const scores = computeScores(prefs);
      const enriched = scores.slice(0, 3).map(p => ({
        name: p.name,
        score: Math.round(p.score * 10) / 10,
        chips: chipsFor(p.name, prefs, lang),
        reasons: reasonsFor(p.name, prefs, lang)
      }));
      setResult(enriched);
      setMatchLoading(false);
      setMatchStep(2);
    }, 900);
  }

  /* =========================================================================================
     Testimonials (9x MALOUM, real avatars blurred, mixed 4/5 & 5/5)
     ========================================================================================= */
  const TESTIMONIALS = [
    { name: "Hannah L.", role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Wöchentliche To-dos, klare Preise, DM-Templates – endlich Struktur." },
    { name: "Mia K.",    role: "Fansly", rating: 4, img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Diskret & fair. In 8 Wochen auf planbare 4-stellige Umsätze." },
    { name: "Lea S.",    role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Abo-Bundles + PPV-Plan = weniger Stress, mehr Cashflow." },
    { name: "Nora P.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Anonym bleiben & wachsen – die KI-Workflows sind Gold wert." },
    { name: "Julia M.",  role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Promo-Slots & Pricing-Tests haben meine Konversion verdoppelt." },
    { name: "Alina R.",  role: "Fansly", rating: 4, img: "https://images.unsplash.com/photo-1549351512-c5e12b12bda4?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Ehrlich, respektvoll, transparent. Genau so stelle ich mir’s vor." },
    { name: "Emma T.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Endlich KPIs, die Sinn machen – und ein 90-Tage-Plan." },
    { name: "Sofia W.",  role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Persona, Content-Cadence, DM-Skripte – passt zu meinem Alltag." },
    { name: "Lara B.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Weniger Posten, mehr Wirkung. Funnels statt Zufall." },
    { name: "Zoe F.",    role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Check-ins halten mich accountable. Wachstum ist messbar." },
    { name: "Paula D.",  role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Faire Splits & echte Hilfe. Kein leeres Agentur-Blabla." },
    { name: "Kim A.",    role: "OnlyFans", rating: 4, img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "PayPal-Fokus für DE-Fans war der Gamechanger." }
  ];

  /* =========================================================================================
     UI
     ========================================================================================= */

  return (
    <>
      {/* Background Glow */}
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
            <span className="font-semibold tracking-tight">Creator-Base</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">Agency</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">18+</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#vorteile" className="hover:text-white">Vorteile</a>
            <a href="#leistungen" className="hover:text-white">Leistungen</a>
            <a href="#prozess" className="hover:text-white">Ablauf</a>
            <a href="#referenzen" className="hover:text-white">Referenzen</a>
            <a href="#vergleich" className="hover:text-white">Vergleich</a>
          </nav>
          <a href="#kontakt" className="hidden md:inline-flex rounded-lg px-4 py-2" style={{ background: ACCENT }}>
            Kostenloses Erstgespräch
          </a>
        </div>
      </Section>

      {/* HERO */}
      <Section className="pt-6 pb-10 md:pt-10 md:pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            <Pill><Sparkles className="size-4" /><span>Die Adult-Agentur für nachhaltiges Creator-Wachstum</span></Pill>

            <div className="mt-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                Wir bieten{" "}
                <span className="rounded px-2 -mx-1 ring-1 ring-white/10" style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.45)` }}>
                  Mehrwert
                </span>{" "}
                für deinen Content.
              </h1>
              <p className="mt-4 text-white/80 text-base md:text-lg max-w-prose">
                Mehr Subs, PPV & Tipps – mit Strategie, 1:1-Betreuung und fairen Splits. Du behältst die Kontrolle.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#kontakt" className="gap-2 px-5 py-3 rounded-xl inline-flex items-center" style={{ background: ACCENT }}>
                Call buchen <ArrowRight className="size-5" />
              </a>
              {/* Plattform Match neutral */}
              <button
                type="button"
                onClick={() => { setMatchOpen(true); setMatchStep(1); setMatchLoading(false); }}
                className="relative px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              >
                Plattform Match
                <span className="absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                  NEU
                </span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/70">
              {["1:1 Coaching", "0 € Setupkosten", "Faire Splits", "Diskrete Betreuung"].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" style={{ color: ACCENT }} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.05 }}
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
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Warum wir besser sind</h2>
        <p className="text-white/75 max-w-2xl mb-6">Mehrwert speziell für Adult-Creatorinnen – mit Betreuung, Tools und Deals.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">
                  Exklusive Deals (OnlyFans, MALOUM)
                  <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                    EXKLUSIV
                  </span>
                </p>
                <p className="text-white/75 text-sm">Bessere Konditionen, Promo-Slots & Early-Access-Features.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">Proaktive Betreuung</p>
                <p className="text-white/75 text-sm">1:1-Guidance, klare To-dos & wöchentliche Check-ins.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">Transparente Splits</p>
                <p className="text-white/75 text-sm">Volle Einsicht in KPIs & Maßnahmen – ohne Kleingedrucktes.</p>
              </div>
            </li>
          </ul>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">Skalierbare Tools</p>
                <p className="text-white/75 text-sm">Content-Planung, Funnel & A/B-Tests, die Umsatz hebeln.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">Starkes Netzwerk</p>
                <p className="text-white/75 text-sm">Studios, UGC-Teams & Plattformen für bessere CPMs.</p>
              </div>
            </li>
          </ul>
        </div>
      </Section>

      {/* LEISTUNGEN */}
      <Section id="leistungen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Leistungen für Adult-Creatorinnen</h2>
        <p className="text-white/75 max-w-2xl mb-6">Fokus auf Plattform-Konversion, DM-Monetarisierung & Markenschutz.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <LineChart className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">OnlyFans/Fansly Growth</h3>
            <p className="text-sm text-white/80">Pricing, Bundles, Promotions & KPI-Dashboards für Subs, Tipps & PPV.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <Users className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">DM & PPV Playbooks</h3>
            <p className="text-sm text-white/80">Mass-DM-Vorlagen, Upsell-Leitfäden, Chat-Flows & Kauf-Trigger – ohne Spam.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <ShieldCheck className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">Boundaries & Consent</h3>
            <p className="text-sm text-white/80">Klare Content-Grenzen, Einwilligungen & Prozesse – respektvoll, sicher.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <ShieldCheck className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">Content-Schutz (DMCA)</h3>
            <p className="text-sm text-white/80">Wasserzeichen, Monitoring & Takedowns, damit nichts unkontrolliert kursiert.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <Handshake className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">Diskretion & Privatsphäre</h3>
            <p className="text-sm text-white/80">DSGVO-konforme Abläufe, Alias-Strategien & sensible Kommunikation.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <EyeOff className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">
              Hybrid Models (ohne Gesicht)
              <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                EXKLUSIV
              </span>
            </h3>
            <p className="text-sm text-white/80">
              Anonym bleiben & trotzdem Umsatz? KI-unterstützte Workflows für eine <em>synthetische Persona</em>, passende Formate & sichere Prozesse – plattform-konform.
            </p>
          </div>
        </div>
      </Section>

      {/* PROZESS */}
      <Section id="prozess" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">So läuft unsere Zusammenarbeit</h2>
        <p className="text-white/75 max-w-2xl mb-6">Vom ersten Hallo bis zum 90-Tage-Plan.</p>

        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute top-0 w-[2px] bg-white/15 left-2 sm:left-3"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 0.8 }}
          />
          <ol className="relative pl-6 sm:pl-8 space-y-8">
            {[
              { Icon: PhoneCall, title: "Kontaktaufnahme", text: "Schreib kurz, wer du bist & wo du stehst – Antwort in 24h." },
              { Icon: Users, title: "Erstgespräch", text: "Kennenlernen, Ziele, Fragen. Unverbindlich & kostenlos." },
              { Icon: ClipboardList, title: "Bedarfsanalyse", text: "Audit: Plattform, Content, Kanäle, Pricing & Prozesse." },
              { Icon: Target, title: "Wünsche & Ziele", text: "Ziele + Content-Grenzen (Boundaries) sauber festlegen." },
              { Icon: Rocket, title: "Aktionsplan", text: "90-Tage-Plan mit To-dos, Verantwortlichkeiten & KPIs." },
              { Icon: Handshake, title: "Zusammenarbeit", text: "Transparente Splits, wöchentliche Iteration, nachhaltiges Wachstum." },
            ].map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
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

      {/* REFERENZEN */}
      <Section id="referenzen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Referenzen</h2>
        <p className="text-white/75 max-w-2xl mb-6">Echte Stimmen aus unserer Creator-Base – diskret & auf den Punkt.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <AvatarReal name={t.name} src={t.img} />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-white/60">{t.role}</div>
                </div>
                <Stars rating={t.rating} />
              </div>
              <p className="mt-3 text-white/80 text-sm">“{t.text}”</p>
            </div>
          ))}
        </div>
      </Section>

      {/* VERGLEICH */}
      <Section id="vergleich" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Creator-Base vs. andere Agenturen</h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm md:text-base border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-white/70">
                <th className="py-3 px-4">Kriterium</th>
                <th className="py-3 px-4">Creator-Base</th>
                <th className="py-3 px-4">Andere</th>
              </tr>
            </thead>
            <tbody>
              {[
                { k: "Betreuung", a: "1:1 & proaktiv", b: "Reaktiv, seltene Calls" },
                { k: "Transparenz", a: "Klare Splits + KPIs", b: "Unklare Verträge" },
                { k: "Wachstum", a: "Funnel, A/B-Tests, Plan", b: "Ad-hoc Posts" },
                { k: "Netzwerk", a: "Studios/Plattformen", b: "Einzeln" },
              ].map((row, i) => (
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

      {/* KONTAKT */}
      <Section id="kontakt" className="py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Kostenloses Erstgespräch sichern</h2>
            <p className="mt-2 text-white/75 max-w-prose">Erzähl uns kurz von dir – wir melden uns innerhalb von 24 Stunden.</p>
            <ul className="mt-5 space-y-2 text-white/75 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> DSGVO-konform</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> Keine Setup-Kosten</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> Unverbindlich & ehrlich</li>
            </ul>
          </div>

          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="p-6 rounded-2xl border bg-white/5 border-white/10 backdrop-blur"
          >
            <input type="hidden" name="access_key" value="a4174bd0-9c62-4f19-aa22-5c22a03e8da2" />
            <input type="hidden" name="subject" value="Neue Anfrage – Creator-Base" />
            <input type="hidden" name="from_name" value="Creator-Base Website" />
            <input type="hidden" name="replyto" value="email" />
            <input type="hidden" name="redirect" value="https://www.creator-base.com/danke" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            <div className="grid gap-4">
              <div>
                <label className="text-sm text-white/80">Dein Name</label>
                <input name="name" required placeholder="Vor- und Nachname"
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">E-Mail</label>
                <input type="email" name="email" required placeholder="name@mail.com"
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">Kurz zu dir</label>
                <textarea name="message" rows={4} placeholder="Wo stehst du? Welche Ziele hast du?"
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded" style={{ background: ACCENT }}>
                Anfrage senden
              </button>
            </div>
          </form>
        </div>
      </Section>

      {/* ==================== PLATFORM MATCH MODAL ==================== */}
      {matchOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setMatchOpen(false)} />
          {/* Scroll-Container */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="min-h-full flex items-start md:items-center justify-center p-4">
              <div className="mx-4 md:mx-0 rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl overflow-hidden w-full md:w-[920px] max-h-[100dvh] overflow-y-auto">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-white/60">Creator-Base</div>
                    <div className="text-lg font-semibold">{I18N[lang].title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Lang toggle */}
                    <button
                      className="px-2 py-1 text-xs rounded bg-white/10 border border-white/20 hover:bg-white/20"
                      onClick={() => setLang((l) => (l === "de" ? "en" : "de"))}
                    >
                      {lang.toUpperCase()}
                    </button>
                    {/* Copy link only on Step 1 and not loading */}
                    {matchStep === 1 && !matchLoading && (
                      <button
                        onClick={() => {
                          if (typeof window === "undefined") return;
                          const base = window.location.origin + window.location.pathname;
                          const qs = prefsToQuery(prefs, lang);
                          const url = `${base}?${qs}`;
                          navigator.clipboard?.writeText(url);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded bg-white/10 border border-white/20 hover:bg-white/20"
                      >
                        <Copy className="size-4" /> {I18N[lang].copyLink}
                      </button>
                    )}
                    <button onClick={() => setMatchOpen(false)} className="text-white/70 hover:text-white inline-flex items-center gap-1">
                      <XCircle className="size-5" /> {I18N[lang].close}
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 py-2">
                  <div className="h-1 w-full bg-white/10 rounded">
                    <div className="h-1 rounded" style={{ width: progressWidth, background: ACCENT }} />
                  </div>
                  <div className="mt-2 text-xs text-white/60">{progressLabel}</div>
                </div>

                {/* STEP 1: Sliders */}
                {matchStep === 1 && !matchLoading && (
                  <form onSubmit={onEvaluate} className="px-5 pb-20 md:pb-6 grid gap-4">
                    {/* Quick Sliders */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {(["anon","paypal","dach","monetize","policy","ux"] as const).map((k) => (
                        <Slider
                          key={k}
                          label={I18N[lang].sliders[k].label}
                          left={I18N[lang].sliders[k].left}
                          right={I18N[lang].sliders[k].right}
                          hint={I18N[lang].sliders[k].hint}
                          value={prefs[k]}
                          onChange={(v) => setPrefs(p => ({ ...p, [k]: v }))}
                        />
                      ))}
                    </div>

                    {/* Advanced */}
                    <details className="mt-2 rounded-xl border border-white/10 bg-white/5">
                      <summary className="cursor-pointer list-none px-3 py-2 font-semibold">{I18N[lang].advTitle}</summary>
                      <div className="p-3 grid md:grid-cols-2 gap-4">
                        {(["payout","dm","paywall","links","chargeback","analytics","kyc","live"] as const).map((k) => (
                          <Slider
                            key={k}
                            label={I18N[lang].adv[k].label}
                            left={I18N[lang].adv[k].left}
                            right={I18N[lang].adv[k].right}
                            value={prefs[k]}
                            onChange={(v) => setPrefs(p => ({ ...p, [k]: v }))}
                          />
                        ))}
                      </div>
                    </details>

                    {/* Heads-up */}
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                      <b>{I18N[lang].results.headsUp}:</b> {I18N[lang].results.headsUpText}
                    </div>

                    {/* Sticky evaluate (mobile) */}
                    <div className="md:hidden fixed left-0 right-0 bottom-0 z-[80]">
                      <div className="mx-4 mb-4 rounded-xl border border-white/15 bg-[#111318]/95 backdrop-blur px-3 py-2">
                        <button
                          type="submit"
                          className="w-full px-4 py-3 rounded font-semibold"
                          style={{ background: ACCENT }}
                        >
                          {I18N[lang].evaluate}
                        </button>
                      </div>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center justify-end">
                      <button type="submit" className="px-4 py-2 rounded inline-flex items-center gap-1" style={{ background: ACCENT }}>
                        {I18N[lang].evaluate} <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Loading */}
                {matchStep === 1 && matchLoading && (
                  <div className="px-5 py-14 flex flex-col items-center text-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full border-2 border-white/20 animate-spin"
                      style={{ borderTopColor: ACCENT }}
                      aria-label="KI denkt…"
                    />
                    <div className="text-white/80 font-medium">{I18N[lang].thinking}</div>
                    <div className="text-white/60 text-sm">Analysiert deine Prioritäten und erstellt das Ranking.</div>
                  </div>
                )}

                {/* STEP 2: Results */}
                {matchStep === 2 && result && (
                  <div className="px-5 pb-20 md:pb-6">
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 mb-3">
                      <b>{I18N[lang].results.headsUp}:</b> {I18N[lang].results.headsUpText}
                    </div>

                    <div className="text-lg font-semibold mb-2">{I18N[lang].results.top3}</div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {result.map((p) => (
                        <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xl font-semibold">{p.name}</div>
                              <div className="text-white/70 text-sm">Score {p.score.toFixed(1)} / 10</div>
                              {/* Score Bar */}
                              <div className="mt-2 h-2 w-40 bg-white/10 rounded overflow-hidden">
                                <div className="h-2" style={{ width: `${(p.score/10)*100}%`, background: ACCENT }} />
                              </div>
                            </div>
                            {p.name === "MALOUM" && (
                              <span className="text-[10px] font-semibold px-2 py-1 rounded self-start" style={{ background: ACCENT + "26", color: ACCENT }}>
                                {I18N[lang].platformBadge}
                              </span>
                            )}
                          </div>

                          {/* Chips */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.chips.map((c, i) => <Chip key={i}>{c}</Chip>)}
                          </div>

                          {/* Reasons */}
                          <div className="mt-3">
                            <div className="text-white/70 text-sm mb-1">{I18N[lang].results.whyFit}</div>
                            <ul className="text-sm text-white/90 space-y-1">
                              {p.reasons.map((r, i) => <li key={i}>• {r}</li>)}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sticky action row (mobile) */}
                    <div className="md:hidden fixed left-0 right-0 bottom-0 z-[80]">
                      <div className="mx-4 mb-4 rounded-xl border border-white/15 bg-[#111318]/95 backdrop-blur px-3 py-2 flex items-center gap-2">
                        <button
                          onClick={() => { setMatchStep(1); setMatchLoading(false); }}
                          className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/20"
                        >
                          {I18N[lang].back}
                        </button>
                        <button
                          onClick={() => setMatchOpen(false)}
                          className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/20"
                        >
                          {I18N[lang].close}
                        </button>
                      </div>
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center justify-end gap-2 mt-4">
                      <button onClick={() => { setMatchStep(1); setMatchLoading(false); }} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                        {I18N[lang].back}
                      </button>
                      <button onClick={() => setMatchOpen(false)} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                        {I18N[lang].close}
                      </button>
                    </div>
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
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
            <a href="#">AGB</a>
          </div>
        </div>
      </Section>
    </>
  );
}
