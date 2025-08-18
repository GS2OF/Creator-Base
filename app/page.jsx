"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff,
  Check, X, Minus, ChevronRight, XCircle
} from "lucide-react";

/* === Branding === */
const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

/* === Helpers === */
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

/* ★ Bewertungssterne (4/5 oder 5/5) */
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

/* Fallback-Avatar (Silhouette) */
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

/* Realistisch unscharfer Avatar aus Unsplash (mit Fallback) */
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

/* === I18N (Nav + Plattform Match) === */
const I18N = {
  de: {
    nav: { vorteile: "Vorteile", leistungen: "Leistungen", prozess: "Ablauf", referenzen: "Referenzen", vergleich: "Vergleich", kontakt: "Kontakt" },
    heroCta: "Kostenloses Erstgespräch",
    pm: {
      title: "Plattform Match",
      aiThinks: "Unsere KI denkt…",
      analyzing: "Analysiert deine Prioritäten und erstellt das Ranking.",
      step1: "Schritt 1/2: Prioritäten & Fragen",
      step2: "Schritt 2/2: Ergebnis & Vergleich",
      introTitle: "Schreib uns kurz, was dir wichtig ist",
      introHint: "z. B.: „Ich will anonym bleiben, 3–4k/Monat, Fokus Abos & PayPal, DACH-Zielgruppe.“",
      textareaPH: "Deine Prioritäten (Anonymität, Zielumsatz, Plattform-Vorlieben, Region …)",
      q: {
        focus: "Content-Fokus",
        focusSoft: "Soft / Teasing",
        focusErotik: "Erotik",
        focusExplicit: "Explizit",
        anon: "Anonym bleiben?",
        anonNo: "Nein",
        anonYes: "Ja",
        goal: "Primäres Ziel",
        goalSubs: "Abos / Stammkundschaft",
        goalPpv: "PPV & DMs",
        goalDiscover: "Reichweite",
        region: "Ziel-Region",
        regGlobal: "Global",
        regDach: "DACH",
        regUs: "USA-lastig",
        payout: "Zahlungs-Präferenz",
        payPaypal: "PayPal bevorzugt",
        payFast: "Schnelle Auszahlung",
        payHighcut: "Hoher %-Anteil",
      },
      weights: "Wie wichtig sind dir diese Punkte?",
      wFocus: "Content-Fokus",
      wAnon: "Anonymität/Privatsphäre",
      wGoal: "Abo/PPV-Ziel",
      wRegion: "Region/Zielgruppe",
      wPayout: "Auszahlung/PayPal",
      evaluate: "Auswerten",
      cancel: "Abbrechen",
      back: "Zurück",
      close: "Schließen",
      notePaypal: "Hinweis: Viele deutsche Fans bevorzugen PayPal – wegen einfacher, diskreter Zahlung.",
      features: "Features",
      ourPick: "Unsere Empfehlung",
      whyMaloum: "Warum MALOUM die richtige Empfehlung ist",
      basedOn: "Basierend auf deinen Prioritäten:",
      score: "Score",
    }
  },
  en: {
    nav: { vorteile: "Benefits", leistungen: "Services", prozess: "Process", referenzen: "References", vergleich: "Comparison", kontakt: "Contact" },
    heroCta: "Free Discovery Call",
    pm: {
      title: "Platform Match",
      aiThinks: "Our AI is thinking…",
      analyzing: "Analyzing your inputs and building the ranking.",
      step1: "Step 1/2: Priorities & Questions",
      step2: "Step 2/2: Result & Comparison",
      introTitle: "Tell us briefly what matters to you",
      introHint: `e.g. "I'd like to stay anonymous, 3–4k/month, focus on subs & PayPal, DACH audience."`,
      textareaPH: "Your priorities (anonymity, target revenue, platform prefs, region …)",
      q: {
        focus: "Content focus",
        focusSoft: "Soft / teasing",
        focusErotik: "Erotic",
        focusExplicit: "Explicit",
        anon: "Stay anonymous?",
        anonNo: "No",
        anonYes: "Yes",
        goal: "Primary goal",
        goalSubs: "Subscriptions / retention",
        goalPpv: "PPV & DMs",
        goalDiscover: "Reach",
        region: "Target region",
        regGlobal: "Global",
        regDach: "DACH",
        regUs: "US-focused",
        payout: "Payout preference",
        payPaypal: "Prefer PayPal",
        payFast: "Fast payouts",
        payHighcut: "High %-share",
      },
      weights: "How important are these to you?",
      wFocus: "Content focus",
      wAnon: "Anonymity/Privacy",
      wGoal: "Subs/PPV goal",
      wRegion: "Region/Audience",
      wPayout: "Payout/PayPal",
      evaluate: "Evaluate",
      cancel: "Cancel",
      back: "Back",
      close: "Close",
      notePaypal: "Note: Many German fans prefer PayPal — simple & discreet.",
      features: "Features",
      ourPick: "Our pick",
      whyMaloum: "Why MALOUM is the right choice",
      basedOn: "Based on your priorities:",
      score: "Score",
    }
  }
};

/* === Page === */
export default function Page() {
  const reduce = useReducedMotion();

  /* ====== Language ====== */
  const [lang, setLang] = useState("de");

  /* ====== Plattform Match – State ====== */
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchStep, setMatchStep] = useState(1);   // 1=Form/Weights, 2=Result
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchContext, setMatchContext] = useState(null);

  /* Body scroll lock when modal open (mobile fix) */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = matchOpen ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [matchOpen]);

  /* ====== Form model (no Live) ====== */
  const [pcForm, setPcForm] = useState({
    focus: "soft",
    anon: false,
    goal: "subs",
    region: "global",
    payout: "paypal",
    intro: ""
  });

  /* ====== Weights (0–10 sliders) ====== */
  const [weights, setWeights] = useState({
    focus: 6,
    anon: 8,
    goal: 7,
    region: 5,
    payout: 6
  });

  /* ====== URL <-> State (deep link without any "copy" button) ====== */
  const syncUrl = useMemo(() => ({
    encode() {
      const u = new URL(window.location.href);
      // keep existing params but set our namespace
      u.searchParams.set("match", "1");
      u.searchParams.set("step", String(matchStep));
      u.searchParams.set("lang", lang);

      // form
      Object.entries(pcForm).forEach(([k, v]) => {
        u.searchParams.set(`f_${k}`, String(v));
      });
      // weights
      Object.entries(weights).forEach(([k, v]) => {
        u.searchParams.set(`w_${k}`, String(v));
      });
      history.replaceState(null, "", u.toString());
    },
    decode() {
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.get("match") === "1") {
          setMatchOpen(true);
          const s = parseInt(u.searchParams.get("step") || "1", 10);
          setMatchStep(s === 2 ? 2 : 1);
          const l = u.searchParams.get("lang");
          if (l === "de" || l === "en") setLang(l);

          const nForm = { ...pcForm };
          ["focus","anon","goal","region","payout","intro"].forEach((key) => {
            const val = u.searchParams.get(`f_${key}`);
            if (val !== null) {
              if (key === "anon") nForm.anon = val === "true";
              else nForm[key] = val;
            }
          });
          setPcForm(nForm);

          const nW = { ...weights };
          ["focus","anon","goal","region","payout"].forEach((key) => {
            const val = u.searchParams.get(`w_${key}`);
            if (val !== null) nW[key] = Math.max(0, Math.min(10, parseInt(val, 10) || 0));
          });
          setWeights(nW);
        }
      } catch {}
    },
    clear() {
      const u = new URL(window.location.href);
      u.searchParams.delete("match");
      u.searchParams.delete("step");
      u.searchParams.delete("lang");
      ["focus","anon","goal","region","payout","intro"].forEach((k)=>u.searchParams.delete(`f_${k}`));
      ["focus","anon","goal","region","payout"].forEach((k)=>u.searchParams.delete(`w_${k}`));
      history.replaceState(null, "", u.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [matchStep, lang, pcForm, weights]);

  useEffect(() => { syncUrl.decode(); /* on mount */ }, []); // decode once
  useEffect(() => { if (matchOpen) syncUrl.encode(); }, [matchOpen, matchStep, lang, pcForm, weights, syncUrl]); // live encode

  /* ====== Infer from free text ====== */
  function inferFromIntro(text) {
    const t = (text || "").toLowerCase();
    const u = {};
    if (/anonym|ohne gesicht|diskret/.test(t)) u.anon = true;
    if (/abo|subscription|subs/.test(t)) u.goal = "subs";
    if (/(ppv|dm|direct|nachricht|pay per view|upsell)/.test(t)) u.goal = "ppv";
    if (/\bde\b|deutsch|german|dach/.test(t)) u.region = "dach";
    if (/\bus\b|usa/.test(t)) u.region = "us";
    if (/paypal/.test(t)) u.payout = "paypal";
    if (/explizit|explicit/.test(t)) u.focus = "explicit";
    if (/soft|tease|softcore/.test(t)) u.focus = "soft";
    return u;
  }

  /* ====== Scoring (weights applied, no Live) ====== */
  function computePlatformScores(f, w) {
    const s = { MALOUM: 3, OnlyFans: 0, Fansly: 1, Fanvue: 0, ManyVids: 0 };

    // Focus
    if (f.focus === "soft")     { s.MALOUM += 2 * (w.focus/10); s.Fansly += 1 * (w.focus/10); }
    if (f.focus === "erotik")   { s.MALOUM += 2 * (w.focus/10); s.OnlyFans += 2 * (w.focus/10); s.Fansly += 1 * (w.focus/10); }
    if (f.focus === "explicit") { s.OnlyFans += 3 * (w.focus/10); s.ManyVids += 2 * (w.focus/10); s.MALOUM += 1 * (w.focus/10); }

    // Anon/Privacy
    if (f.anon) { s.MALOUM += 3 * (w.anon/10); s.Fansly += 1 * (w.anon/10); }

    // Goal
    if (f.goal === "subs")     { s.MALOUM += 2 * (w.goal/10); s.OnlyFans += 2 * (w.goal/10); s.Fansly += 2 * (w.goal/10); }
    if (f.goal === "ppv")      { s.OnlyFans += 3 * (w.goal/10); s.MALOUM += 2 * (w.goal/10); s.ManyVids += 1 * (w.goal/10); }
    if (f.goal === "discover") { s.MALOUM += 2 * (w.goal/10); s.Fansly += 2 * (w.goal/10); }

    // Region
    if (f.region === "dach")   { s.MALOUM += 2 * (w.region/10); }
    if (f.region === "us")     { s.OnlyFans += 2 * (w.region/10); s.Fansly += 1 * (w.region/10); }
    if (f.region === "global") { s.MALOUM += 1 * (w.region/10); s.OnlyFans += 1 * (w.region/10); s.Fansly += 1 * (w.region/10); }

    // Payout / PayPal
    if (f.payout === "paypal") { s.MALOUM += 2 * (w.payout/10); s.OnlyFans += 2 * (w.payout/10); s.Fansly += 2 * (w.payout/10); s.Fanvue += 1 * (w.payout/10); s.ManyVids += 1 * (w.payout/10); }
    if (f.payout === "fast")   { s.MALOUM += 1 * (w.payout/10); s.OnlyFans += 1 * (w.payout/10); s.Fanvue += 1 * (w.payout/10); }
    if (f.payout === "highcut"){ s.Fanvue += 1 * (w.payout/10); s.ManyVids += 1 * (w.payout/10); }

    // small tie-break
    s.MALOUM += 0.2;

    const arr = Object.entries(s).map(([name, score]) => ({ name, score }));
    arr.sort((a, b) => b.score - a.score);
    return arr;
  }

  function submitPlatformMatch(e) {
    e?.preventDefault?.();
    const inferred = inferFromIntro(pcForm.intro);
    const merged = { ...pcForm, ...inferred };
    setMatchContext(merged);
    setMatchLoading(true);
    setMatchStep(1); // stay visually at step 1 while loading

    setTimeout(() => {
      const ranking = computePlatformScores(merged, weights);
      setMatchResult(ranking);
      setMatchLoading(false);
      setMatchStep(2);
      // update URL to step=2 for sharing result state as well (still no button)
      const u = new URL(window.location.href);
      u.searchParams.set("step", "2");
      history.replaceState(null, "", u.toString());
    }, 900);
  }

  /* ====== Feature icons in result cards ====== */
  const FEATURES = [
    { key:"anon",    label:"Anonymität möglich" },
    { key:"ppv",     label:"Stark für Abos & PPV" },
    { key:"fast",    label:"Schnelle Auszahlung" },
    { key:"paypal",  label:"PayPal verfügbar" },
    { key:"privacy", label:"DSGVO/Privatsphäre" },
    { key:"de",      label:"DE-Support" }
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

  /* ====== Testimonials (9× MALOUM) ====== */
  const TESTIMONIALS = [
    { name: "Hannah L.", role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Wöchentliche To-dos, klare Preise, DM-Templates – endlich Struktur." },
    { name: "Mia K.",    role: "Fansly", rating: 4, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Diskret & fair. In 8 Wochen auf planbare 4-stellige Umsätze." },
    { name: "Lea S.",    role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Abo-Bundles + PPV-Plan = weniger Stress, mehr Cashflow." },
    { name: "Nora P.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Anonym bleiben & wachsen – die KI-Workflows sind Gold wert." },
    { name: "Julia M.",  role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Promo-Slots & Pricing-Tests haben meine Konversion verdoppelt." },
    { name: "Alina R.",  role: "Fansly", rating: 4, img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Ehrlich, respektvoll, transparent. Genau so stelle ich mir’s vor." },
    { name: "Emma T.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Endlich KPIs, die Sinn machen – und ein 90-Tage-Plan." },
    { name: "Sofia W.",  role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1549351512-c5e12b12bda4?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Persona, Content-Cadence, DM-Skripte – passt zu meinem Alltag." },
    { name: "Lara B.",   role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1545996124-0501ebae84d5?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Weniger Posten, mehr Wirkung. Funnels statt Zufall." },
    { name: "Zoe F.",    role: "MALOUM", rating: 4, img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Check-ins halten mich accountable. Wachstum ist messbar." },
    { name: "Paula D.",  role: "MALOUM", rating: 5, img: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Faire Splits & echte Hilfe. Kein leeres Agentur-Blabla." },
    { name: "Kim A.",    role: "OnlyFans", rating: 4, img: "https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "PayPal-Fokus für DE-Fans war der Gamechanger." },
  ];

  return (
    <>
      {/* Background glow */}
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
            <a href="#vorteile" className="hover:text-white">{I18N[lang].nav.vorteile}</a>
            <a href="#leistungen" className="hover:text-white">{I18N[lang].nav.leistungen}</a>
            <a href="#prozess" className="hover:text-white">{I18N[lang].nav.prozess}</a>
            <a href="#referenzen" className="hover:text-white">{I18N[lang].nav.referenzen}</a>
            <a href="#vergleich" className="hover:text-white">{I18N[lang].nav.vergleich}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 text-xs rounded bg-white/10 border border-white/20 hover:bg-white/20"
              onClick={() => setLang((l)=> l==="de" ? "en" : "de")}
              aria-label="Language"
            >
              {lang.toUpperCase()}
            </button>
            <a href="#kontakt" className="hidden md:inline-flex rounded-lg px-4 py-2" style={{ background: ACCENT }}>
              {I18N[lang].heroCta}
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
              <span>Die Adult-Agentur für nachhaltiges Creator-Wachstum</span>
            </Pill>

            <div className="mt-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                Wir bieten{" "}
                <span
                  className="rounded px-2 -mx-1 ring-1 ring-white/10"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.45)` }}
                >
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

              {/* Plattform Match: dezent (kein Pink) */}
              <button
                type="button"
                onClick={() => { setMatchOpen(true); setMatchStep(1); setMatchResult(null); setMatchLoading(false); }}
                className="relative px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              >
                {I18N[lang].pm.title}
                <span
                  className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: ACCENT + "26", color: ACCENT }}
                >
                  NEU
                </span>
              </button>
            </div>

            {/* Trust */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/70">
              {["1:1 Coaching", "0 € Setupkosten", "Faire Splits", "Diskrete Betreuung"].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" style={{ color: ACCENT }} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: dashboard mock */}
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
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Warum wir besser sind</h2>
        <p className="text-white/75 max-w-2xl mb-6">
          Mehrwert speziell für Adult-Creatorinnen – mit Betreuung, Tools und Deals.
        </p>
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
            transition={{ duration: reduce ? 0 : 0.8 }}
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

      {/* ===== Plattform Match Modal ===== */}
      {matchOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => { setMatchOpen(false); syncUrl.clear(); }} />
          {/* Scroll-Container (Mobile fix) */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="min-h-full flex items-start md:items-center justify-center p-4">
              <div className="mx-4 md:mx-0 rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl overflow-hidden w-full md:w-[880px] max-h-[calc(100dvh-2rem)] flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-white/60">Creator-Base</div>
                    <div className="text-lg font-semibold">{I18N[lang].pm.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-white/10 border border-white/20 hover:bg-white/20"
                      onClick={() => setLang((l) => (l === "de" ? "en" : "de"))}
                    >
                      {lang.toUpperCase()}
                    </button>
                    {/* 👉 KEIN „Link kopieren“-Button irgendwo! 👈 */}
                    <button onClick={() => { setMatchOpen(false); syncUrl.clear(); }} className="text-white/70 hover:text-white inline-flex items-center gap-1">
                      <XCircle className="size-5" /> {I18N[lang].pm.close}
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 py-2">
                  <div className="h-1 w-full bg-white/10 rounded">
                    <div className="h-1 rounded" style={{ width: matchLoading ? "75%" : (matchStep === 1 ? "50%" : "100%"), background:ACCENT }} />
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    {matchLoading ? I18N[lang].pm.aiThinks : (matchStep === 1 ? I18N[lang].pm.step1 : I18N[lang].pm.step2)}
                  </div>
                </div>

                {/* Content (scroll area) */}
                <div className="px-5 pb-20 overflow-y-auto"> {/* padding-bottom for sticky footer */}
                  {/* STEP 1 */}
                  {matchStep === 1 && !matchLoading && (
                    <form onSubmit={submitPlatformMatch} className="grid gap-4">
                      {/* Free text */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-white/60">KI-gestützt</div>
                        <div className="text-lg font-semibold mt-1">{I18N[lang].pm.introTitle}</div>
                        <p className="text-white/70 text-sm mt-1">{I18N[lang].pm.introHint}</p>
                        <textarea
                          value={pcForm.intro}
                          onChange={(e)=>setPcForm(v=>({...v, intro:e.target.value}))}
                          rows={3}
                          placeholder={I18N[lang].pm.textareaPH}
                          className="w-full mt-3 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>

                      {/* Quick selects */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/80">{I18N[lang].pm.q.focus}</label>
                          <select value={pcForm.focus} onChange={e=>setPcForm(v=>({...v, focus:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="soft">{I18N[lang].pm.q.focusSoft}</option>
                            <option value="erotik">{I18N[lang].pm.q.focusErotik}</option>
                            <option value="explicit">{I18N[lang].pm.q.focusExplicit}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{I18N[lang].pm.q.anon}</label>
                          <select value={pcForm.anon?'yes':'no'} onChange={e=>setPcForm(v=>({...v, anon:e.target.value==='yes'}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="no">{I18N[lang].pm.q.anonNo}</option>
                            <option value="yes">{I18N[lang].pm.q.anonYes}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{I18N[lang].pm.q.goal}</label>
                          <select value={pcForm.goal} onChange={e=>setPcForm(v=>({...v, goal:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="subs">{I18N[lang].pm.q.goalSubs}</option>
                            <option value="ppv">{I18N[lang].pm.q.goalPpv}</option>
                            <option value="discover">{I18N[lang].pm.q.goalDiscover}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{I18N[lang].pm.q.region}</label>
                          <select value={pcForm.region} onChange={e=>setPcForm(v=>({...v, region:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="global">{I18N[lang].pm.q.regGlobal}</option>
                            <option value="dach">{I18N[lang].pm.q.regDach}</option>
                            <option value="us">{I18N[lang].pm.q.regUs}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-white/80">{I18N[lang].pm.q.payout}</label>
                          <select value={pcForm.payout} onChange={e=>setPcForm(v=>({...v, payout:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20">
                            <option value="paypal">{I18N[lang].pm.q.payPaypal}</option>
                            <option value="fast">{I18N[lang].pm.q.payFast}</option>
                            <option value="highcut">{I18N[lang].pm.q.payHighcut}</option>
                          </select>
                        </div>
                      </div>

                      {/* Weights sliders (“Balken”) */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-sm font-semibold mb-3">{I18N[lang].pm.weights}</div>
                        {[
                          ["focus", I18N[lang].pm.wFocus],
                          ["anon",  I18N[lang].pm.wAnon],
                          ["goal",  I18N[lang].pm.wGoal],
                          ["region",I18N[lang].pm.wRegion],
                          ["payout",I18N[lang].pm.wPayout],
                        ].map(([key, label]) => (
                          <div key={key} className="grid grid-cols-[160px_1fr_48px] items-center gap-3 py-2">
                            <div className="text-white/80 text-sm">{label}</div>
                            <input
                              type="range" min={0} max={10} step={1}
                              value={weights[key]}
                              onChange={(e)=>setWeights(v=>({...v, [key]: parseInt(e.target.value,10)}))}
                              className="w-full accent-white"
                            />
                            <div className="text-right text-white/70 text-sm">{weights[key]}/10</div>
                          </div>
                        ))}
                      </div>
                    </form>
                  )}

                  {/* Loading */}
                  {matchStep === 1 && matchLoading && (
                    <div className="py-14 flex flex-col items-center text-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white/20 animate-spin"
                        style={{ borderTopColor: ACCENT }}
                        aria-label={I18N[lang].pm.aiThinks}
                      />
                      <div className="text-white/80 font-medium">{I18N[lang].pm.aiThinks}</div>
                      <div className="text-white/60 text-sm">{I18N[lang].pm.analyzing}</div>
                    </div>
                  )}

                  {/* STEP 2 – Result */}
                  {matchStep === 2 && matchResult && (
                    <div className="pb-2">
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                        {I18N[lang].pm.notePaypal}
                      </div>

                      {/* Bars for ranking overview */}
                      <div className="mt-4 space-y-3">
                        {matchResult.map((p, idx) => {
                          const maxScore = matchResult[0]?.score || 1;
                          const pct = Math.max(5, Math.round((p.score / maxScore) * 100));
                          return (
                            <div key={p.name} className="bg-white/5 border border-white/10 rounded-xl p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold">{idx+1}. {p.name}</div>
                                <div className="text-white/70 text-sm">{I18N[lang].pm.score} {p.score.toFixed(1)}</div>
                              </div>
                              <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                                <div className="h-2" style={{ width: pct + "%", background: ACCENT }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Top 3 cards */}
                      {(() => {
                        const top = matchResult.slice(0,3);
                        const mal = matchResult.find(p => p.name === "MALOUM");
                        const hasMal = top.some(p => p.name === "MALOUM");
                        const top3 = hasMal ? top : [top[0], top[1], mal].filter(Boolean);

                        const card = (p) => (
                          <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xl font-semibold">{p.name}</div>
                                <div className="text-white/70 text-sm">{I18N[lang].pm.score} {p.score.toFixed(1)}</div>
                              </div>
                              {p.name === "MALOUM" && (
                                <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                                  {I18N[lang].pm.ourPick}
                                </span>
                              )}
                            </div>
                            <div className="mt-3">
                              <div className="text-white/70 text-sm mb-1">{I18N[lang].pm.features}</div>
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
                        );

                        return <div className="mt-4 grid gap-4 md:grid-cols-3">{top3.map(card)}</div>;
                      })()}

                      {/* Why MALOUM */}
                      <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="text-lg font-semibold">{I18N[lang].pm.whyMaloum}</div>
                        <div className="text-white/70 text-sm">{I18N[lang].pm.basedOn}</div>
                        <ul className="mt-3 space-y-2 text-white/90">
                          {(() => {
                            const r = [];
                            if (!matchContext) return null;
                            if (matchContext.anon) r.push("Du willst anonym bleiben – MALOUM unterstützt Hybrid-Modelle & Pseudonyme sehr gut.");
                            if (matchContext.goal === "subs" || matchContext.goal === "ppv") r.push("Fokus auf Abos & PPV – planbare Bundles und stabile Monetarisierung.");
                            if (matchContext.payout === "paypal" || matchContext.region === "dach") r.push("Auszahlungen via PayPal – schnell & unkompliziert (beliebt bei DE-Fans).");
                            if (matchContext.region === "dach") r.push("Datenschutz & Support – DSGVO-orientierte Prozesse, DE-Support.");
                            if (r.length === 0) r.push("Solider Allround-Fit für planbares Wachstum und saubere Prozesse.");
                            return r.map((t, i) => <li key={i}>• {t}</li>);
                          })()}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky footer actions (always visible on mobile) */}
                <div className="sticky bottom-0 bg-[#0f0f14]/95 backdrop-blur border-t border-white/10 px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {matchStep === 1 && !matchLoading && (
                      <>
                        <button onClick={()=>{ setMatchOpen(false); syncUrl.clear(); }} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                          {I18N[lang].pm.cancel}
                        </button>
                        <button onClick={submitPlatformMatch} className="px-4 py-2 rounded inline-flex items-center gap-1" style={{ background: ACCENT }}>
                          {I18N[lang].pm.evaluate} <ChevronRight className="size-4" />
                        </button>
                      </>
                    )}

                    {matchStep === 1 && matchLoading && (
                      <button disabled className="px-4 py-2 rounded bg-white/10 border border-white/20 opacity-70 cursor-not-allowed">
                        {I18N[lang].pm.aiThinks}
                      </button>
                    )}

                    {matchStep === 2 && (
                      <>
                        <button onClick={()=>{ setMatchStep(1); setMatchLoading(false); const u=new URL(window.location.href); u.searchParams.set("step","1"); history.replaceState(null,"",u.toString()); }} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                          {I18N[lang].pm.back}
                        </button>
                        <button onClick={()=>{ setMatchOpen(false); syncUrl.clear(); }} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                          {I18N[lang].pm.close}
                        </button>
                      </>
                    )}
                  </div>
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
