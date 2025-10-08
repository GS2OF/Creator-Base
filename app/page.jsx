import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

// Light UI with dual accent (Microsoft blue + spicy magenta)
const BRAND = {
  surface: "#ffffff",
  soft: "#f6f7fb",
  text: "#0b1220",
  subtext: "#5b6473",
  accent: "#0c5bd8", // Microsoft‑Blau
  spice: "#d81b60", // warmes Magenta
};

function Section({ children, className = "" }) {
  return <section className={`max-w-7xl mx-auto px-4 md:px-6 ${className}`}>{children}</section>;
}

function TopNav() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-black/5">
      <Section className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--accent)]/10 flex items-center justify-center" style={{ "--accent": BRAND.accent }}>
            <span className="text-xs font-semibold" style={{ color: BRAND.accent }}>CB</span>
          </div>
          <span className="font-medium tracking-tight" style={{ color: BRAND.text }}>Creator Base</span>
          <Badge variant="outline" className="ml-2">Beta</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">Login</Button>
          <Button size="sm" style={{ background: `linear-gradient(90deg, ${BRAND.spice}, ${BRAND.accent})`, color: "white" }}>
            Creator anmelden
          </Button>
        </div>
      </Section>
    </div>
  );
}

function TrustBar() {
  return (
    <Section className="pb-6 -mt-4">
      <div className="flex flex-wrap items-center justify-center gap-6 opacity-70 text-sm">
        <span>Vertraut von</span>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-5" alt="Amazon" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-5" alt="Microsoft" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Spotify_logo_with_text.svg" className="h-5" alt="Spotify" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Adobe_Systems_logo_and_wordmark.svg" className="h-5" alt="Adobe" />
      </div>
    </Section>
  );
}

function HeroProfiles() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(1200px 500px at -10% -20%, ${BRAND.spice}22 0%, #ffffff 45%),
                         radial-gradient(1100px 420px at 110% -10%, ${BRAND.accent}26 0%, #ffffff 55%),
                         linear-gradient(180deg,#fbfcff 0%, #ffffff 70%)`,
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1551292831-023188e78222?q=80&w=1600&auto=format&fit=crop"
          alt="Abstract warm shapes"
          className="absolute inset-x-0 top-0 w-full h-[520px] object-cover opacity-[0.15]"
        />
      </div>

      <Section className="pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Badge style={{ background: BRAND.spice, color: "white" }}>18+</Badge>
              <Badge style={{ background: BRAND.accent, color: "white" }}>
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Finde deine Creator:innen
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: BRAND.text }}>
              Entdecke <span style={{ background: `linear-gradient(90deg, ${BRAND.spice}, ${BRAND.accent})`, WebkitBackgroundClip: "text", color: "transparent" }}>Spicy‑Profile</span>
            </h1>
            <p className="mt-4 text-lg" style={{ color: BRAND.subtext }}>
              Für Fans gebaut: Durchsuche verifizierte Profile, sieh alle Links an einem Ort und folge mit einem Klick.
            </p>
            <div className="mt-6 flex gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                style={{ background: `linear-gradient(90deg, ${BRAND.spice}, ${BRAND.accent})`, color: "white" }}
                className="gap-2"
                onClick={() => document.getElementById("profiles-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                Creator entdecken <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">Creator anmelden</Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] overflow-hidden shadow-xl border border-black/10">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
                alt="Profile mock"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </Section>
      <TrustBar />
    </div>
  );
}

// 15 Muster-Profile (SFW Demo‑Bilder)
const demoProfiles = [
  { id: "p1", handle: "@lena.makes", name: "Lena", bio: "Glamour & Reels · 18+ · EU based.", links: [
      { label: "OnlyFans", url: "https://onlyfans.com/lena", type: "primary" },
      { label: "Fansly", url: "https://fans.ly/lena" },
      { label: "X/Twitter", url: "https://x.com/lenamakes" },
    ], photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p2", handle: "@studio.kei", name: "Kei", bio: "Cosplay & Art · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/kei", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/kei" },
      { label: "Ko‑fi", url: "https://ko-fi.com/kei" },
    ], photos: [
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p3", handle: "@valerie.v", name: "Valerie", bio: "Fitness & Lifestyle · 18+.", links: [
      { label: "OnlyFans", url: "https://onlyfans.com/valerie", type: "primary" },
      { label: "Linktree", url: "https://linktr.ee/valeriev" },
      { label: "X/Twitter", url: "https://x.com/valeriev" },
    ], photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594737625785-c6683fc39b1a?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p4", handle: "@mira.cos", name: "Mira", bio: "Cosplay · PPV Bundles · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/mira", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/mira" },
      { label: "Insta", url: "https://instagram.com/mira.cos" },
    ], photos: [
      "https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p5", handle: "@diana.glow", name: "Diana", bio: "Glamour · Premium Chat · 18+.", links: [
      { label: "OnlyFans", url: "https://onlyfans.com/diana", type: "primary" },
      { label: "Fansly", url: "https://fans.ly/diana" },
      { label: "X/Twitter", url: "https://x.com/diana" },
    ], photos: [
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p6", handle: "@noah.films", name: "Noah", bio: "Cinemagraphs & Teaser · 18+.", links: [
      { label: "Linktree", url: "https://linktr.ee/noahfilms", type: "primary" },
      { label: "Fansly", url: "https://fans.ly/noah" },
      { label: "X/Twitter", url: "https://x.com/noah" },
    ], photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p7", handle: "@sofia.art", name: "Sofia", bio: "Fine Art · SFW Teaser · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/sofia", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/sofia" },
      { label: "Insta", url: "https://instagram.com/sofia.art" },
    ], photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p8", handle: "@ivy.spark", name: "Ivy", bio: "Alt/Goth · 18+.", links: [
      { label: "OnlyFans", url: "https://onlyfans.com/ivy", type: "primary" },
      { label: "X/Twitter", url: "https://x.com/ivy" },
      { label: "Insta", url: "https://instagram.com/ivy.spark" },
    ], photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p9", handle: "@ari.sun", name: "Ari", bio: "Beach & Travel · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/ari", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/ari" },
      { label: "X/Twitter", url: "https://x.com/arisun" },
    ], photos: [
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p10", handle: "@nina.fit", name: "Nina", bio: "Fitness & Coaching · 18+.", links: [
      { label: "Linktree", url: "https://linktr.ee/ninafit", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/nina" },
      { label: "Insta", url: "https://instagram.com/nina.fit" },
    ], photos: [
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p11", handle: "@zoe.cos", name: "Zoe", bio: "Cosplay & FX · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/zoe", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/zoe" },
      { label: "Insta", url: "https://instagram.com/zoe.cos" },
    ], photos: [
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p12", handle: "@mila.lens", name: "Mila", bio: "Photography/Model · 18+.", links: [
      { label: "OnlyFans", url: "https://onlyfans.com/mila", type: "primary" },
      { label: "X/Twitter", url: "https://x.com/mila" },
      { label: "Insta", url: "https://instagram.com/mila.lens" },
    ], photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p13", handle: "@jade.nyx", name: "Jade", bio: "Alt Fashion · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/jade", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/jade" },
      { label: "X/Twitter", url: "https://x.com/jade" },
    ], photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p14", handle: "@luca.wave", name: "Luca", bio: "Swim & Lifestyle · 18+.", links: [
      { label: "OnlyFans", url: "https://onlyfans.com/luca", type: "primary" },
      { label: "Linktree", url: "https://linktr.ee/lucawave" },
      { label: "Insta", url: "https://instagram.com/luca.wave" },
    ], photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=400&auto=format&fit=crop",
    ] },
  { id: "p15", handle: "@rhea.muse", name: "Rhea", bio: "Beauty & ASMR · 18+.", links: [
      { label: "Fansly", url: "https://fans.ly/rhea", type: "primary" },
      { label: "OnlyFans", url: "https://onlyfans.com/rhea" },
      { label: "X/Twitter", url: "https://x.com/rhea" },
    ], photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=400&auto=format&fit=crop",
    ] },
];

function ProfileCard({ p }) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={p.photos?.[0]} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
            <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-[2px] rounded-full text-white" style={{ background: BRAND.spice }}>
              18+
            </span>
          </div>
          <div>
            <CardTitle className="text-base" style={{ color: BRAND.text }}>
              {p.name} <span className="opacity-60 font-normal">{p.handle}</span>
            </CardTitle>
            <div className="text-xs" style={{ color: BRAND.subtext }}>
              {p.bio?.slice(0, 60)}{p.bio && p.bio.length > 60 ? "…" : ""}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {p.links?.slice(0, 3).map((l, idx) => (
            <a
              key={idx}
              href={l.url}
              target="_blank"
              rel="nofollow noopener"
              className={`text-xs px-2 py-1 rounded-full border ${l.type === "primary" ? "text-white border-0" : ""}`}
              style={l.type === "primary" ? { background: `linear-gradient(90deg, ${BRAND.spice}, ${BRAND.accent})` } : {}}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {p.photos?.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt={`${p.name} photo ${i + 1}`} className="w-full h-20 object-cover rounded-md" />
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="outline">Follow‑Links</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfilesGrid({ profiles }) {
  return (
    <Section id="profiles-grid" className="py-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-2xl font-bold" style={{ color: BRAND.text }}>Creator Profile (18+)</h2>
        <div className="text-sm" style={{ color: BRAND.subtext }}>Jede Seite: Linksammlung + bis zu 5 Fotos</div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {profiles.map((p) => <ProfileCard key={p.id} p={p} />)}
      </div>
    </Section>
  );
}

function CreatorSignupBanner(){
  return (
    <Section className="py-10">
      <Card className="rounded-3xl overflow-hidden border-0 shadow-sm" style={{background: `linear-gradient(135deg, ${BRAND.spice} 0%, ${BRAND.accent} 100%)`}}>
        <CardContent className="p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Creator:in? Sichere dir deinen Link‑Hub</h3>
          <p className="mt-2 text-white/90">Kostenlos anmelden, Profil anlegen, alle Links bündeln – perfekt für Bio & Plattform‑Limits.</p>
          <div className="mt-5">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">Jetzt kostenlos anmelden</Button>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

export default function CreatorBaseProfilesOnly() {
  return (
    <div className="min-h-screen" style={{ background: BRAND.surface }}>
      <TopNav />
      <HeroProfiles />
      <ProfilesGrid profiles={demoProfiles} />
      <CreatorSignupBanner />
      <footer className="border-t border-black/5 mt-10">
        <Section className="py-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Creator Base · 18+</span>
          <div className="flex gap-4">
            <a className="hover:text-gray-900" href="#">Datenschutz</a>
            <a className="hover:text-gray-900" href="#">Impressum</a>
            <a className="hover:text-gray-900" href="#">Kontakt</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
