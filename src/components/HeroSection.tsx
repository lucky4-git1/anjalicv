import React from "react"
import { Eye, Download } from "lucide-react"
import GlimmerVale from "@/components/originkit/ui/glimmer-vale"
import { PORTFOLIO_DATA } from "../data/portfolioData"

interface HeroSectionProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCvModal }) => {
  const { personal } = PORTFOLIO_DATA

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[640px] max-h-[100vh] flex flex-col justify-between overflow-hidden px-5 sm:px-8 pt-20 pb-8 select-none bg-[#211D1D]"
    >
      {/* ── LAYER 1: GLIMMER VALE WEBGL ATMOSPHERE (z-0) IN BRAND PALETTE ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-60">
        <GlimmerVale
          speed={28}
          scale={100}
          density={40}
          sparkle={55}
          background="#211D1D"
          skyTop="#211D1D"
          skyHorizon="#893941"
          style={{ minWidth: 0, minHeight: 0 }}
          advanced={{
            crestColor: "#F5F3EC",
            slopeColor: "#CB7885",
            slopeDeep: "#893941",
            hillShadow: "#211D1D",
            glowColor: "#D4D994",
            glowStrength: 45,
            skyMid: "#40171d",
            horizonGlow: "#F5F3EC",
            horizonGlowStrength: 20,
            grain: 10,
            vignette: 25,
            sway: 30,
            flowerSize: 0,
            midCount: 0,
            grassCount: 180,
            bokehCount: 50,
          }}
        />
      </div>

      {/* Layered Gradient for Editorial Readability */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#211D1D] via-[#211D1D]/45 to-transparent" />

      {/* Top spacer */}
      <div className="relative z-10" />

      {/* ── LAYER 3: HERO TYPOGRAPHY & MAGAZINE COVER ARCHITECTURE (z-10 / z-30) ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center my-auto pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#893941]/30 border border-[#CB7885]/20 text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4D994] mb-3">
          <span>{personal.title}</span>
        </div>

        {/* DOMINANT HERO NAME — Magazine Cover Typography */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-serif font-medium tracking-tight text-[#F5F3EC] leading-none mb-3">
          ANJALI
        </h1>

        <p className="max-w-xl text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-7">
          {personal.subtagline}
        </p>

        {/* Compact, Tactile Action Buttons in Brand Colors (z-30 pointer-events-auto) */}
        <div className="flex items-center justify-center gap-3 relative z-30 pointer-events-auto">
          <a
            href="#portfolio-board"
            className="group px-5 py-2.5 rounded-full bg-[#893941] hover:bg-[#a1434c] text-[#FFFEFA] text-xs font-mono uppercase tracking-wider font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_4px_16px_rgba(137,57,65,0.4)] transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4D994]" />
            <span>Explore Portfolio</span>
          </a>

          <button
            onClick={onOpenCvModal}
            className="group px-5 py-2.5 rounded-full bg-[#F5F3EC]/[0.05] hover:bg-[#F5F3EC]/[0.1] border border-[#F5F3EC]/20 hover:border-[#CB7885] text-[#F5F3EC] text-xs font-mono uppercase tracking-wider font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#CB7885]" />
            <span>Curriculum Vitae</span>
          </button>
        </div>
      </div>

      {/* Bottom Compact Metrics Strip */}
      <div className="relative z-10 max-w-4xl mx-auto w-full border-t border-[#CB7885]/20 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {personal.stats.map((stat, idx) => (
          <div key={idx}>
            <span className="block font-serif text-lg sm:text-xl font-bold text-[#CB7885]">{stat.value}</span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
