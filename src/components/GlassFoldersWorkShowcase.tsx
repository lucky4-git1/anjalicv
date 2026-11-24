"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, Sparkles, Eye, Layers, Compass, ArrowUpRight } from "lucide-react"
import GlassFolder, { FolderFile } from "@/components/ui/glass-folder-cards"
import WorksWheel, { WorksWheelItem } from "@/components/ui/works-wheel"

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
  const [wheelActiveIndex, setWheelActiveIndex] = useState<number | undefined>(undefined)

  const activeCollection = COLLECTIONS[activeTab]

  const handleFolderSelect = (key: "reels" | "lookbooks" | "strategy") => {
    setActiveTab(key)
    setOpenFolder(key)
    setWheelActiveIndex(0)
  }

  const handleFileSelect = (key: "reels" | "lookbooks" | "strategy", index: number) => {
    setActiveTab(key)
    setWheelActiveIndex(index)
  }

  return (
    <div className="w-full mt-10 mb-8 rounded-3xl bg-[#211D1D] text-[#F5F3EC] border border-[#CB7885]/25 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] relative overflow-hidden">
      {/* Editorial Dotted Desk Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(#D4D994 1.2px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#893941]/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#CB7885]/25 blur-3xl pointer-events-none" />

      {/* Section Headline */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#CB7885]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#893941]/60 border border-[#CB7885]/30 text-[11px] font-mono tracking-wider uppercase text-[#D4D994] mb-3 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4D994]" />
            Archival Glass Folders & 3D Drum Wheel
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFEFA] font-normal tracking-wide">
            Interactive Work Folders
          </h3>
          <p className="text-xs sm:text-sm font-sans text-zinc-300 mt-2 max-w-xl leading-relaxed">
            Frosted-glass archival folders drawn as tactile objects. Open a folder to fan out its files, or spin the 3D drum wheel to explore the work in deep perspective.
          </p>
        </div>

        {/* Collection Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#171415] p-1.5 rounded-2xl border border-white/10 shrink-0">
          {(["reels", "lookbooks", "strategy"] as const).map((key) => {
            const col = COLLECTIONS[key]
            const isActive = activeTab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleFolderSelect(key)}
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

      {/* ── ROW OF 3 GLASS FOLDER CARDS ON THE DOTTED DESK ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center items-end py-6">
        {/* FOLDER 1: Viral Social Reels */}
        <div
          className={`flex flex-col items-center transition-transform duration-300 cursor-pointer ${
            activeTab === "reels" ? "scale-105" : "opacity-85 hover:opacity-100"
          }`}
          onClick={() => handleFolderSelect("reels")}
        >
          <GlassFolder
            label="Viral Social Reels"
            meta="7 Projects"
            art="aurora"
            seed={3}
            width={310}
            open={openFolder === "reels"}
            onOpenChange={(isOpen) => {
              if (isOpen) handleFolderSelect("reels")
              else if (openFolder === "reels") setOpenFolder(null)
            }}
            files={COLLECTIONS.reels.files}
            onFileSelect={(_, idx) => handleFileSelect("reels", idx)}
          />
          <span className="mt-4 text-xs font-mono uppercase tracking-wider text-[#D4D994] flex items-center gap-1.5">
            {activeTab === "reels" && <span className="w-2 h-2 rounded-full bg-[#D4D994] animate-ping" />}
            Viral Reels Deck ✿
          </span>
        </div>

        {/* FOLDER 2: Aesthetic Lookbooks */}
        <div
          className={`flex flex-col items-center transition-transform duration-300 cursor-pointer ${
            activeTab === "lookbooks" ? "scale-105" : "opacity-85 hover:opacity-100"
          }`}
          onClick={() => handleFolderSelect("lookbooks")}
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
              if (isOpen) handleFolderSelect("lookbooks")
              else if (openFolder === "lookbooks") setOpenFolder(null)
            }}
            files={COLLECTIONS.lookbooks.files}
            onFileSelect={(_, idx) => handleFileSelect("lookbooks", idx)}
            menu={[
              { label: "View in 3D Wheel", onSelect: () => handleFolderSelect("lookbooks") },
              { label: "Share Collection" },
            ]}
          />
          <span className="mt-4 text-xs font-mono uppercase tracking-wider text-[#CB7885] flex items-center gap-1.5">
            {activeTab === "lookbooks" && <span className="w-2 h-2 rounded-full bg-[#CB7885] animate-ping" />}
            Haute Stills Deck ♡
          </span>
        </div>

        {/* FOLDER 3: Brand Strategy & Growth */}
        <div
          className={`flex flex-col items-center transition-transform duration-300 cursor-pointer ${
            activeTab === "strategy" ? "scale-105" : "opacity-85 hover:opacity-100"
          }`}
          onClick={() => handleFolderSelect("strategy")}
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
              if (isOpen) handleFolderSelect("strategy")
              else if (openFolder === "strategy") setOpenFolder(null)
            }}
            files={COLLECTIONS.strategy.files}
            onFileSelect={(_, idx) => handleFileSelect("strategy", idx)}
          />
          <span className="mt-4 text-xs font-mono uppercase tracking-wider text-[#D4D994] flex items-center gap-1.5">
            {activeTab === "strategy" && <span className="w-2 h-2 rounded-full bg-[#D4D994] animate-ping" />}
            Strategy Engine ⚡
          </span>
        </div>
      </div>

      {/* Helpful Hint Pill */}
      <div className="relative z-10 flex items-center justify-center my-4">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#CB7885] bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
          Hover to lean · Click folder to open · Click a file to spin 3D wheel
        </p>
      </div>

      {/* ── 3D WORKS WHEEL DISPLAY (REPLACES STATIC VIEW WITH THE MODEL) ── */}
      <div className="relative z-10 mt-8 rounded-2xl overflow-hidden border border-[#CB7885]/30 bg-[#161314] shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4D994] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#D4D994] font-bold">
              Active Drum: {activeCollection.name}
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-mono">
              {activeCollection.items.length} Curated Works
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span className="hidden sm:inline">Scroll or drag to turn wheel</span>
            <div className="flex items-center gap-1.5 text-[#D4D994] bg-[#211D1D] px-2.5 py-1 rounded-md border border-[#D4D994]/20">
              <Compass className="w-3.5 h-3.5" />
              <span>3D Drum Perspective</span>
            </div>
          </div>
        </div>

        {/* The 3D Works Wheel Stage */}
        <div className="w-full h-[540px] sm:h-[620px] relative bg-gradient-to-b from-[#181516] via-[#120F10] to-[#181516]">
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
      </div>
    </div>
  )
}

export default GlassFoldersWorkShowcase
