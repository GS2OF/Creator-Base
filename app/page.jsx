"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff,
  Check, X, Minus, ChevronRight, XCircle
} from "lucide-react";

/* ====== Design Tokens ====== */
const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

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

/* ====== i18n Mini ====== */
function getInitialLang() {
  if (typeof window === "undefined") return "de";
  const p = new URLSearchParams(window.location.search);
  return p.get("lang") === "en" ? "en" : "de";
}
const Tr = ({ lang, de, en }) => <>{lang === "de" ? de : en}</>;

/* ★ Bewertungssterne – 4/5 & 5/5 möglich */
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

/* Fallback-Avatar (Silhouette), falls Bild nicht lädt */
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

/* Realistischer, unscharfer Avatar (Unsplash) */
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

export default function Page() {
  const reduce = useReducedMotion();
  const [lang, setLang] = useState(getInitialLang());

  /* Sprache in URL mitschreiben (sharebar-freundlich) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  }, [lang]);

  /* ====== Plattform Match – State & Logik ====== */

  // Hash-open: #plattformmatch
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchStep, setMatchStep] = useState(1);   // 1=Fragen, 2=Ergebnis
  const [matchLoading, setMatchLoading] = useState(false); // KI denkt…
  const [matchResult, setMatchResult] = useState(null);
  const [matchContext, setMatchContext] = useState(null); // für Begründungen

  // Body-Scroll locken, wenn Modal offen (Mobile-Fix)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (matchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [matchOpen]);

  // Open/Close + Hash sync
  const openMatch = () => {
    setMatchOpen(true);
    setMatchStep(1);
    setMatchResult(null);
    setMatchLoading(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = "plattformmatch";
      window.history.replaceState({}, "", url.toString());
    }
  };
  const closeMatch = () => {
    setMatchOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = "";
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Beim Laden: Hash checken
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.replace("#", "") === "plattformmatch") {
      openMatch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Formularstate
  const [pcForm, setPcForm] = useState({
    focus: "soft",         // soft | erotik | explicit
    anon: false,           // ja/nein
    goal: "subs",          // subs | ppv | discover
    region: "global",      // global | dach | us
    payout: "paypal",      // paypal | fast | highcut
    intro: "",             // Freitext
    // Importance-Slider 0..100
    wAnon: 60,
    wMonet: 70,
    wDiscover: 40,
    wRegion: 50,
    wPayout: 55,
  });

  function inferFromIntro(text) {
    const t = (text || "").toLowerCase();
    const u = {};
    if (/anonym|ohne gesicht|diskret/.test(t)) u.anon = true;
    if (/abo|subscription|subs/.test(t)) u.goal = "subs";
    if (/(ppv|dm|direct|nachricht|pay per view|upsell)/.test(t)) u.goal = "ppv";
    if (/\bdach\b|deutsch|german/.test(t)) u.region = "dach";
    if (/\bus\b|usa/.test(t)) u.region = "us";
    if (/paypal/.test(t)) u.payout = "paypal";
    return u;
  }

  /* Plattformprofile (0..1) */
  const PLATFORM_PROFILE = {
    MALOUM:   { anon: 1.0, subsppv: 0.9, discover: 0.7, de: 0.9, us: 0.6, payout_paypal: 0.9, payout_speed: 0.8, revshare: 0.7 },
    OnlyFans: { anon: 0.3, subsppv: 0.9, discover: 0.6, de: 0.6, us: 0.85, payout_paypal: 0.9, payout_speed: 0.8, revshare: 0.6 },
    Fansly:   { anon: 0.8, subsppv: 0.8, discover: 0.7, de: 0.5, us: 0.75, payout_paypal: 0.8, payout_speed: 0.7, revshare: 0.6 },
    Fanvue:   { anon: 0.4, subsppv: 0.7, discover: 0.5, de: 0.4, us: 0.6,  payout_paypal: 0.7, payout_speed: 0.7, revshare: 0.65 },
    ManyVids: { anon: 0.4, subsppv: 0.6, discover: 0.4, de: 0.4, us: 0.55, payout_paypal: 0.7, payout_speed: 0.5, revshare: 0.7 },
  };

  // Content-Fit pro Plattform aus Fokus (0..1)
  function contentFit(focus, name) {
    if (focus === "soft") {
      return name === "MALOUM" ? 1 : (name === "Fansly" ? 0.8 : 0.7);
    }
    if (focus === "erotik") {
      if (name === "MALOUM") return 0.95;
      if (name === "OnlyFans") return 0.95;
      if (name === "Fansly") return 0.85;
      return 0.7;
    }
    // explicit
    if (name === "OnlyFans") return 1;
    if (name === "ManyVids") return 0.85;
    if (name === "MALOUM") return 0.75;
    return 0.7;
  }

  /* Gewichtete, normalisierte Bewertung 0..10 */
  function computePlatformScores(f) {
    // Wichtigkeiten 0..1
    const W = {
      anon:    (f.anon ? f.wAnon : 0) / 100, // wenn Anon = nein, dann kein Gewicht
      monet:   f.wMonet / 100,               // Abos/PPV
      discover:f.wDiscover / 100,
      region:  f.wRegion / 100,
      payout:  f.wPayout / 100,
    };
    // Region-Fit je Auswahl
    const regionKey = f.region === "dach" ? "de" : f.region === "us" ? "us" : "global";
    // Payout-Fit je Präferenz
    const payoutKey = f.payout === "paypal" ? "payout_paypal" : f.payout === "fast" ? "payout_speed" : "revshare";

    const raw = Object.keys(PLATFORM_PROFILE).map((name) => {
      const P = PLATFORM_PROFILE[name];
      const fitContent = contentFit(f.focus, name); // 0..1

      // RegionFit
      let fitRegion = 0.7; // global baseline
      if (regionKey === "de") fitRegion = P.de;
      else if (regionKey === "us") fitRegion = P.us;

      // Kategorien (0..1)
      const K = {
        anon: P.anon,
        monet: P.subsppv,
        discover: P.discover,
        region: fitRegion,
        payout: P[payoutKey],
      };

      // gewichteter Score 0..1
      const totalW = W.anon + W.monet + W.discover + W.region + W.payout || 1;
      const weighted =
        (W.anon * K.anon +
         W.monet * K.monet +
         W.discover * K.discover +
         W.region * K.region +
         W.payout * K.payout) / totalW;

      // Content-Fit als Multiplikator (±15%)
      const contentBoost = 0.85 + 0.30 * fitContent; // 0.85..1.15
      let score01 = Math.min(1, Math.max(0, weighted * contentBoost));

      // Zielpräferenz leichte Justierung (subs/ppv/discover)
      if (f.goal === "discover") score01 *= (0.9 + 0.2 * P.discover); // 0.9..1.1 je nach Discover-Stärke
      if (f.goal === "ppv" || f.goal === "subs") score01 *= (0.9 + 0.2 * P.subsppv);

      // leichte Tie-Breaker
      if (name === "MALOUM") score01 += 0.01;

      return { name, score: +(score01 * 10).toFixed(1) }; // 0..10
    });

    // Sortiert
    raw.sort((a,b) => b.score - a.score);
    return raw;
  }

  function submitPlatformMatch(e) {
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

  const FEATURES = [
    { key:"anon",    label_de:"Anonymität möglich", label_en:"Anonymity possible" },
    { key:"ppv",     label_de:"Stark für Abos & PPV", label_en:"Strong for subs & PPV" },
    { key:"fast",    label_de:"Schnelle Auszahlung", label_en:"Fast payout" },
    { key:"paypal",  label_de:"PayPal verfügbar", label_en:"PayPal supported" },
    { key:"privacy", label_de:"DSGVO/Privatsphäre", label_en:"Privacy / GDPR" },
    { key:"de",      label_de:"DE-Support", label_en:"German support" }
  ];

  const PROFILE = {
    MALOUM:   { anon:true,  ppv:true, fast:true,  paypal:true,  privacy:true, de:true  },
    OnlyFans: { anon:false, ppv:true, fast:true,  paypal:true,  privacy:true, de:false },
    Fansly:   { anon:true,  ppv:true, fast:true,  paypal:true,  privacy:true, de:false },
    Fanvue:   { anon:false, ppv:true, fast:true,  paypal:true,  privacy:true, de:false },
    ManyVids: { anon:false, ppv:true, fast:false, paypal:true,  privacy:true, de:false }
  };

  const IconCell = ({v}) => v === true
    ? <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="size-4" /> <Tr lang={lang} de="Ja" en="Yes" /></span>
    : v === false
      ? <span className="inline-flex items-center gap-1 text-rose-400"><X className="size-4" /> <Tr lang={lang} de="Nein" en="No" /></span>
      : <span className="inline-flex items-center gap-1 text-white/70"><Minus className="size-4" /> <Tr lang={lang} de="Teilweise" en="Partial" /></span>;

  // Progress UI
  const progressLabel = matchLoading
    ? (lang === "de" ? "KI analysiert deine Angaben…" : "Our AI is analyzing your input…")
    : (matchStep === 1 ? (lang === "de" ? "Schritt 1/2: Prioritäten & Fragen" : "Step 1/2: Priorities & Questions")
                       : (lang === "de" ? "Schritt 2/2: Ergebnis & Vergleich" : "Step 2/2: Result & Comparison"));
  const progressWidth = matchLoading ? "75%" : (matchStep === 1 ? "50%" : "100%");

  /* ====== Referenzen – 9x MALOUM + Avatare + 4/5 mix ====== */
  const TESTIMONIALS = [
    {
      name: "Hannah L.", role: "MALOUM", rating: 5,
      img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Wöchentliche To-dos, klare Preise, DM-Templates – endlich Struktur.",
      text_en: "Weekly to-dos, clear pricing, DM templates — finally structure."
    },
    {
      name: "Mia K.", role: "Fansly", rating: 4,
      img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Diskret & fair. In 8 Wochen auf planbare 4-stellige Umsätze.",
      text_en: "Discreet & fair. Reached steady four figures within 8 weeks."
    },
    {
      name: "Lea S.", role: "MALOUM", rating: 5,
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Abo-Bundles + PPV-Plan = weniger Stress, mehr Cashflow.",
      text_en: "Bundle strategy + PPV plan = less stress, more cash flow."
    },
    {
      name: "Nora P.", role: "MALOUM", rating: 5,
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Anonym bleiben & wachsen – die KI-Workflows sind Gold wert.",
      text_en: "Stay anonymous & grow — the AI workflows are gold."
    },
    {
      name: "Julia M.", role: "MALOUM", rating: 4,
      img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Promo-Slots & Pricing-Tests haben meine Konversion verdoppelt.",
      text_en: "Promo slots & pricing tests doubled my conversion."
    },
    {
      name: "Alina R.", role: "Fansly", rating: 4,
      img: "https://images.unsplash.com/photo-1549351512-c5e12b12bda4?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Ehrlich, respektvoll, transparent. Genau so stelle ich mir’s vor.",
      text_en: "Honest, respectful, transparent — exactly what I wanted."
    },
    {
      name: "Emma T.", role: "MALOUM", rating: 5,
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Endlich KPIs, die Sinn machen – und ein 90-Tage-Plan.",
      text_en: "Finally KPIs that make sense — and a 90-day plan."
    },
    {
      name: "Sofia W.", role: "MALOUM", rating: 4,
      img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Persona, Content-Cadence, DM-Skripte – passt zu meinem Alltag.",
      text_en: "Persona, content cadence, DM scripts — fits my routine."
    },
    {
      name: "Lara B.", role: "MALOUM", rating: 5,
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Weniger Posten, mehr Wirkung. Funnels statt Zufall.",
      text_en: "Post less, impact more. Funnels over randomness."
    },
    {
      name: "Zoe F.", role: "MALOUM", rating: 4,
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Check-ins halten mich accountable. Wachstum ist messbar.",
      text_en: "Check-ins keep me accountable. Growth is measurable."
    },
    {
      name: "Paula D.", role: "MALOUM", rating: 5,
      img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "Faire Splits & echte Hilfe. Kein leeres Agentur-Blabla.",
      text_en: "Fair splits & real help. No agency buzzword BS."
    },
    {
      name: "Kim A.", role: "OnlyFans", rating: 4,
      img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=200&h=200&q=60&crop=faces&facepad=2",
      text_de: "PayPal-Fokus für DE-Fans war der Gamechanger.",
      text_en: "PayPal focus for DE fans was the game changer."
    },
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
            <span className="font-semibold tracking-tight">Creator-Base</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">Agency</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded border border-white/15 text-white/70">18+</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#vorteile" className="hover:text-white"><Tr lang={lang} de="Vorteile" en="Benefits" /></a>
            <a href="#leistungen" className="hover:text-white"><Tr lang={lang} de="Leistungen" en="Services" /></a>
            <a href="#prozess" className="hover:text-white"><Tr lang={lang} de="Ablauf" en="Process" /></a>
            <a href="#referenzen" className="hover:text-white"><Tr lang={lang} de="Referenzen" en="References" /></a>
            <a href="#vergleich" className="hover:text-white"><Tr lang={lang} de="Vergleich" en="Comparison" /></a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="rounded-lg px-3 py-1 text-sm border border-white/20 hover:bg-white/10"
              aria-label="Language toggle"
              title={lang === "de" ? "Switch to English" : "Wechsel zu Deutsch"}
            >
              {lang === "de" ? "EN" : "DE"}
            </button>
            <a href="#kontakt" className="hidden md:inline-flex rounded-lg px-4 py-2" style={{ background: ACCENT }}>
              <Tr lang={lang} de="Kostenloses Erstgespräch" en="Free discovery call" />
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
              <span>
                <Tr
                  lang={lang}
                  de="Die Adult-Agentur für nachhaltiges Creator-Wachstum"
                  en="The adult agency for sustainable creator growth"
                />
              </span>
            </Pill>

            {/* Claim */}
            <div className="mt-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                <Tr lang={lang} de="Wir bieten " en="We create " />
                <span
                  className="rounded px-2 -mx-1 ring-1 ring-white/10"
                  style={{ backgroundColor: `rgba(${ACCENT_RGB}, 0.45)` }}
                >
                  <Tr lang={lang} de="Mehrwert" en="value" />
                </span>{" "}
                <Tr lang={lang} de="für deinen Content." en="for your content." />
              </h1>

              <p className="mt-4 text-white/80 text-base md:text-lg max-w-prose">
                <Tr
                  lang={lang}
                  de="Mehr Subs, PPV & Tipps – mit Strategie, 1:1-Betreuung und fairen Splits. Du behältst die Kontrolle."
                  en="More subs, PPV & tips — with strategy, 1:1 support and fair splits. You stay in control."
                />
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#kontakt" className="gap-2 px-5 py-3 rounded-xl inline-flex items-center" style={{ background: ACCENT }}>
                <Tr lang={lang} de="Call buchen" en="Book a call" /> <ArrowRight className="size-5" />
              </a>

              {/* Plattform Match – dezent (kein Pink) */}
              <button
                type="button"
                onClick={openMatch}
                className="relative px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              >
                <Tr lang={lang} de="Plattform Match" en="Platform Match" />
                <span
                  className="absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: ACCENT + "26", color: ACCENT }}
                >
                  <Tr lang={lang} de="NEU" en="NEW" />
                </span>
              </button>
            </div>

            {/* Trust-Punkte */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/70">
              {[
                { de:"1:1 Coaching", en:"1:1 coaching" },
                { de:"0 € Setupkosten", en:"€0 setup fees" },
                { de:"Faire Splits", en:"Fair splits" },
                { de:"Diskrete Betreuung", en:"Discreet support" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" style={{ color: ACCENT }} />
                  <span><Tr lang={lang} de={t.de} en={t.en} /></span>
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
                  <span className="ml-3 text-white/60"><Tr lang={lang} de="Creator Dashboard — 90 Tage" en="Creator dashboard — 90 days" /></span>
                </div>
                <span className="inline-flex items-center gap-1"><LineChart className="size-3" /> +38% / 30D</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60"><Tr lang={lang} de="Monatsumsatz" en="Monthly revenue" /></div>
                    <div className="mt-1 text-lg font-semibold">€12.4k</div>
                    <div className="text-[10px] text-emerald-400">+18% WoW</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60"><Tr lang={lang} de="Neue Subs" en="New subs" /></div>
                    <div className="mt-1 text-lg font-semibold">+427</div>
                    <div className="text-[10px] text-emerald-400">+22% WoW</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-white/60"><Tr lang={lang} de="PPV Umsatz" en="PPV revenue" /></div>
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
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          <Tr lang={lang} de="Warum wir besser sind" en="Why we’re better" />
        </h2>
        <p className="text-white/75 max-w-2xl mb-6">
          <Tr lang={lang}
              de="Mehrwert speziell für Adult-Creatorinnen – mit Betreuung, Tools und Deals."
              en="Value built for adult creators — with guidance, tools and deals." />
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold">
                  <Tr lang={lang} de="Exklusive Deals (OnlyFans, MALOUM)" en="Exclusive deals (OnlyFans, MALOUM)" />
                  <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                    <Tr lang={lang} de="EXKLUSIV" en="EXCLUSIVE" />
                  </span>
                </p>
                <p className="text-white/75 text-sm">
                  <Tr lang={lang}
                      de="Bessere Konditionen, Promo-Slots & Early-Access-Features."
                      en="Better terms, promo slots & early access features." />
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold"><Tr lang={lang} de="Proaktive Betreuung" en="Proactive support" /></p>
                <p className="text-white/75 text-sm"><Tr lang={lang} de="1:1-Guidance, klare To-dos & wöchentliche Check-ins." en="1:1 guidance, clear to-dos & weekly check-ins." /></p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold"><Tr lang={lang} de="Transparente Splits" en="Transparent splits" /></p>
                <p className="text-white/75 text-sm"><Tr lang={lang} de="Volle Einsicht in KPIs & Maßnahmen – ohne Kleingedrucktes." en="Full KPI & actions visibility — no fine print." /></p>
              </div>
            </li>
          </ul>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold"><Tr lang={lang} de="Skalierbare Tools" en="Scalable tools" /></p>
                <p className="text-white/75 text-sm"><Tr lang={lang} de="Content-Planung, Funnel & A/B-Tests, die Umsatz hebeln." en="Planning, funnels & A/B tests that move revenue." /></p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
              <div>
                <p className="font-semibold"><Tr lang={lang} de="Starkes Netzwerk" en="Strong network" /></p>
                <p className="text-white/75 text-sm"><Tr lang={lang} de="Studios, UGC-Teams & Plattformen für bessere CPMs." en="Studios, UGC teams & platforms for better CPMs." /></p>
              </div>
            </li>
          </ul>
        </div>
      </Section>

      {/* LEISTUNGEN */}
      <Section id="leistungen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          <Tr lang={lang} de="Leistungen für Adult-Creatorinnen" en="Services for adult creators" />
        </h2>
        <p className="text-white/75 max-w-2xl mb-6">
          <Tr lang={lang} de="Fokus auf Plattform-Konversion, DM-Monetarisierung & Markenschutz." en="Focused on platform conversion, DM monetization & brand protection." />
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <LineChart className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1"><Tr lang={lang} de="OnlyFans/Fansly Growth" en="OnlyFans/Fansly growth" /></h3>
            <p className="text-sm text-white/80"><Tr lang={lang} de="Pricing, Bundles, Promotions & KPI-Dashboards für Subs, Tipps & PPV." en="Pricing, bundles, promos & KPI dashboards for subs, tips & PPV." /></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <Users className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1"><Tr lang={lang} de="DM & PPV Playbooks" en="DM & PPV playbooks" /></h3>
            <p className="text-sm text-white/80"><Tr lang={lang} de="Mass-DM-Vorlagen, Upsell-Leitfäden, Chat-Flows & Kauf-Trigger – ohne Spam." en="Mass-DM templates, upsell guides, chat flows & purchase triggers — without spam." /></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <ShieldCheck className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1"><Tr lang={lang} de="Boundaries & Consent" en="Boundaries & consent" /></h3>
            <p className="text-sm text-white/80"><Tr lang={lang} de="Klare Content-Grenzen, Einwilligungen & Prozesse – respektvoll, sicher." en="Clear content boundaries, consents & processes — respectful, safe." /></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <ShieldCheck className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1"><Tr lang={lang} de="Content-Schutz (DMCA)" en="Content protection (DMCA)" /></h3>
            <p className="text-sm text-white/80"><Tr lang={lang} de="Wasserzeichen, Monitoring & Takedowns, damit nichts unkontrolliert kursiert." en="Watermarks, monitoring & takedowns to prevent uncontrolled leaks." /></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <Handshake className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1"><Tr lang={lang} de="Diskretion & Privatsphäre" en="Discretion & privacy" /></h3>
            <p className="text-sm text-white/80"><Tr lang={lang} de="DSGVO-konforme Abläufe, Alias-Strategien & sensible Kommunikation." en="GDPR-compliant workflows, alias strategies & sensitive comms." /></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="size-10 rounded-xl grid place-items-center mb-2" style={{ background: ACCENT + "1a" }}>
              <EyeOff className="size-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="font-semibold mb-1">
              <Tr lang={lang} de="Hybrid Models (ohne Gesicht)" en="Hybrid models (faceless)" />
              <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                <Tr lang={lang} de="EXKLUSIV" en="EXCLUSIVE" />
              </span>
            </h3>
            <p className="text-sm text-white/80">
              <Tr lang={lang}
                  de={<>Anonym bleiben &amp; trotzdem Umsatz? KI-unterstützte Workflows für eine <em>synthetische Persona</em>, passende Formate &amp; sichere Prozesse – plattform-konform.</>}
                  en={<>Stay anonymous &amp; still monetize? AI-assisted workflows for a <em>synthetic persona</em>, formats that fit &amp; safe, platform-compliant processes.</>}
              />
            </p>
          </div>
        </div>
      </Section>

      {/* PROZESS */}
      <Section id="prozess" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          <Tr lang={lang} de="So läuft unsere Zusammenarbeit" en="How we work together" />
        </h2>
        <p className="text-white/75 max-w-2xl mb-6">
          <Tr lang={lang} de="Vom ersten Hallo bis zum 90-Tage-Plan." en="From first hello to a 90-day plan." />
        </p>

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
              { Icon: PhoneCall, de: ["Kontaktaufnahme","Schreib kurz, wer du bist & wo du stehst – Antwort in 24h."], en: ["Get in touch","Tell us who you are & where you are — reply within 24h."] },
              { Icon: Users, de: ["Erstgespräch","Kennenlernen, Ziele, Fragen. Unverbindlich & kostenlos."], en: ["Intro call","Goals & questions. No strings attached."] },
              { Icon: ClipboardList, de: ["Bedarfsanalyse","Audit: Plattform, Content, Kanäle, Pricing & Prozesse."], en: ["Needs analysis","Audit: platform, content, channels, pricing & processes."] },
              { Icon: Target, de: ["Wünsche & Ziele","Ziele + Content-Grenzen (Boundaries) sauber festlegen."], en: ["Wishes & goals","Set goals & content boundaries cleanly."] },
              { Icon: Rocket, de: ["Aktionsplan","90-Tage-Plan mit To-dos, Verantwortlichkeiten & KPIs."], en: ["Action plan","90-day plan with to-dos, owners & KPIs."] },
              { Icon: Handshake, de: ["Zusammenarbeit","Transparente Splits, wöchentliche Iteration, nachhaltiges Wachstum."], en: ["Collaboration","Transparent splits, weekly iteration, sustainable growth."] },
            ].map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduce ? 0.001 : 0.4, delay: reduce ? 0 : i * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[3px] top-1 size-3 rounded-full" style={{ background: ACCENT }} />
                <div className="flex items-center gap-2 mb-1">
                  <s.Icon className="size-4" style={{ color: ACCENT }} />
                  <h4 className="font-semibold"><Tr lang={lang} de={s.de[0]} en={s.en[0]} /></h4>
                </div>
                <p className="text-white/75 text-sm"><Tr lang={lang} de={s.de[1]} en={s.en[1]} /></p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      {/* REFERENZEN */}
      <Section id="referenzen" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2"><Tr lang={lang} de="Referenzen" en="References" /></h2>
        <p className="text-white/75 max-w-2xl mb-6">
          <Tr lang={lang} de="Echte Stimmen aus unserer Creator-Base – diskret & auf den Punkt." en="Real voices from our creator base — discreet & to the point." />
        </p>

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
              <p className="mt-3 text-white/80 text-sm">
                “<Tr lang={lang} de={t.text_de} en={t.text_en} />”
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* VERGLEICH */}
      <Section id="vergleich" className="py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2"><Tr lang={lang} de="Creator-Base vs. andere Agenturen" en="Creator-Base vs other agencies" /></h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm md:text-base border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-white/70">
                <th className="py-3 px-4"><Tr lang={lang} de="Kriterium" en="Criterion" /></th>
                <th className="py-3 px-4">Creator-Base</th>
                <th className="py-3 px-4"><Tr lang={lang} de="Andere" en="Others" /></th>
              </tr>
            </thead>
            <tbody>
              {[
                { de: ["Betreuung","1:1 & proaktiv","Reaktiv, seltene Calls"], en:["Support","1:1 & proactive","Reactive, rare calls"] },
                { de: ["Transparenz","Klare Splits + KPIs","Unklare Verträge"], en:["Transparency","Clear splits + KPIs","Opaque contracts"] },
                { de: ["Wachstum","Funnel, A/B-Tests, Plan","Ad-hoc Posts"], en:["Growth","Funnels, A/B tests, plan","Ad-hoc posting"] },
                { de: ["Netzwerk","Studios/Plattformen","Einzeln"], en:["Network","Studios/platforms","Solo"] },
              ].map((row, i) => (
                <tr key={i} className="align-top">
                  <td className="py-3 px-4 text-white/80"><Tr lang={lang} de={row.de[0]} en={row.en[0]} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-1 size-4" style={{ color: ACCENT }} />
                      <span className="text-white"><Tr lang={lang} de={row.de[1]} en={row.en[1]} /></span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/60"><Tr lang={lang} de={row.de[2]} en={row.en[2]} /></td>
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
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              <Tr lang={lang} de="Kostenloses Erstgespräch sichern" en="Secure a free discovery call" />
            </h2>
            <p className="mt-2 text-white/75 max-w-prose">
              <Tr lang={lang} de="Erzähl uns kurz von dir – wir melden uns innerhalb von 24 Stunden." en="Tell us a bit about you — we’ll reply within 24 hours." />
            </p>
            <ul className="mt-5 space-y-2 text-white/75 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> <Tr lang={lang} de="DSGVO-konform" en="GDPR-compliant" /></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> <Tr lang={lang} de="Keine Setup-Kosten" en="No setup fees" /></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: ACCENT }} /> <Tr lang={lang} de="Unverbindlich & ehrlich" en="No obligation & honest" /></li>
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
                <label className="text-sm text-white/80"><Tr lang={lang} de="Dein Name" en="Your name" /></label>
                <input name="name" required placeholder={lang === "de" ? "Vor- und Nachname" : "First & last name"}
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">E-Mail</label>
                <input type="email" name="email" required placeholder="name@mail.com"
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80"><Tr lang={lang} de="Kurz zu dir" en="Tell us about you" /></label>
                <textarea name="message" rows={4} placeholder={lang === "de" ? "Wo stehst du? Welche Ziele hast du?" : "Where are you now? What are your goals?"}
                  className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded" style={{ background: ACCENT }}>
                <Tr lang={lang} de="Anfrage senden" en="Send request" />
              </button>
            </div>
          </form>
        </div>
      </Section>

      {/* ==== Plattform Match Modal (2 Steps + KI-Loader) ==== */}
      {matchOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={closeMatch} />
          {/* Scroll-Container (Mobile fix) */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="min-h-full flex items-start md:items-center justify-center p-4">
              <div className="mx-4 md:mx-0 rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl overflow-hidden w-full md:w-[880px] max-h-[calc(100dvh-2rem)] flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/60">Creator-Base</div>
                    <div className="text-lg font-semibold"><Tr lang={lang} de="Plattform Match" en="Platform Match" /></div>
                  </div>
                  <button onClick={closeMatch} className="text-white/70 hover:text-white flex items-center gap-1">
                    <XCircle className="size-5" /> <Tr lang={lang} de="Schließen" en="Close" />
                  </button>
                </div>

                {/* Progress */}
                <div className="px-5 py-2">
                  <div className="h-1 w-full bg-white/10 rounded">
                    <div className="h-1 rounded" style={{ width: progressWidth, background:ACCENT }} />
                  </div>
                  <div className="mt-2 text-xs text-white/60">{progressLabel}</div>
                </div>

                {/* Content scroll area */}
                <div className="px-5 pb-2 overflow-y-auto">
                  {/* STEP 1 (Form) */}
                  {matchStep === 1 && !matchLoading && (
                    <form onSubmit={submitPlatformMatch} className="grid gap-4 pb-24">
                      {/* KI-Intro */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-white/60"><Tr lang={lang} de="KI-gestützt" en="AI-assisted" /></div>
                        <div className="text-lg font-semibold mt-1">
                          <Tr lang={lang} de="Schreib uns kurz, was dir wichtig ist" en="Tell us briefly what matters to you" />
                        </div>
                        <p className="text-white/70 text-sm mt-1">
                          {lang === "de"
                            ? "z. B.: „Ich will anonym bleiben, 3–4k/Monat, Fokus auf Abos & PayPal, DACH-Zielgruppe.“"
                            : `e.g.: “I want to stay anonymous, €3–4k/mo, subs & PayPal focus, DACH audience.”`}
                        </p>
                        <textarea
                          value={pcForm.intro}
                          onChange={(e)=>setPcForm(v=>({...v, intro:e.target.value}))}
                          rows={3}
                          placeholder={lang === "de" ? "Deine Prioritäten (Anonymität, Zielumsatz, Plattform-Vorlieben, Region …)" : "Your priorities (anonymity, target revenue, platform prefs, region …)"}
                          className="w-full mt-3 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                        />
                        <p className="text-white/60 text-xs mt-2">
                          <Tr lang={lang} de="Unsere KI liefert dir gleich" en="Our AI will provide" />{" "}
                          <span className="font-semibold">3</span>{" "}
                          <Tr lang={lang} de="Empfehlungen – passend zu deinen Zielen." en="recommendations — tailored to your goals." />
                        </p>
                      </div>

                      {/* Kurze Auswahlfragen */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-white/80"><Tr lang={lang} de="Content-Fokus" en="Content focus" /></label>
                          <select
                            value={pcForm.focus}
                            onChange={e=>setPcForm(v=>({...v, focus:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20"
                          >
                            <option value="soft"><Tr lang={lang} de="Soft / Teasing" en="Soft / teasing" /></option>
                            <option value="erotik"><Tr lang={lang} de="Erotik" en="Erotic" /></option>
                            <option value="explicit"><Tr lang={lang} de="Explizit" en="Explicit" /></option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-white/80"><Tr lang={lang} de="Anonym bleiben?" en="Stay anonymous?" /></label>
                          <select
                            value={pcForm.anon ? "yes" : "no"}
                            onChange={e=>setPcForm(v=>({...v, anon: e.target.value === "yes"}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20"
                          >
                            <option value="no"><Tr lang={lang} de="Nein" en="No" /></option>
                            <option value="yes"><Tr lang={lang} de="Ja" en="Yes" /></option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-white/80"><Tr lang={lang} de="Primäres Ziel" en="Primary goal" /></label>
                          <select
                            value={pcForm.goal}
                            onChange={e=>setPcForm(v=>({...v, goal:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20"
                          >
                            <option value="subs"><Tr lang={lang} de="Abos / Stammkundschaft" en="Subscriptions / loyal base" /></option>
                            <option value="ppv"><Tr lang={lang} de="PPV & DMs" en="PPV & DMs" /></option>
                            <option value="discover"><Tr lang={lang} de="Reichweite" en="Discovery / reach" /></option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-white/80"><Tr lang={lang} de="Ziel-Region" en="Target region" /></label>
                          <select
                            value={pcForm.region}
                            onChange={e=>setPcForm(v=>({...v, region:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20"
                          >
                            <option value="global"><Tr lang={lang} de="Global" en="Global" /></option>
                            <option value="dach"><Tr lang={lang} de="DACH" en="DACH" /></option>
                            <option value="us"><Tr lang={lang} de="USA-lastig" en="US-heavy" /></option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-white/80"><Tr lang={lang} de="Zahlungs-Präferenz" en="Payout preference" /></label>
                          <select
                            value={pcForm.payout}
                            onChange={e=>setPcForm(v=>({...v, payout:e.target.value}))}
                            className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20"
                          >
                            <option value="paypal"><Tr lang={lang} de="PayPal bevorzugt" en="Prefer PayPal" /></option>
                            <option value="fast"><Tr lang={lang} de="Schnelle Auszahlung" en="Fast payout" /></option>
                            <option value="highcut"><Tr lang={lang} de="Hoher %-Anteil" en="High revenue share" /></option>
                          </select>
                        </div>
                      </div>

                      {/* Wichtigkeiten (Slider) */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="text-sm font-semibold mb-3">
                          <Tr lang={lang} de="Was ist dir wie wichtig?" en="How important is each factor?" />
                        </div>

                        {[
                          { key:"wAnon", label_de:"Anonymität", label_en:"Anonymity" },
                          { key:"wMonet", label_de:"Monetarisierung (Subs/PPV)", label_en:"Monetization (subs/PPV)" },
                          { key:"wDiscover", label_de:"Reichweite / Discoverability", label_en:"Reach / discoverability" },
                          { key:"wRegion", label_de:"Regionale Passung", label_en:"Regional fit" },
                          { key:"wPayout", label_de:"Auszahlung / Payment", label_en:"Payout / payment" },
                        ].map((s) => (
                          <div key={s.key} className="mb-4">
                            <div className="flex items-center justify-between text-sm text-white/80">
                              <span><Tr lang={lang} de={s.label_de} en={s.label_en} /></span>
                              <span className="text-white/60">{pcForm[s.key]}%</span>
                            </div>
                            <input
                              type="range" min={0} max={100} step={5}
                              value={pcForm[s.key]}
                              onChange={(e)=>setPcForm(v=>({...v, [s.key]: Number(e.target.value)}))}
                              className="w-full mt-2 accent-pink-400"
                            />
                          </div>
                        ))}
                        <p className="text-xs text-white/60">
                          <Tr lang={lang}
                              de="Tipp: Wenn Anonymität dir egal ist, stell den Regler auf 0%."
                              en="Hint: If anonymity doesn’t matter, set that slider to 0%." />
                        </p>
                      </div>
                    </form>
                  )}

                  {/* KI-Ladezustand */}
                  {matchStep === 1 && matchLoading && (
                    <div className="py-14 flex flex-col items-center text-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white/20 animate-spin"
                        style={{ borderTopColor: ACCENT }}
                        aria-label="KI denkt…"
                      />
                      <div className="text-white/80 font-medium">
                        <Tr lang={lang} de="Unsere KI denkt…" en="Our AI is thinking…" />
                      </div>
                      <div className="text-white/60 text-sm">
                        <Tr lang={lang} de="Analysiert deine Prioritäten und erstellt das Ranking." en="Analyzing your priorities and building the ranking." />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 – Ergebnis */}
                  {matchStep === 2 && matchResult && (
                    <div className="pb-24">
                      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                        <Tr lang={lang}
                            de="Hinweis: Viele deutsche Fans bevorzugen PayPal – wegen einfacher, diskreter Zahlung."
                            en="Note: Many German fans prefer PayPal — simple and discreet." />
                      </div>

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
                                <div className="text-white/70 text-sm">
                                  <Tr lang={lang} de="Score" en="Score" /> {p.score.toFixed(1)} / 10
                                </div>
                              </div>
                              {p.name === "MALOUM" && (
                                <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: ACCENT + "26", color: ACCENT }}>
                                  <Tr lang={lang} de="Unsere Empfehlung" en="Our pick" />
                                </span>
                              )}
                            </div>
                            <div className="mt-3">
                              <div className="text-white/70 text-sm mb-1"><Tr lang={lang} de="Features" en="Features" /></div>
                              <ul className="space-y-2">
                                {FEATURES.map(f => {
                                  const v = PROFILE[p.name]?.[f.key];
                                  return (
                                    <li key={f.key} className="flex items-center justify-between">
                                      <span className="text-white/80"><Tr lang={lang} de={f.label_de} en={f.label_en} /></span>
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
                        <div className="text-lg font-semibold">
                          <Tr lang={lang} de="Warum MALOUM die richtige Empfehlung ist" en="Why MALOUM is the right pick" />
                        </div>
                        <div className="text-white/70 text-sm">
                          <Tr lang={lang} de="Basierend auf deinen Prioritäten:" en="Based on your priorities:" />
                        </div>
                        <ul className="mt-3 space-y-2 text-white/90">
                          {(() => {
                            const mc = matchContext;
                            if (!mc) return null;
                            const pts = [];
                            if (mc.anon) pts.push(lang==="de"
                              ? "Du willst anonym bleiben – MALOUM unterstützt Hybrid-Modelle & Pseudonyme sehr gut."
                              : "You want to stay anonymous — MALOUM supports hybrid models & pseudonyms very well.");
                            if (mc.goal === "subs" || mc.goal === "ppv") pts.push(lang==="de"
                              ? "Fokus auf Abos & PPV – planbare Bundles und stabile Monetarisierung."
                              : "Focus on subs & PPV — predictable bundles and stable monetization.");
                            if (mc.payout === "paypal" || mc.region === "dach") pts.push(lang==="de"
                              ? "Auszahlungen via PayPal – schnell & unkompliziert (beliebt bei DE-Fans)."
                              : "PayPal payouts — fast & simple (popular with DE fans).");
                            if (mc.region === "dach") pts.push(lang==="de"
                              ? "Datenschutz & Support – DSGVO-orientierte Prozesse, DE-Support."
                              : "Privacy & support — GDPR-minded processes, German support.");
                            if (pts.length === 0) pts.push(lang==="de"
                              ? "Solider Allround-Fit für planbares Wachstum und saubere Prozesse."
                              : "Solid all-round fit for predictable growth and clean processes.");
                            return pts.map((t, i) => <li key={i}>• {t}</li>);
                          })()}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Actionbar (mobile safe) */}
                {!matchLoading && (
                  <div className="mt-auto border-t border-white/10 bg-[#0f0f14]/95 backdrop-blur px-5 py-3 sticky bottom-0">
                    <div className="flex items-center justify-end gap-2">
                      {matchStep === 1 && (
                        <>
                          <button onClick={closeMatch} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                            <Tr lang={lang} de="Schließen" en="Close" />
                          </button>
                          <button onClick={submitPlatformMatch} className="px-4 py-2 rounded inline-flex items-center gap-1" style={{ background: ACCENT }}>
                            <Tr lang={lang} de="Auswerten" en="Evaluate" /> <ChevronRight className="size-4" />
                          </button>
                        </>
                      )}
                      {matchStep === 2 && (
                        <>
                          <button onClick={()=>{ setMatchStep(1); setMatchLoading(false); }} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                            <Tr lang={lang} de="Zurück" en="Back" />
                          </button>
                          <button onClick={closeMatch} className="px-4 py-2 rounded bg-white/10 border border-white/20">
                            <Tr lang={lang} de="Schließen" en="Close" />
                          </button>
                        </>
                      )}
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
