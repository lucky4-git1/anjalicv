import React, { useState } from "react"
import {
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  X,
  Heart,
  Palette,
  Layers,
  Code2,
  Wand2,
  Star,
  Zap,
  Bookmark,
  Play
} from "lucide-react"
import confetti from "canvas-confetti"
import { PORTFOLIO_DATA } from "../data/portfolioData"

export interface WorkSample {
  id: string
  title: string
  client: string
  category: string
  views: string
  reach: string
  shares: string
  image: string
  description: string
  tags: string[]
}

export const WORK_SAMPLES: WorkSample[] = [
  {
    id: "sample-1",
    title: "Aura Silk Elixir",
    client: "Maison Botanique",
    category: "Luxury Skincare Campaign",
    views: "2.8M",
    reach: "1.4M",
    shares: "128K",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    description: "Multi-sensory skincare macro visual reel capturing silk texture, organic serum droplets, and botanical radiance. Directed for high-conversion organic social engagement.",
    tags: ["Art Direction", "Macro Texture", "Viral Reel"]
  },
  {
    id: "sample-2",
    title: "Sculpted Touch",
    client: "L'Or Atelier",
    category: "Haute Jewelry & Rituals",
    views: "3.4M",
    reach: "1.9M",
    shares: "174K",
    image: "https://images.unsplash.com/photo-1608248597358-1e4242fa5214?auto=format&fit=crop&w=800&q=80",
    description: "Tactile editorial hand choreography highlighting gold vermeil rings and bespoke craftsmanship with ambient sunlight and warm linen tones.",
    tags: ["Jewelry Styling", "Hand Choreography", "Editorial"]
  },
  {
    id: "sample-3",
    title: "Atelier Céramique",
    client: "Studio Terre",
    category: "Artisanal Craft Process",
    views: "1.6M",
    reach: "980K",
    shares: "86K",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    description: "Hypnotic wheel-throwing ceramics documentation exploring raw clay tactile physics, gentle water droplets, and artisanal stoneware forms.",
    tags: ["Process Reel", "Artisanal", "Sound Design"]
  },
  {
    id: "sample-4",
    title: "Sovereign Muse",
    client: "Komorebi Paris",
    category: "Fashion Monograph Lookbook",
    views: "4.2M",
    reach: "2.3M",
    shares: "245K",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    description: "Close-up cinematic beauty monologues and fluid camera movement authoring bespoke brand personality across TikTok and Instagram Reels.",
    tags: ["Campaign Direction", "Talent Casting", "Motion Editorial"]
  }
]

interface CuteSkill {
  name: string
  category: "design" | "tools" | "tech"
  badge: string
  icon: React.ComponentType<{ className?: string }>
  affinity: string
  cuteTag: string
}

const CUTE_SKILLS: CuteSkill[] = [
  // Design Expertise
  {
    name: "Editorial Art Direction",
    category: "design",
    badge: "Haute",
    icon: Palette,
    affinity: "99%",
    cuteTag: "Curated ✿"
  },
  {
    name: "Haute Couture Brand Identity",
    category: "design",
    badge: "Luxury",
    icon: Sparkles,
    affinity: "98%",
    cuteTag: "Obsessed ♡"
  },
  {
    name: "Typography & Micro-Hierarchy",
    category: "design",
    badge: "Type",
    icon: Bookmark,
    affinity: "96%",
    cuteTag: "Pixel-Pure ✦"
  },
  {
    name: "Spatial Layout & Print Monographs",
    category: "design",
    badge: "Monograph",
    icon: Layers,
    affinity: "94%",
    cuteTag: "Tactile ⋆"
  },
  {
    name: "Design Systems & Token Architecture",
    category: "design",
    badge: "Systems",
    icon: Wand2,
    affinity: "97%",
    cuteTag: "DesignOps ⚙"
  },
  {
    name: "Creative Campaign Direction",
    category: "design",
    badge: "Campaign",
    icon: Star,
    affinity: "95%",
    cuteTag: "Couture ✧"
  },

  // Creative Tools
  {
    name: "Figma / FigJam (Master)",
    category: "tools",
    badge: "Master ✦",
    icon: Palette,
    affinity: "100%",
    cuteTag: "Daily Driver ♡"
  },
  {
    name: "Adobe InDesign & Illustrator",
    category: "tools",
    badge: "Vector",
    icon: Wand2,
    affinity: "97%",
    cuteTag: "Vector Art ✿"
  },
  {
    name: "Adobe Photoshop & After Effects",
    category: "tools",
    badge: "Motion",
    icon: Sparkles,
    affinity: "95%",
    cuteTag: "Keyframes ✧"
  },
  {
    name: "Blender 3D Modeling",
    category: "tools",
    badge: "3D Craft",
    icon: Layers,
    affinity: "90%",
    cuteTag: "Sculpting ✦"
  },
  {
    name: "Glyphs (Type Design)",
    category: "tools",
    badge: "Kerning",
    icon: Bookmark,
    affinity: "92%",
    cuteTag: "Bespoke ⋆"
  },
  {
    name: "Cinema 4D / Octane",
    category: "tools",
    badge: "Render",
    icon: Star,
    affinity: "89%",
    cuteTag: "Raytraced ☼"
  },

  // Technical Capabilities
  {
    name: "WebGL & Three.js Shaders",
    category: "tech",
    badge: "GLSL",
    icon: Zap,
    affinity: "93%",
    cuteTag: "Realtime ⚡"
  },
  {
    name: "React / TypeScript / Next.js",
    category: "tech",
    badge: "Modern Web",
    icon: Code2,
    affinity: "99%",
    cuteTag: "Engineered ✦"
  },
  {
    name: "Tailwind CSS Architecture",
    category: "tech",
    badge: "Styling",
    icon: Palette,
    affinity: "99%",
    cuteTag: "Utility Art ✿"
  },
  {
    name: "GSAP ScrollTrigger Animation",
    category: "tech",
    badge: "Motion",
    icon: Sparkles,
    affinity: "98%",
    cuteTag: "Silk Scrub ♡"
  },
  {
    name: "HTML5 Canvas & SVG Rendering",
    category: "tech",
    badge: "Canvas",
    icon: Layers,
    affinity: "95%",
    cuteTag: "Math & Art ✧"
  },
  {
    name: "WCAG AAA Accessibility",
    category: "tech",
    badge: "Universal",
    icon: Check,
    affinity: "99%",
    cuteTag: "Inclusive ⋆"
  }
]

interface EditorialPortfolioBoardProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const EditorialPortfolioBoard: React.FC<EditorialPortfolioBoardProps> = ({
  onOpenCvModal,
  onOpenContactModal,
}) => {
  const { personal } = PORTFOLIO_DATA

  const [selectedSample, setSelectedSample] = useState<WorkSample | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeSkillTab, setActiveSkillTab] = useState<"all" | "design" | "tools" | "tech">("all")
  const [likedSkills, setLikedSkills] = useState<Record<string, boolean>>({
    "Editorial Art Direction": true,
    "Figma / FigJam (Master)": true,
    "React / TypeScript / Next.js": true
  })

  const handleLikeSkill = (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const willLike = !likedSkills[name]
    setLikedSkills((prev) => ({ ...prev, [name]: willLike }))
    if (willLike) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { x, y },
        colors: ["#CB7885", "#D4D994", "#FDE8EC", "#FFB6C1"]
      })
    }
  }

  const filteredSkills =
    activeSkillTab === "all"
      ? CUTE_SKILLS
      : CUTE_SKILLS.filter((s) => s.category === activeSkillTab)

  const likedCount = Object.values(likedSkills).filter(Boolean).length

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email)
    setCopied(true)
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#CB7885", "#893941", "#D4D994", "#F5F3EC"],
    })
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div id="portfolio-board" className="relative bg-[#F9EAE6] py-16 md:py-24 text-[#211D1D]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12 md:space-y-16">

        {/* ════════════════════════════════════════════════════════════════════
            TWO-COLUMN ROW 1: ABOUT ME (LEFT) + SKILLS & EXPERTISE (RIGHT)
        ════════════════════════════════════════════════════════════════════ */}
        <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch scroll-mt-24">
          
          {/* PANEL 2: ABOUT ME + PROFILE (7 cols) — Dusty Rose & Ivory Editorial Panel */}
          <div className="lg:col-span-7 rounded-2xl bg-[#CB7885] text-[#211D1D] p-7 sm:p-10 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.12)] relative overflow-hidden border border-[#D4D994]/30">
            {/* Subtle botanical corner mark */}
            <div className="absolute top-4 right-5 text-[10px] font-mono tracking-widest uppercase text-[#893941] font-bold">
              01 / PROFILE & EDITORIAL
            </div>

            <div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-[#893941] leading-none mb-6">
                ABOUT ME
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-6">
                {/* Portrait Image Frame — Target landing point for the traveling hero flower */}
                <div id="about-portrait-card" className="relative sm:col-span-5 rounded-xl border-2 border-[#893941]/20 bg-[#F5F3EC] shadow-md group">
                  {/* Landing anchor for the traveling flower */}
                  <div
                    id="portrait-flower-anchor"
                    className="absolute -top-3 -right-3 w-6 h-6 pointer-events-none z-30"
                    aria-hidden="true"
                  />
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                      alt="Anjali Verma — Creative Director"
                      className="w-full aspect-[4/5] object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="p-2.5 bg-[#F5F3EC] text-center border-t border-[#893941]/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#893941] font-bold block">
                        Anjali Verma
                      </span>
                      <span className="text-[9px] font-mono text-[#5E6623]">
                        London • Creative Direction
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Intro & Philosophy */}
                <div className="sm:col-span-7 space-y-3 text-xs sm:text-sm text-[#211D1D] leading-relaxed">
                  <p className="font-medium text-sm text-[#893941]">
                    {personal.bio}
                  </p>
                  <p>
                    I operate at the precise intersection of graphic editorial monograph art direction and performance creative technology. Rather than treating visual design and code as disconnected disciplines, I author bespoke brand identities alongside real-time shaders and layout systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Philosophy Plaque */}
            <div className="pt-4 border-t border-[#893941]/20 flex items-center justify-between">
              <span className="font-serif italic text-sm sm:text-base text-[#893941] font-semibold">
                “{personal.philosophy}”
              </span>
              <span className="w-2 h-2 rounded-full bg-[#5E6623] shrink-0" />
            </div>
          </div>

          {/* PANEL 3: SKILLS & CREATIVE MATRIX (5 cols) — Pinteresty Cute Moodboard Panel */}
          <div className="lg:col-span-5 rounded-2xl bg-[#893941] text-[#F5F3EC] p-6 sm:p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#CB7885]/20 relative overflow-hidden">
            {/* Soft decorative background glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#CB7885]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#D4D994]/15 blur-3xl pointer-events-none" />

            <div>
              {/* Header with cute moodboard tag */}
              <div className="flex items-center justify-between pb-3 border-b border-[#CB7885]/30 mb-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4D994] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4D994]" />
                  02 / CAPABILITIES MATRIX
                </span>
                <span className="text-[10px] font-mono tracking-wider text-[#FDE8EC] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 shadow-xs">
                  ˚୨୧ Pinterest Moodboard ✿
                </span>
              </div>

              {/* Title and cute description */}
              <div className="mb-4">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFEFA] leading-tight">
                  Skills & Disciplines
                </h2>
                <p className="text-[11px] font-mono text-zinc-300 mt-1">
                  Interactive creative arsenal • Click any card to favorite ♡
                </p>
              </div>

              {/* Interactive Category Tabs */}
              <div className="flex items-center gap-1.5 mb-4 p-1 rounded-xl bg-black/25 border border-white/10">
                {[
                  { id: "all", label: "✿ All", count: 18 },
                  { id: "design", label: "✦ Design", count: 6 },
                  { id: "tools", label: "✎ Tools", count: 6 },
                  { id: "tech", label: "⚡ Code", count: 6 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSkillTab(tab.id as any)}
                    className={`flex-1 py-1.5 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                      activeSkillTab === tab.id
                        ? "bg-[#D4D994] text-[#211D1D] font-bold shadow-xs scale-[1.02]"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                        activeSkillTab === tab.id
                          ? "bg-[#211D1D]/15 text-[#211D1D]"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Cute Cards Grid with Custom Scrollbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1 sm:pr-1.5 custom-cute-scrollbar">
                {filteredSkills.map((skill) => {
                  const Icon = skill.icon
                  const isLiked = likedSkills[skill.name]

                  return (
                    <div
                      key={skill.name}
                      onClick={(e) => handleLikeSkill(skill.name, e)}
                      className="relative p-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-[#CB7885]/30 hover:border-[#D4D994] transition-all duration-300 group cursor-pointer overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 active:scale-[0.97] flex flex-col justify-between"
                    >
                      {/* Pinterest-style soft ambient sheen */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                      <div>
                        {/* Card Top: Micro Icon + Badge + Like Button */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-lg bg-[#D4D994]/20 text-[#D4D994] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4D994] group-hover:text-[#211D1D] transition-all duration-300 shrink-0 shadow-xs">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#D4D994] border border-[#D4D994]/20 group-hover:border-[#D4D994]/60 group-hover:bg-[#D4D994]/10 transition-colors">
                              {skill.badge}
                            </span>
                          </div>

                          {/* Interactive Heart Button */}
                          <button
                            type="button"
                            onClick={(e) => handleLikeSkill(skill.name, e)}
                            className="p-1 rounded-full text-white/40 hover:text-white transition-transform active:scale-125"
                            aria-label={`Favorite ${skill.name}`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 transition-all duration-300 ${
                                isLiked
                                  ? "fill-[#FFB6C1] text-[#FFB6C1] scale-110"
                                  : "text-white/40 group-hover:text-[#FFB6C1]"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Skill Title */}
                        <h4 className="text-xs sm:text-[12.5px] font-medium text-[#FFFEFA] group-hover:text-[#D4D994] transition-colors leading-snug line-clamp-1">
                          {skill.name}
                        </h4>
                      </div>

                      {/* Card Bottom: Animated Micro Elements inside the card */}
                      <div className="mt-2.5 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#D4D994] group-hover:text-white transition-colors flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4D994] group-hover:animate-ping" />
                            {skill.cuteTag}
                          </span>
                          <span className="text-white/60 group-hover:text-[#D4D994] transition-colors font-bold">
                            {skill.affinity}
                          </span>
                        </div>

                        {/* Animated progress bar that fills and glows smoothly on hover */}
                        <div className="w-full h-1 bg-black/25 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-[#CB7885] via-[#FDE8EC] to-[#D4D994] rounded-full transition-all duration-500 ease-out group-hover:brightness-125"
                            style={{ width: skill.affinity }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Plaque with Live Favorite Counter */}
            <div className="pt-4 border-t border-[#CB7885]/20 mt-4 flex items-center justify-between text-[11px] font-mono text-[#D4D994]">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#FFB6C1] text-[#FFB6C1] animate-pulse" />
                <span className="text-[#FFFEFA]">
                  {likedCount > 0
                    ? `${likedCount} / ${CUTE_SKILLS.length} Skills Favorited ♡`
                    : "Tap card heart to favorite ♡"}
                </span>
              </span>
              <span className="text-[#D4D994]">100% Code & Craft</span>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3: WORK SAMPLE (MATCHES REFERENCE WITH 4 PHONE MODELS)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="work" className="scroll-mt-24 pt-6 pb-6">
          {/* Section Header: Matching Reference Screenshot */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#893941] font-normal tracking-wide">
              Work Sample
            </h2>

            {/* Cursive Subtitle with Hairline and Sparkles */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mt-3 px-4">
              <span className="text-[#CB7885] text-base sm:text-xl select-none animate-pulse">✦</span>
              <span className="font-serif italic text-base sm:text-xl text-[#CB7885] tracking-wide whitespace-nowrap">
                sample work sample
              </span>
              <div className="h-[1px] bg-gradient-to-r from-[#CB7885]/40 via-[#CB7885]/20 to-transparent flex-1 hidden sm:block" />
              <span className="text-[#CB7885] text-xs sm:text-sm select-none">✧</span>
            </div>
          </div>

          {/* 4 Phone Mockup Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 items-end max-w-6xl mx-auto px-4">
            {WORK_SAMPLES.map((sample) => (
              <div
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                className="group relative flex flex-col items-center cursor-pointer select-none"
              >
                {/* Phone Container */}
                <div className="relative w-full max-w-[250px] sm:max-w-[230px] lg:max-w-[250px] aspect-[194/402] transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.02]">
                  {/* Grounding shadow beneath phone */}
                  <div className="absolute -bottom-5 inset-x-5 h-8 bg-[#893941]/25 blur-xl rounded-full transition-all duration-500 group-hover:scale-115 group-hover:bg-[#893941]/35 pointer-events-none" />

                  {/* Inner Screen Content */}
                  <div className="absolute inset-[3px] rounded-[26px] overflow-hidden bg-[#211D1D] shadow-inner">
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.95] group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/65 pointer-events-none" />

                    {/* Status Bar */}
                    <div className="absolute top-2.5 inset-x-4 flex justify-between items-center text-[9px] font-mono text-white/80 pointer-events-none z-10">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/75" />
                        <span className="w-3.5 h-1.5 rounded-xs border border-white/75 flex items-center p-[1px]">
                          <span className="w-full h-full bg-white/75" />
                        </span>
                      </div>
                    </div>

                    {/* Center Play Button matching reference screenshot */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-[#CB7885] group-hover:border-[#FFFEFA]">
                        <Play className="w-4 h-4 fill-white text-white ml-0.5 transition-transform group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Bottom Views Tag */}
                    <div className="absolute bottom-3 inset-x-3 text-center z-10 pointer-events-none">
                      <span className="text-[10px] font-mono tracking-wider text-white/95 bg-black/45 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 inline-flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5 text-[#D4D994]" />
                        {sample.views} Views
                      </span>
                    </div>
                  </div>

                  {/* Phone Bezel Frame Overlay (Exact user-provided model) */}
                  <img
                    src="/assets/phone-frame.png"
                    alt="Phone Frame"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20 select-none"
                  />
                </div>

                {/* Subtitle / Title under each phone */}
                <div className="mt-4 text-center">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#893941] group-hover:text-[#CB7885] transition-colors leading-snug">
                    {sample.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#5E6623] tracking-wider mt-0.5 uppercase">
                    {sample.client}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>





        {/* ════════════════════════════════════════════════════════════════════
            SECTION 8: FULL-WIDTH COLLABORATION & CONTACT PANEL
        ════════════════════════════════════════════════════════════════════ */}
        <div id="contact" className="rounded-2xl bg-[#893941] text-[#F5F3EC] p-8 sm:p-14 shadow-[0_16px_50px_rgba(0,0,0,0.35)] border border-[#CB7885]/30 text-center flex flex-col items-center scroll-mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#211D1D]/50 border border-[#D4D994]/30 text-[10px] font-mono tracking-widest uppercase text-[#D4D994] mb-4 font-bold">
            07 / INVITATION TO COLLABORATE
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-[#FFFEFA] leading-tight mb-4 max-w-3xl">
            Let's Shape Botanical Luxury Together.
          </h2>

          <p className="max-w-xl text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-8">
            Available for select Creative Direction, Haute Couture Brand Identity, and Spatial Design Commissions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#211D1D] hover:bg-[#2e2528] border border-[#CB7885]/40 text-[#F5F3EC] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98]"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4D994]" />
              <span>{personal.email}</span>
              {copied ? (
                <span className="flex items-center gap-1 text-[10px] text-[#D4D994] font-semibold">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3 text-zinc-400" />
              )}
            </button>

            <button
              onClick={onOpenContactModal}
              className="px-6 py-2.5 rounded-full bg-[#D4D994] hover:bg-[#c2c87e] text-[#211D1D] font-mono text-xs uppercase tracking-wider font-bold shadow-md transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Transmit Commission</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full pt-8 border-t border-[#CB7885]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#D4D994]">
            <div className="flex items-center gap-6">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://read.cv" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">ReadCV</a>
              <a href="https://awwwards.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Awwwards</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
            <span className="text-zinc-400 text-[11px]">
              © 2027 Anjali Verma • Botanical Editorial Portfolio
            </span>
          </div>
        </div>

      </div>

      {/* ── WORK SAMPLE DETAIL MODAL ── */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#F5F3EC] text-[#211D1D] border-2 border-[#893941] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedSample(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg border border-[#893941]/30 text-[#893941] hover:bg-[#893941]/10 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase text-[#893941] font-bold">
                {selectedSample.client} • {selectedSample.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#893941] mt-0.5">
                {selectedSample.title}
              </h3>
            </div>

            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#893941]/20 mb-6 bg-[#211D1D] relative group">
              <img src={selectedSample.image} alt={selectedSample.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#CB7885] text-white flex items-center justify-center shadow-lg border border-white/50">
                  <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white border border-[#893941]/15 mb-6 text-xs font-mono text-center">
              <div>
                <span className="text-[10px] uppercase text-[#893941] font-bold block">Total Views</span>
                <span className="text-[#211D1D] font-bold text-sm sm:text-base">{selectedSample.views}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#893941] font-bold block">Account Reach</span>
                <span className="text-[#5E6623] font-bold text-sm sm:text-base">{selectedSample.reach}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#893941] font-bold block">Saves & Shares</span>
                <span className="text-[#893941] font-bold text-sm sm:text-base">{selectedSample.shares}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs text-[#211D1D] font-sans leading-relaxed">
              <div>
                <h4 className="text-xs font-semibold text-[#893941] uppercase font-mono tracking-wider mb-1">
                  Creative Direction & Reel Concept
                </h4>
                <p className="text-sm leading-relaxed text-[#211D1D]/85">{selectedSample.description}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#893941] font-bold block mb-2">Campaign Focus & Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSample.tags.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-[#CB7885]/20 border border-[#893941]/20 text-[10px] font-mono text-[#893941] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
