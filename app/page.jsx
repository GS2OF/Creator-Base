"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff,
  Check, X, Minus, ChevronRight, XCircle
} from "lucide-react";

/* ==== THEME ==== */
const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

/* ==== LAYOUT HELPERS ==== */
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

/* ==== RATING STARS (4/5 & 5/5) ==== */
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

/* ==== AVATARS (real + fallback blur) ==== */
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

/* ==== WIZARD OPTION CARD ==== */
const OptionCard = ({ selected, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition ${
      selected ? "border-white/40 bg-white/10" : "border-white/15 bg-white/5 hover:bg-white/10"
    }`}
  >
    <div className="font-semibold">{title}</div>
    {subtitle && <div className="text-sm text-white/70 mt-0.5">{subtitle}</div>}
  </button>
);

/* ==== PAGE ==== */
export default function Page() {
  const reduce = useReducedMotion();

  /* ====== Plattform Match – STATE ====== */
  const [matchOpen, setMatchOpen] = useState(false);
  // stages: "q" (fragen), "lead" (kontakt), "loading", "result"
  const [stage, setStage] = useState("q");
  const [step, setStep] = useState(1); // 1..7
  const [answers, setAnswers] = useState({
    focus: null,        // "soft" | "explicit"
    anon: null,         // true | false
    goal: null,         // "subs" | "ppv"
    region: null,       // "dach" | "global"
    payout: null,       // "paypal" | "fast"
    time: null,         // "low" | "mid"  (≤1h vs 2–4h)
    dms: null           // "low" | "high"
  });

  // Lead-gate fields
  const [lead, setLead] = useState({ first: "", last: "", email: "", phone: "" });
  const [leadError, setLeadError] = useState("");

  // Hash open & body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (matchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [matchOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#plattformmatch" || window.location.hash === "#plattform-match") {
      openMatch();
    }
  }, []);

  function openMatch() {
    setMatchOpen(true);
    setStage("q");
    setStep(1);
    setAnswers({ focus: null, anon: null, goal: null, region: null, payout: null, time: null, dms: null });
    setLead({ first: "", last: "", email: "", phone: "" });
    setLeadError("");
    // Deep-link setzen
    if (typeof window !== "undefined") {
      if (window.location.hash !== "#plattformmatch") {
        history.replaceState(null, "", window.location.pathname + window.location.search + "#plattformmatch");
      }
    }
  }

  function closeMatch() {
    setMatchOpen(false);
    // Hash entfernen, aber Query & Path erhalten
    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  /* ====== Fragen (7 Steps, A/B) ====== */
  const QUESTIONS = [
    {
      key: "focus",
      title: "Welche Content-Ausrichtung passt eher zu dir?",
      a: { value: "soft", title: "Soft / Teasing", subtitle: "ästhetisch, andeutend, fokussiert auf Stimmung" },
      b: { value: "explicit", title: "Explizit", subtitle: "deutlich, direkt, freizügig" },
    },
    {
      key: "anon",
      title: "Möchtest du anonym bleiben?",
      a: { value: true,  title: "Ja, anonym", subtitle: "Pseudonym, Gesicht meiden, diskrete Prozesse" },
      b: { value: false, title: "Nein",       subtitle: "Offen mit Gesichts-Brand" },
    },
    {
      key: "goal",
      title: "Was ist dein primäres Umsatz-Ziel?",
      a: { value: "subs", title: "Abos", subtitle: "Stammkundschaft & planbare Umsätze" },
      b: { value: "ppv",  title: "PPV/DM", subtitle: "Einmalverkäufe & Upsells in DMs" },
    },
    {
      key: "region",
      title: "Wo liegt dein Fokus?",
      a: { value: "dach",   title: "DACH", subtitle: "Deutschsprachige Zielgruppe" },
      b: { value: "global", title: "International", subtitle: "Breiter, englischsprachig" },
    },
    {
      key: "payout",
      title: "Welche Auszahlung ist dir wichtiger?",
      a: { value: "paypal", title: "PayPal & Komfort", subtitle: "Beliebt bei DE-Fans" },
      b: { value: "fast",   title: "Schnelle Auszahlungen", subtitle: "Tempo vor Komfort" },
    },
    {
      key: "time",
      title: "Wie viel Zeit hast du täglich?",
      a: { value: "low", title: "≤ 1 Stunde/Tag", subtitle: "klarer Plan, effiziente Formate" },
      b: { value: "mid", title: "2–4 Stunden/Tag", subtitle: "aktiv posten + DMs" },
    },
    {
      key: "dms",
      title: "Wie stehst du zu DMs/Chats?",
      a: { value: "low",  title: "Eher wenig DMs", subtitle: "Content-first, klare Bundles" },
      b: { value: "high", title: "DM-stark",       subtitle: "persönliche Chats & Upsells" },
    },
  ];

  const currentQ = QUESTIONS[step - 1];
  const selectedValue = answers[currentQ?.key];

  function choose(val) {
    setAnswers((prev) => ({ ...prev, [currentQ.key]: val }));
  }

  function next() {
    if (stage === "q") {
      if (step < QUESTIONS.length) setStep(step + 1);
      else setStage("lead"); // nach Frage 7: Lead-Gate
    }
  }
  function back() {
    if (stage === "q" && step > 1) setStep(step - 1);
    else if (stage === "lead") { setStage("q"); setStep(QUESTIONS.length); }
    else if (stage === "result") { setStage("q"); setStep(QUESTIONS.length); }
  }

  /* ====== Scoring (normalisiert 1..10) ====== */
  function computeScores(a) {
    // Rohpunkte (Basis 1, damit niemand bei 0 startet)
    const s = { MALOUM: 1, OnlyFans: 1, Fansly: 1, Fanvue: 1, ManyVids: 1 };

    // 1) Fokus
    if (a.focus === "soft") { s.MALOUM += 2; s.Fansly += 1; }
    if (a.focus === "explicit") { s.OnlyFans += 3; s.ManyVids += 2; s.MALOUM += 1; }

    // 2) Anonymität
    if (a.anon === true) { s.MALOUM += 3; s.Fansly += 1; }
    if (a.anon === false) { s.OnlyFans += 1; }

    // 3) Ziel
    if (a.goal === "subs") { s.MALOUM += 2; s.OnlyFans += 2; s.Fansly += 1; }
    if (a.goal === "ppv")  { s.OnlyFans += 3; s.MALOUM += 2; s.Fansly += 2; s.ManyVids += 1; }

    // 4) Region
    if (a.region === "dach")   { s.MALOUM += 2; }
    if (a.region === "global") { s.MALOUM += 1; s.OnlyFans += 1; s.Fansly += 1; }

    // 5) Auszahlung
    if (a.payout === "paypal") { s.MALOUM += 2; s.OnlyFans += 2; s.Fansly += 2; s.Fanvue += 1; s.ManyVids += 1; }
    if (a.payout === "fast")   { s.MALOUM += 1; s.OnlyFans += 1; s.Fanvue += 1; }

    // 6) Zeit
    if (a.time === "low") { s.MALOUM += 2; s.Fanvue += 1; }
    if (a.time === "mid") { s.OnlyFans += 1; s.Fansly += 2; }

    // 7) DMs
    if (a.dms === "low")  { s.MALOUM += 2; }
    if (a.dms === "high") { s.OnlyFans += 1; s.Fansly += 2; }

    // Normalisieren: Top ≈ 10, Rest relativ (min 1.0)
    const raw = Object.entries(s);
    const maxRaw = Math.max(...raw.map(([,v]) => v));
    const norm = raw
      .map(([name, v]) => ({ name, score: (v / maxRaw) * 9 + 1 })) // 1..10
      .sort((a, b) => b.score - a.score);

    return norm;
  }

  const [result, setResult] = useState(null);
  function startEvaluation() {
    setStage("loading");
    // Simulierter „KI denkt…“
    setTimeout(() => {
      const ranking = computeScores(answers);
      setResult(ranking);
      setStage("result");
    }, 1100);
  }

  /* ====== Lead submit (Web3Forms) ====== */
  async function submitLead(e) {
    e?.preventDefault?.();
    setLeadError("");
    if (!lead.first.trim() || !lead.email.trim()) {
      setLeadError("Bitte fülle mindestens Vorname und E-Mail aus.");
      return;
    }

    // optional: sofort auswerten starten (UX snappy), parallel senden
    startEvaluation();

    try {
      const fd = new FormData();
      fd.append("access_key", "a4174bd0-9c62-4f19-aa22-5c22a03e8da2");
      fd.append("subject", "Plattform Match Lead");
      fd.append("from_name", "Creator-Base Website");
      fd.append("replyto", lead.email);
      fd.append("first_name", lead.first);
      fd.append("last_name", lead.last || "");
      fd.append("email", lead.email);
      fd.append("phone", lead.phone || "");
      fd.append("answers", JSON.stringify(answers));
      if (typeof window !== "undefined") {
        fd.append("source", window.location.href);
      }
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
    } catch {
      // still show result; no hard stop
    }
  }

  /* ====== FEATURES MATRIX (unchanged) ====== */
  const FEATURES = [
    { key:"anon",    label:"Anonymität möglich" },
    { key:"ppv",     label:"Stark für Abos & PPV" },
    { key:"live",    label:"Live-Streams" },
    { key:"fast",    label:"Schnelle Auszahlung" },
    { key:"paypal",  label:"PayPal verfügbar" },
    { key:"privacy", label:"DSGVO/Privatsphäre" },
    { key:"de",      label:"DE-Support" }
  ];

  const PROFILE = {
    MALOUM:   { anon:true,  ppv:true, live:false, fast:true,  paypal:true,  privacy:true, de:true  },
    OnlyFans: { anon:false, ppv:true, live:true,  fast:true,  paypal:true,  privacy:true, de:false },
    Fansly:   { anon:true,  ppv:true, live:true,  fast:true,  paypal:true,  privacy:true, de:false },
    Fanvue:   { anon:false, ppv:true, live:false, fast:true,  paypal:true,  privacy:true, de:false },
    ManyVids: { anon:false, ppv:true, live:false, fast:false, paypal:true,  privacy:true, de:false }
  };

  const IconCell = ({v}) => v === true
    ? <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="size-4" />Ja</span>
    : v === false
      ? <span className="inline-flex items-center gap-1 text-rose-400"><X className="size-4" />Nein</span>
      : <span className="inline-flex items-center gap-1 text-white/70"><Minus className="size-4" />Teilweise</span>;

  // Progress bar label & width
  const progressLabel = useMemo(() => {
    if (stage === "loading") return "Unsere KI denkt…";
    if (stage === "lead") return "Fast geschafft – Kontaktdaten";
    if (stage === "result") return "Dein Ergebnis";
    return `Schritt ${step}/${QUESTIONS.length}`;
  }, [stage, step]);

  const progressPct = useMemo(() => {
    if (stage === "loading") return 85;
    if (stage === "result") return 100;
    if (stage === "lead") return 95;
    return Math.round((step - 1) / QUESTIONS.length * 90) + 5; // 5..95
  }, [stage, step]);

  /* ====== REFERENZEN (9x MALOUM, gemischte Sterne) ====== */
  const TESTIMONIALS = [
    { name: "Hannah L.", role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Wöchentliche To-dos, klare Preise, DM-Templates – endlich Struktur." },
    { name: "Mia K.",    role: "Fansly",   rating: 4, img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Diskret & fair. In 8 Wochen auf planbare 4-stellige Umsätze." },
    { name: "Lea S.",    role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Abo-Bundles + PPV-Plan = weniger Stress, mehr Cashflow." },
    { name: "Nora P.",   role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Anonym bleiben & wachsen – die KI-Workflows sind Gold wert." },
    { name: "Julia M.",  role: "MALOUM",   rating: 4, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Promo-Slots & Pricing-Tests haben meine Konversion verdoppelt." },
    { name: "Alina R.",  role: "Fansly",   rating: 4, img: "https://images.unsplash.com/photo-1549351512-c5e12b12bda4?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Ehrlich, respektvoll, transparent. Genau so stelle ich mir’s vor." },
    { name: "Emma T.",   role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Endlich KPIs, die Sinn machen – und ein 90-Tage-Plan." },
    { name: "Sofia W.",  role: "MALOUM",   rating: 4, img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Persona, Content-Cadence, DM-Skripte – passt zu meinem Alltag." },
    { name: "Lara B.",   role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Weniger Posten, mehr Wirkung. Funnels statt Zufall." },
    { name: "Zoe F.",    role: "MALOUM",   rating: 4, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Check-ins halten mich accountable. Wachstum ist messbar." },
    { name: "Paula D.",  role: "MALOUM",   rating: 5, img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "Faire Splits & echte Hilfe. Kein leeres Agentur-Blabla." },
    { name: "Kim A.",    role: "OnlyFans", rating: 4, img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2", text: "PayPal-Fokus für DE-Fans war der Gamechanger." },
  ];

  /* ====== UI ====== */
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
          <div className="flex items-center gap-2">
            {/* EN-Toggle (einfacher Link zur EN-Seite, falls vorhanden) */}
            <a href="/en" className="hidden md:inline-flex rounded-lg px-3 py-2 bg-white/10 border border-white/15 hover:bg-white/20 text-white/90">EN</a>
            <button onClick={openMatch} className="md:hidden rounded-lg px-3 py-2 bg-white/10 border border-white/20">Match</button>
            <a href="#kontakt" className="hidden md:inline-flex rounded-lg px-4 py-2" style={{ background: ACCENT }}>
              Kostenloses Erstgespräch
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

              {/* Plattform Match – dezent (kein Pink) */}
              <button
                type="button"
                onClick={openMatch}
                className="relative px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              >
                Plattform Match
                <span
                  className="absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: ACCENT + "26", color: ACCENT }}
                >
                  NEU
                </span>
              </button>
            </div>

            {/* Trust-Punkte */}
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

      {/* ====== PLATTFORM MATCH MODAL (Wizard + Lead-Gate + Result) ====== */}
      {matchOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={closeMatch} />
          {/* Scrollable container (mobile-safe) */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="min-h-full flex items-end md:items-center justify-center p-0 md:p-6">
              <div className="w-full md:w-[880px] mx-0 md:mx-auto max-h-[100dvh] md:max-h-[calc(100dvh-3rem)] overflow-hidden rounded-t-2xl md:rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/60">Creator-Base</div>
                    <div className="text-lg font-semibold">Plattform Match</div>
                  </div>
                  <button onClick={closeMatch} className="text-white/70 hover:text-white flex items-center gap-1">
                    <XCircle className="size-5" /> Schließen
                  </button>
                </div>

                {/* Progress */}
                <div className="px-5 py-3">
                  <div className="h-1 w-full bg-white/10 rounded">
                    <div className="h-1 rounded" style={{ width: `${progressPct}%`, background: ACCENT }} />
                  </div>
                  <div className="mt-2 text-xs text-white/60">{progressLabel}</div>
                </div>

                {/* CONTENT AREA (scrolls) */}
                <div className="px-5 pb-24 md:pb-6 overflow-y-auto max-h-[calc(100dvh-10rem)] md:max-h-[calc(100dvh-11rem)]">
                  {/* STEP: QUESTIONS */}
                  {stage === "q" && currentQ && (
                    <div className="grid gap-4">
                      <div className="text-lg font-semibold">{currentQ.title}</div>
                      <div className="grid gap-3">
                        <OptionCard
                          selected={selectedValue === currentQ.a.value}
                          title={currentQ.a.title}
                          subtitle={currentQ.a.subtitle}
                          onClick={() => choose(currentQ.a.value)}
                        />
                        <OptionCard
                          selected={selectedValue === currentQ.b.value}
                          title={currentQ.b.title}
                          subtitle={currentQ.b.subtitle}
                          onClick={() => choose(currentQ.b.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP: LEAD GATE */}
                  {stage === "lead" && (
                    <form onSubmit={submitLead} className="grid gap-4">
                      <div className="text-lg font-semibold">Fast geschafft – wie können wir dich erreichen?</div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-white/80">Vorname *</label>
                          <input
                            value={lead.first}
                            onChange={(e)=>setLead(v=>({...v, first:e.target.value}))}
                            required
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white"
                            placeholder="Dein Vorname"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/80">Nachname</label>
                          <input
                            value={lead.last}
                            onChange={(e)=>setLead(v=>({...v, last:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white"
                            placeholder="optional"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/80">E-Mail *</label>
                          <input
                            type="email"
                            value={lead.email}
                            onChange={(e)=>setLead(v=>({...v, email:e.target.value}))}
                            required
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white"
                            placeholder="name@mail.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-white/80">Telefon</label>
                          <input
                            value={lead.phone}
                            onChange={(e)=>setLead(v=>({...v, phone:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white"
                            placeholder="+49 … (optional)"
                          />
                        </div>
                      </div>
                      {leadError && <div className="text-sm text-rose-400">{leadError}</div>}
                      <div className="text-xs text-white/50">
                        Mit „Weiter“ stimmst du zu, dass wir dich zu deinem Ergebnis kontaktieren dürfen.
                      </div>
                    </form>
                  )}

                  {/* STEP: LOADING */}
                  {stage === "loading" && (
                    <div className="py-12 flex flex-col items-center text-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white/20 animate-spin"
                        style={{ borderTopColor: ACCENT }}
                        aria-label="KI denkt…"
                      />
                      <div className="text-white/80 font-medium">Unsere KI denkt…</div>
                      <div className="text-white/60 text-sm">Analysiert deine Angaben und erstellt das Ranking.</div>
                    </div>
                  )}

                  {/* STEP: RESULT */}
                  {stage === "result" && result && (
                    <div className="pb-2">
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                        Hinweis: Viele deutsche Fans bevorzugen <b>PayPal</b> – wegen einfacher, diskreter Zahlung.
                      </div>

                      {(() => {
                        const top = result.slice(0,3);
                        const mal = result.find(p => p.name === "MALOUM");
                        const hasMal = top.some(p => p.name === "MALOUM");
                        const top3 = hasMal ? top : [top[0], top[1], mal].filter(Boolean);

                        const card = (p) => (
                          <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xl font-semibold">{p.name}</div>
                                <div className="text-white/70 text-sm">{p.score.toFixed(1)} / 10</div>
                              </div>
                              {p.name === "MALOUM" && (
                                <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                                  Unsere Empfehlung
                                </span>
                              )}
                            </div>
                            <div className="mt-3">
                              <div className="text-white/70 text-sm mb-1">Features</div>
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

                      <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="text-lg font-semibold">Warum MALOUM gut passt</div>
                        <div className="text-white/70 text-sm">Basierend auf deinen Antworten:</div>
                        <ul className="mt-3 space-y-2 text-white/90">
                          {(() => {
                            const r = [];
                            if (answers.anon) r.push("Anonym bleiben – MALOUM unterstützt Hybrid-Modelle & Pseudonyme sehr gut.");
                            if (answers.goal === "subs") r.push("Abo-Fokus – planbare Bundles & stabile Monetarisierung.");
                            if (answers.goal === "ppv")  r.push("PPV/DM-Fokus – klare Upsell-Playbooks & saubere Prozesse.");
                            if (answers.payout === "paypal" || answers.region === "dach") r.push("PayPal & DACH – beliebt bei DE-Fans, einfache Abwicklung.");
                            if (answers.time === "low") r.push("Wenig Zeit – effiziente Formate & klare Cadence.");
                            if (answers.dms === "low") r.push("Content-first – weniger Chataufwand, mehr Wert je Post.");
                            if (r.length === 0) r.push("Solider Allround-Fit für sauberes, planbares Wachstum.");
                            return r.map((t, i) => <li key={i}>• {t}</li>);
                          })()}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* STICKY ACTION BAR (mobile-safe) */}
                <div className="sticky bottom-0 left-0 right-0 bg-[#0f0f14]/95 backdrop-blur border-t border-white/10 px-5 py-3">
                  {/* Buttons je Stage */}
                  {stage === "q" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={closeMatch}
                        className="px-4 py-2 rounded bg-white/10 border border-white/20 w-1/2 md:w-auto"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={back}
                        disabled={step === 1}
                        className="px-4 py-2 rounded bg-white/10 border border-white/20 w-1/2 md:w-auto disabled:opacity-40"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={next}
                        disabled={answers[currentQ.key] == null}
                        className="ml-auto px-4 py-2 rounded text-white disabled:opacity-40"
                        style={{ background: ACCENT }}
                      >
                        {step < QUESTIONS.length ? "Weiter" : "Ergebnis anzeigen"}
                      </button>
                    </div>
                  )}

                  {stage === "lead" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={back}
                        className="px-4 py-2 rounded bg-white/10 border border-white/20 w-1/2 md:w-auto"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={submitLead}
                        className="ml-auto px-4 py-2 rounded text-white w-1/2 md:w-auto"
                        style={{ background: ACCENT }}
                      >
                        Weiter
                      </button>
                    </div>
                  )}

                  {stage === "loading" && (
                    <div className="flex items-center justify-between">
                      <div className="text-white/70 text-sm">Ergebnis wird vorbereitet…</div>
                      <button onClick={closeMatch} className="px-4 py-2 rounded bg-white/10 border border-white/20">Schließen</button>
                    </div>
                  )}

                  {stage === "result" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={back}
                        className="px-4 py-2 rounded bg-white/10 border border-white/20 w-1/2 md:w-auto"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={closeMatch}
                        className="ml-auto px-4 py-2 rounded bg-white/10 border border-white/20 w-1/2 md:w-auto"
                      >
                        Schließen
                      </button>
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
