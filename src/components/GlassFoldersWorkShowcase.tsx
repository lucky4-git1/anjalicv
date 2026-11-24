"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, Sparkles, Compass, X, ArrowUpRight, Eye } from "lucide-react"
import GlassFolder, { FolderFile } from "@/components/ui/glass-folder-cards"
import WorksWheel, { WorksWheelItem } from "@/components/ui/works-wheel"
import { LiquidButton } from "@/components/ui/liquid-button"

export interface ShowcaseProject {
  id: string
  title: string
  folder: "reels" | "lookbooks" | "strategy"
  meta: string
  image: string
  client: string
  description: string
  metrics?: string
  tags: string[]
}

const COLLECTIONS: Record<
  "reels" | "lookbooks" | "strategy",
  {
    name: string
    badge: string
    wheelLabel: string
    tone: "light" | "dark"
    art: "aurora" | "ember" | "verdant"
    seed: number
    files: FolderFile[]
    items: WorksWheelItem[]
  }
> = {
  reels: {
    name: "Viral Social Reels",
    badge: "Viral Campaigns ✿",
    wheelLabel: "Reels '26",
    tone: "light",
    art: "aurora",
    seed: 3,
    files: [
      { name: "Komorebi Paris", meta: "4.2M Views · Reel", art: "aurora" },
      { name: "Silk & Radiance", meta: "2.8M Views · Beauty", art: "ember" },
      { name: "Sovereign Muse", meta: "3.6M Views · Fashion", art: "dusk" },
      { name: "Atelier Terre", meta: "1.9M Views · Ceramic", art: "verdant" },
    ],
    items: [
      {
        title: "Komorebi Paris",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        href: "#komorebi-paris",
      },
      {
        title: "Silk & Radiance",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
        href: "#silk-radiance",
      },
      {
        title: "Sovereign Muse",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
        href: "#sovereign-muse",
      },
      {
        title: "Atelier Terre",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80",
        href: "#atelier-terre",
      },
      {
        title: "Velvet Reverie",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        href: "#velvet-reverie",
      },
      {
        title: "L'Aura Golden Hour",
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
        href: "#laura-golden-hour",
      },
      {
        title: "Éthérée Glow",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
        href: "#etheree-glow",
      },
    ],
  },
  lookbooks: {
    name: "Aesthetic Lookbooks",
    badge: "Haute Monograph ♡",
    wheelLabel: "Lookbook '26",
    tone: "dark",
    art: "ember",
    seed: 11,
    files: [
      { name: "Chroma Velour", meta: "38 Pages · Monograph", art: "dusk" },
      { name: "L'Élixir Botanique", meta: "Packaging & Print", art: "verdant" },
      { name: "Haute Bijoux", meta: "Jewelry Art Lookbook", art: "ember" },
      { name: "Terracotta Minimal", meta: "Ceramic Still Study", art: "aurora" },
    ],
    items: [
      {
        title: "Chroma Velour",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
        href: "#chroma-velour",
      },
      {
        title: "L'Élixir Botanique",
        image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=900&q=80",
        href: "#elixir-botanique",
      },
      {
        title: "Haute Bijoux",
        image: "https://images.unsplash.com/photo-1608248597358-1e4242fa5214?auto=format&fit=crop&w=900&q=80",
        href: "#haute-bijoux",
      },
      {
        title: "Terracotta Minimal",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80",
        href: "#terracotta-minimal",
      },
      {
        title: "Parisian Atelier",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
        href: "#parisian-atelier",
      },
      {
        title: "Marble & Rose",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
        href: "#marble-rose",
      },
      {
        title: "Botanical Herbarium",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
        href: "#botanical-herbarium",
      },
    ],
  },
  strategy: {
    name: "Brand Strategy & Growth",
    badge: "Growth Engine ⚡",
    wheelLabel: "Strategy '26",
    tone: "light",
    art: "verdant",
    seed: 19,
    files: [
      { name: "Souverain Sanctuary", meta: "Digital Flagship · 74% Lift", art: "aurora" },
      { name: "Nyx Aerospace", meta: "Experience Architecture", art: "glacier" },
      { name: "Meta Growth Blueprint", meta: "Social Playbook · 3.5x", art: "verdant" },
      { name: "Content Matrix '26", meta: "Editorial Grid Strategy", art: "ember" },
    ],
    items: [
      {
        title: "Souverain Sanctuary",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
        href: "#souverain-sanctuary",
      },
      {
        title: "Nyx Aerospace",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
        href: "#nyx-aerospace",
      },
      {
        title: "Meta Growth Blueprint",
        image: "https://images.unsplash.com/photo-1517976487588-e9f0d1a49ec3?auto=format&fit=crop&w=900&q=80",
        href: "#meta-growth-blueprint",
      },
      {
        title: "Content Matrix '26",
        image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80",
        href: "#content-matrix",
      },
      {
        title: "Luxury Flagship Atelier",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        href: "#luxury-flagship",
      },
      {
        title: "Digital Sanctuary UI",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
        href: "#digital-sanctuary",
      },
    ],
  },
}

interface GlassFoldersWorkShowcaseProps {
  onSelectProject?: (item: WorksWheelItem) => void
}

export const GlassFoldersWorkShowcase: React.FC<GlassFoldersWorkShowcaseProps> = ({
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<"reels" | "lookbooks" | "strategy">("reels")
  const [openFolder, setOpenFolder] = useState<"reels" | "lookbooks" | "strategy" | null>("reels")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wheelActiveIndex, setWheelActiveIndex] = useState<number | undefined>(undefined)

  const activeCollection = COLLECTIONS[activeTab]

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = ""
      return
    }
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [isModalOpen])

  // Clicking a folder: opens the folder AND launches the 3D Works Wheel Modal!
  const handleFolderClick = (key: "reels" | "lookbooks" | "strategy") => {
    setActiveTab(key)
    setOpenFolder(key)
    setWheelActiveIndex(0)
    setIsModalOpen(true)
  }

  // Clicking a file inside the folder: opens modal directly spun to that card!
  const handleFileClick = (key: "reels" | "lookbooks" | "strategy", index: number) => {
    setActiveTab(key)
    setOpenFolder(key)
    setWheelActiveIndex(index)
    setIsModalOpen(true)
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] bg-[#211D1D] text-[#F5F3EC] py-16 sm:py-24 my-8 overflow-hidden">
      {/* ── FULL-BLEED DOTTED MATRIX DESK PATTERN (EDGE TO EDGE) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.20]"
        style={{
          backgroundImage: "radial-gradient(#D4D994 1.25px, transparent 1.45px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#893941]/35 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-[#CB7885]/25 blur-[120px] pointer-events-none" />

      {/* ── CENTERED EDITORIAL CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#CB7885]/25">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#893941]/70 border border-[#CB7885]/35 text-[11px] font-mono tracking-wider uppercase text-[#D4D994] mb-3 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4D994]" />
              Archival Glass Folders & 3D Interactive Modal
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFEFA] font-normal tracking-wide">
              Curated Campaign Archives
            </h3>
            <p className="text-xs sm:text-sm font-sans text-zinc-300 mt-2 max-w-xl leading-relaxed">
              Frosted glass folders drawn as tactile objects. Click any folder to inspect its files and launch the interactive 3D drum modal.
            </p>
          </div>

          {/* Quick Collection Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#171415]/90 p-1.5 rounded-2xl border border-white/10 shrink-0">
            {(["reels", "lookbooks", "strategy"] as const).map((key) => {
              const col = COLLECTIONS[key]
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFolderClick(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-[#D4D994] text-[#211D1D] font-bold shadow-md scale-[1.02]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${isActive ? "text-[#211D1D]" : "text-[#CB7885]"}`} />
                  <span>{col.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── ROW OF 3 CLICKABLE GLASS FOLDERS ON THE DOTTED DESK ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center items-end py-6">
          {/* FOLDER 1: Viral Social Reels */}
          <div
            className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${
              activeTab === "reels" ? "scale-105" : "opacity-85 hover:opacity-100 hover:scale-[1.02]"
            }`}
            onClick={() => handleFolderClick("reels")}
          >
            <GlassFolder
              label="Viral Social Reels"
              meta="7 Projects"
              art="aurora"
              seed={3}
              width={310}
              open={openFolder === "reels"}
              onOpenChange={(isOpen) => {
                if (isOpen) handleFolderClick("reels")
                else if (openFolder === "reels") setOpenFolder(null)
              }}
              files={COLLECTIONS.reels.files}
              onFileSelect={(_, idx) => handleFileClick("reels", idx)}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleFolderClick("reels")
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer bg-[#D4D994] text-[#211D1D] font-bold shadow-lg hover:bg-[#c3c87e] active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open 3D Reel Wheel ✦</span>
            </button>
          </div>

          {/* FOLDER 2: Aesthetic Lookbooks */}
          <div
            className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${
              activeTab === "lookbooks" ? "scale-105" : "opacity-85 hover:opacity-100 hover:scale-[1.02]"
            }`}
            onClick={() => handleFolderClick("lookbooks")}
          >
            <GlassFolder
              label="Aesthetic Lookbooks"
              meta="7 Projects"
              tone="dark"
              art="ember"
              seed={11}
              width={310}
              action="more"
              open={openFolder === "lookbooks"}
              onOpenChange={(isOpen) => {
                if (isOpen) handleFolderClick("lookbooks")
                else if (openFolder === "lookbooks") setOpenFolder(null)
              }}
              files={COLLECTIONS.lookbooks.files}
              onFileSelect={(_, idx) => handleFileClick("lookbooks", idx)}
              menu={[
                { label: "Open 3D Wheel", onSelect: () => handleFolderClick("lookbooks") },
                { label: "Share Collection" },
              ]}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleFolderClick("lookbooks")
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer bg-[#CB7885] text-white font-bold shadow-lg hover:bg-[#b56572] active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open 3D Lookbook Wheel ✦</span>
            </button>
          </div>

          {/* FOLDER 3: Brand Strategy & Growth */}
          <div
            className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${
              activeTab === "strategy" ? "scale-105" : "opacity-85 hover:opacity-100 hover:scale-[1.02]"
            }`}
            onClick={() => handleFolderClick("strategy")}
          >
            <GlassFolder
              label="Strategy & Growth"
              meta="6 Projects"
              art="verdant"
              seed={19}
              width={310}
              action="add"
              open={openFolder === "strategy"}
              onOpenChange={(isOpen) => {
                if (isOpen) handleFolderClick("strategy")
                else if (openFolder === "strategy") setOpenFolder(null)
              }}
              files={COLLECTIONS.strategy.files}
              onFileSelect={(_, idx) => handleFileClick("strategy", idx)}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleFolderClick("strategy")
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer bg-[#D4D994] text-[#211D1D] font-bold shadow-lg hover:bg-[#c3c87e] active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open 3D Strategy Wheel ✦</span>
            </button>
          </div>
        </div>

        {/* Helpful Hint Pill */}
        <div className="flex items-center justify-center my-6">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#D4D994] bg-black/50 px-5 py-2 rounded-full border border-white/10 shadow-md">
            Click any folder or button to launch the 3D Work Drum Modal
          </p>
        </div>
      </div>

      {/* ── COMPLETE FULL-SCREEN 3D WORKS WHEEL MODAL OVERLAY (PORTALED TO BODY) ── */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[999999] w-screen h-screen bg-[#141112] text-[#F5F3EC] flex flex-col overflow-hidden"
              >
                {/* Full-bleed dotted desk pattern */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.20]"
                  style={{
                    backgroundImage: "radial-gradient(#D4D994 1.3px, transparent 1.5px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* Ambient glow */}
                <div className="absolute top-1/3 -right-36 w-[36rem] h-[36rem] rounded-full bg-[#893941]/35 blur-[160px] pointer-events-none" />
                <div className="absolute bottom-1/3 -left-36 w-[36rem] h-[36rem] rounded-full bg-[#CB7885]/25 blur-[160px] pointer-events-none" />

                {/* ── SLEEK FLOATING MODAL NAVBAR WITH LIQUID BUTTONS ── */}
                <header className="relative z-30 px-4 sm:px-8 py-3 sm:py-4 border-b border-white/10 bg-[#161213]/85 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] shrink-0">
                  {/* Left: Refined Title (Decreased font size, no pulsing dot) */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4D994] px-2.5 py-1 rounded-full bg-[#D4D994]/10 border border-[#D4D994]/30 font-semibold hidden xs:inline-block">
                      Archive
                    </span>
                    <div>
                      <h3 className="font-serif text-sm sm:text-base md:text-lg font-medium text-[#FFFEFA] tracking-wide leading-tight">
                        Active Drum: <span className="text-[#D4D994]">{activeCollection.name}</span>
                      </h3>
                      <p className="font-sans text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                        {activeCollection.items.length} Curated Works • Drag or scroll drum wheel
                      </p>
                    </div>
                  </div>

                  {/* Center: Liquid Glass Button Navigation Bar */}
                  <nav className="flex items-center gap-1.5 sm:gap-2.5 p-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md shadow-inner">
                    {(["reels", "lookbooks", "strategy"] as const).map((key) => {
                      const col = COLLECTIONS[key]
                      const isActive = activeTab === key
                      return (
                        <LiquidButton
                          key={key}
                          size="sm"
                          onClick={() => {
                            setActiveTab(key)
                            setOpenFolder(key)
                            setWheelActiveIndex(0)
                          }}
                          className={`rounded-full px-3.5 sm:px-5 py-2 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            isActive
                              ? "text-[#D4D994] font-bold shadow-[0_0_20px_rgba(212,217,148,0.35)] border border-[#D4D994]/60 bg-[#D4D994]/15 scale-[1.02]"
                              : "text-zinc-300 hover:text-white border border-white/10 hover:bg-white/5"
                          }`}
                        >
                          <span>{col.wheelLabel}</span>
                        </LiquidButton>
                      )
                    })}
                  </nav>

                  {/* Right: Bold Red Liquid Glass Close Button */}
                  <LiquidButton
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full px-4 sm:px-6 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono text-xs sm:text-sm uppercase tracking-wider font-extrabold shadow-[0_4px_25px_rgba(220,38,38,0.7)] hover:shadow-[0_6px_35px_rgba(220,38,38,0.9)] border-2 border-red-300/80 cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
                    aria-label="Close Full Screen 3D Drum"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                    <span>Close</span>
                    <span className="text-[10px] opacity-80 font-mono hidden sm:inline">(ESC)</span>
                  </LiquidButton>
                </header>

                {/* 3D Works Wheel Stage — Fills the entire rest of the screen */}
                <div className="relative z-10 flex-1 w-full h-[calc(100vh-68px)] overflow-hidden bg-gradient-to-b from-[#181516]/85 via-[#0e0b0c]/95 to-[#181516]/85">
                  <WorksWheel
                    key={activeTab}
                    items={activeCollection.items}
                    label={activeCollection.wheelLabel}
                    action="View"
                    activeIndex={wheelActiveIndex}
                    onItemSelect={(item) => {
                      if (onSelectProject) {
                        onSelectProject(item)
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export default GlassFoldersWorkShowcase
