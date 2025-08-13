"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, PhoneCall, ClipboardList,
  Target, Rocket, Handshake, Users, ShieldCheck, LineChart, EyeOff
} from "lucide-react";

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

export default function Page() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* weicher Hintergrund-Glow */}
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
            <a href="#prozess" className="hover:text-white">Prozess</a>
            <a href="#vergleich" className="hover:text-white">Vergleich</a>
          </nav>
          <a
            href="#kontakt"
            className="hidden md:inline-flex rounded-lg px-4 py-2"
            style={{ background: ACCENT }}
          >
            Kostenloses Erstgespräch
          </a>
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

            {/* Claim */}
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
              <a href="#prozess" className="px-5 py-3 rounded-xl inline-flex items-center bg-white/10 border border-white/20 hover:bg-white/20">
                So arbeiten wir
              </a>
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

          {/* Right: kompakte „Dashboard“-Karte */}
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

      {/* PROZESS (kurze Timeline) */}
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

      {/* VERGLEICH (kurz) */}
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
          <form onSubmit={(e) => { e.preventDefault(); alert("Danke! Wir melden uns in Kürze."); }} className="p-6 rounded-2xl border bg-white/5 border-white/10 backdrop-blur">
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-white/80">Dein Name</label>
                <input required placeholder="Vor- und Nachname" className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">E-Mail oder Telegram</label>
                <input required placeholder="z. B. name@mail.com oder @handle" className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <div>
                <label className="text-sm text-white/80">Kurz zu dir</label>
                <textarea rows={4} placeholder="Wo stehst du? Welche Ziele hast du?" className="w-full mt-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50" />
              </div>
              <button type="submit" className="w-full px-4 py-3 rounded" style={{ background: ACCENT }}>Anfrage senden</button>
            </div>
          </form>
        </div>
      </Section>

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
