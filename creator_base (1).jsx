"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ClipboardList,
  Target,
  Rocket,
  Handshake,
  Users,
  ShieldCheck,
  LineChart,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const ACCENT = "#f464b0";
const ACCENT_RGB = "244, 100, 176";

const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className}`}>
    {children}
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm bg-white/5 border-white/10 backdrop-blur">
    {children}
  </span>
);

const Feature = React.memo(({ icon: Icon, title, children }) => (
  <Card className="bg-white/5 border-white/10 text-white">
    <CardHeader className="space-y-2">
      <div className="size-10 rounded-xl grid place-items-center" style={{ background: ACCENT + "1a" }}>
        <Icon className="size-5" style={{ color: ACCENT }} />
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-white/80 leading-relaxed">{children}</CardContent>
  </Card>
));

export default function CreatorBaseLanding() {
  const reduce = useReducedMotion();

  return (
    <>
      <div className="min-h-screen text-white bg-[#0b0b0f] selection:bg-pink-300/30 selection:text-white">
        {/* BG */}
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
              <div className="size-8 rounded-lg grid place-items-center font-bold" style={{ background: ACCENT }}>
                CB
              </div>
              <span className="font-semibold tracking-tight">Creator-Base</span>
              <Badge className="ml-2 border border-white/15 text-white/70">Agency</Badge>
              <Badge className="ml-2 border border-white/15 text-white/70">18+</Badge>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-white/80">
              <a href="#vorteile" className="hover:text-white">Vorteile</a>
              <a href="#leistungen" className="hover:text-white">Leistungen</a>
              <a href="#prozess" className="hover:text-white">Prozess</a>
              <a href="#vergleich" className="hover:text-white">Vergleich</a>
            </nav>
            <div className="flex items-center gap-2">
              <Button className="hidden md:inline-flex" style={{ background: ACCENT }} asChild>
                <a href="#kontakt">Kostenloses Erstgespräch</a>
              </Button>
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

              {/* Claim */}
              <div className="mt-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
  Wir bieten{" "}
  <span
    className="rounded px-2 -mx-1 ring-1 ring-white/10"
    style={{ backgroundColor: "rgba(244, 100, 176, 0.45)" }}
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
                <Button className="gap-2 px-5 py-3 rounded-xl" style={{ background: ACCENT }} asChild>
                  <a href="#kontakt">Call buchen <ArrowRight className="size-5" /></a>
                </Button>
                <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20" asChild>
                  <a href="#prozess">So arbeiten wir</a>
                </Button>
              </div>

              {/* Trust-Punkte – nur 1× */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/70">
                {["1:1 Coaching", "0 € Setupkosten", "Faire Splits", "Diskrete Betreuung"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" style={{ color: ACCENT }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0.001 : 0.55, delay: reduce ? 0 : 0.05 }}
              className="relative md:mt-10 lg:mt-16 xl:mt-20"
            >
              <div className="rounded-3xl">
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
              </div>
            </motion.div>
          </div>
        </Section>

        {/* VORTEILE */}
        <Section id="vorteile" className="py-6 md:py-12">
          <div className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Warum wir besser sind</h2>
            <p className="mt-2 text-white/75 max-w-2xl">
              Wir bieten echten Mehrwert <span className="font-semibold">speziell für Adult-Creatorinnen</span> – mit Betreuung, Tools und Deals, die dich auf OnlyFans, Fansly & Co. wirklich weiterbringen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.ul initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} className="space-y-4">
              <motion.li className="flex items-start gap-3" initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: reduce ? 0.001 : 0.4 }}>
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">
                    Exklusive Deals mit Major-Plattformen
                    <span className="ml-2 align-middle inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: ACCENT + "26", color: ACCENT }}>
                      EXKLUSIV
                    </span>
                  </p>
                  <p className="text-white/75 text-sm"><strong>OnlyFans</strong> & <strong>MALOUM</strong> — bessere Konditionen, Promo-Slots & Early-Access-Features.</p>
                </div>
              </motion.li>
              <motion.li className="flex items-start gap-3" initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: reduce ? 0.001 : 0.45 }}>
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">Proaktive Betreuung</p>
                  <p className="text-white/75 text-sm">Individuelle 1:1-Guidance statt Massenabfertigung. Klare To-dos & wöchentliche Check-ins.</p>
                </div>
              </motion.li>
              <motion.li className="flex items-start gap-3" initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: reduce ? 0.001 : 0.5 }}>
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">Transparente Splits</p>
                  <p className="text-white/75 text-sm">Faire Beteiligungen ohne Kleingedrucktes. Volle Einsicht in KPIs & Maßnahmen.</p>
                </div>
              </motion.li>
            </motion.ul>

            <motion.ul initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} className="space-y-4">
              <motion.li className="flex items-start gap-3" initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: reduce ? 0.001 : 0.5 }}>
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">Skalierbare Tools</p>
                  <p className="text-white/75 text-sm">Content-Planung, Funnel & A/B-Tests, die deinen Umsatz hebeln.</p>
                </div>
              </motion.li>
              <motion.li className="flex items-start gap-3" initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: reduce ? 0.001 : 0.55 }}>
                <CheckCircle2 className="mt-0.5 size-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-semibold">Starkes Netzwerk</p>
                  <p className="text-white/75 text-sm">Deals mit Studios, UGC-Teams & Plattformen für bessere CPMs & Reichweite.</p>
                </div>
              </motion.li>
            </motion.ul>
          </div>
        </Section>

        {/* LEISTUNGEN */}
        <Section id="leistungen" className="py-6 md:py-12">
          <div className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Leistungen für Adult-Creatorinnen</h2>
            <p className="mt-2 text-white/75 max-w-2xl">Fokus auf Plattform-Konversion, DM-Monetarisierung und Schutz deiner Marke.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Feature icon={LineChart} title="OnlyFans/Fansly Growth">Pricing-Strategie, Bundles, Promotions & KPI-Dashboards, die Subscriptions, Tipps und PPV steigern.</Feature>
            <Feature icon={Users} title="DM & PPV Playbooks">Vorlagen für Mass-DMs, Upsell-Leitfäden, Chat-Flows und Kauftrigger – ohne Spam.</Feature>
            <Feature icon={ShieldCheck} title="Boundaries & Consent">Klare Content-Grenzen, Einwilligungen & Prozesse – respektvoll, sicher und professionell.</Feature>
            <Feature icon={ShieldCheck} title="Content-Schutz (DMCA)">Wasserzeichen, Monitoring & Takedown-Support, damit dein Material nicht unkontrolliert kursiert.</Feature>
            <Feature icon={Handshake} title="Diskretion & Privatsphäre">DSGVO-konforme Abläufe, diskrete Kommunikation, Alias-Strategien und sensible Terminplanung.</Feature>
            {/* Hybrid – EIN Block mit Badge */}
            <Feature
              icon={EyeOff}
              title={
                <span className="inline-flex items-center gap-2">
                  Hybrid Models (ohne Gesicht)
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: ACCENT + "26", color: ACCENT }}
                  >
                    EXKLUSIV
                  </span>
                </span>
              }
            >
              Du willst dein Gesicht nicht zeigen und trotzdem Umsatz machen?
              Wir zeigen dir KI-unterstützte Workflows für eine <em>synthetische Persona</em>,
              passende Content-Formate und sichere Prozesse – plattform-konform.
              <a href="#kontakt" className="underline"> Interesse? Call buchen</a>.
            </Feature>
          </div>
        </Section>

        {/* ÜBER UNS (ohne "Unser Angel") */}
        <Section id="about" className="py-8 md:py-14">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Über uns</h2>
            <p className="mt-2 text-white/80 text-sm md:text-base">
              Wir sind eine kleine, spezialisierte Agentur für Adult-Creatorinnen.<br />
              <strong>Unser USP:</strong> ehrlicher Support, klare Strukturen und echte Ergebnisse – ohne Druck, ohne Spielchen.
            </p>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="size-4" style={{ color: ACCENT }} />
                <h3 className="font-semibold">Was wir machen</h3>
              </div>
              <ul className="text-sm text-white/80 space-y-1.5 list-disc pl-5">
                <li>Pricing & Bundles, die kaufen lassen</li>
                <li>DM/PPV-Playbooks (keine Spam-Wall)</li>
                <li>Content-Plan, Launches & A/B-Tests</li>
                <li>Content-Schutz & Diskretion (DSGVO)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-4" style={{ color: ACCENT }} />
                <h3 className="font-semibold">Unsere Mission</h3>
              </div>
              <p className="text-sm text-white/80">
                Mehr Einnahmen – in deinen Grenzen. Du behältst die Kontrolle, wir liefern den Plan.
              </p>
            </div>
          </div>
        </Section>

        {/* PROZESS */}
        <Section id="prozess" className="py-6 md:py-12">
          <div className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">So läuft unsere Zusammenarbeit</h2>
            <p className="mt-2 text-white/75 max-w-2xl">Klare Schritte vom ersten Hallo bis zur gemeinsamen Skalierung.</p>
          </div>
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
                { Icon: PhoneCall, title: "Kontaktaufnahme", text: "Schreib uns kurz, wer du bist und wo du stehst – wir melden uns innerhalb von 24 Stunden." },
                { Icon: Users, title: "Erstgespräch", text: "Kennenlernen, Ziele besprechen, Fragen klären. Unverbindlich und kostenlos." },
                { Icon: ClipboardList, title: "Bedarfsanalyse", text: "Plattform-Audit (OnlyFans/Fansly/Clips), Content, Kanäle, Pricing & Prozesse – präzise statt pauschal." },
                { Icon: Target, title: "Wünsche & Ziele", text: "Gemeinsam definieren wir Ziele und Content-Grenzen (Boundaries), damit Wachstum und Wohlgefühl zusammenpassen." },
                { Icon: Rocket, title: "Aktionsplan", text: "Ein 90-Tage-Plan mit To-dos, Verantwortlichkeiten und KPIs – klar strukturiert." },
                { Icon: Handshake, title: "Zusammenarbeit", text: "Transparente Splits, klare Kommunikation, wöchentliche Iteration – für nachhaltiges Wachstum." },
              ].map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: reduce ? 0.001 : 0.4, delay: reduce ? 0 : i * 0.05 }}
                  className="relative"
                >
                  <motion.span
                    className="absolute -left-[3px] top-1 size-3 rounded-full"
                    style={{ background: ACCENT }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: reduce ? "tween" : "spring", stiffness: 220, damping: 18, duration: reduce ? 0.001 : undefined, delay: reduce ? 0 : i * 0.05 }}
                  />
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

        {/* VERGLEICH */}
        <Section id="vergleich" className="py-6 md:py-12">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Creator-Base vs. andere Agenturen</h2>
            <p className="mt-2 text-white/75">Was uns unterscheidet – auf einen Blick.</p>
          </div>
          <div className="overflow-x-auto">
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
                  { k: "Betreuung", a: "1:1-Coaching, wöchentliche Check-ins, proaktives Mentoring", b: "Reaktiver Support, seltene Calls" },
                  { k: "Transparenz", a: "Klare Splits, Einblick in KPIs & Maßnahmen", b: "Unklare Verträge, wenig Reporting" },
                  { k: "Wachstum", a: "A/B-Tests, Funnel, Content-Plan, Paid-Boosts", b: "Ad-hoc Posts ohne Plan" },
                  { k: "Netzwerk", a: "Deals mit Studios/Plattformen, Creator-Community", b: "Einzeln, wenig Synergien" },
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

        {/* CONTACT */}
        <Section id="kontakt" className="py-8 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Kostenloses Erstgespräch sichern</h2>
              <p className="mt-2 text-white/75 max-w-prose">Erzähl uns kurz von dir – wir melden uns innerhalb von 24 Stunden mit Terminvorschlägen.</p>
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
                  <Input required placeholder="Vor- und Nachname" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                </div>
                <div>
                  <label className="text-sm text-white/80">E-Mail oder Telegram</label>
                  <Input required placeholder="z. B. name@mail.com oder @handle" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                </div>
                <div>
                  <label className="text-sm text-white/80">Kurz zu dir</label>
                  <Textarea rows={4} placeholder="Wo stehst du? Welche Ziele hast du?" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                </div>
                <Button type="submit" className="w-full" style={{ background: ACCENT }}>Anfrage senden</Button>
              </div>
            </form>
          </div>
        </Section>

        {/* CTA BAR */}
        <div className="sticky bottom-3 mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-3 flex items-center justify-between">
            <div className="text-sm md:text-base">
              Bereit für mehr <span className="font-semibold" style={{ color: ACCENT }}>Wert</span> im Adult-Business? – Lass uns sprechen.
            </div>
            <Button className="ml-3" style={{ background: ACCENT }} asChild>
              <a href="#kontakt">Erstgespräch</a>
            </Button>
          </div>
        </div>

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
      </div>
    </>
  );
}
