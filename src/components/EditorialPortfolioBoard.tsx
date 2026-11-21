import React, { useState } from "react"
import { ArrowUpRight, Award, GraduationCap, Briefcase, Mail, Copy, Check, Send, Sparkles, X } from "lucide-react"
import confetti from "canvas-confetti"
import { PORTFOLIO_DATA, Project } from "../data/portfolioData"

interface EditorialPortfolioBoardProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const EditorialPortfolioBoard: React.FC<EditorialPortfolioBoardProps> = ({
  onOpenCvModal,
  onOpenContactModal,
}) => {
  const { personal, skills, uiUxProjects, graphicProjects, socialProjects, experience, education, accolades } =
    PORTFOLIO_DATA

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copied, setCopied] = useState(false)

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
    <div id="portfolio-board" className="relative bg-[#211D1D] py-16 md:py-24 text-[#F5F3EC]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12 md:space-y-16">

        {/* ════════════════════════════════════════════════════════════════════
            TWO-COLUMN ROW 1: ABOUT ME (LEFT) + SKILLS & EXPERTISE (RIGHT)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* PANEL 2: ABOUT ME + PROFILE (7 cols) — Dusty Rose & Ivory Editorial Panel */}
          <div className="lg:col-span-7 rounded-2xl bg-[#CB7885] text-[#211D1D] p-7 sm:p-10 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.3)] relative overflow-hidden border border-[#D4D994]/30">
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

          {/* PANEL 3: SKILLS & CREATIVE MATRIX (5 cols) — Deep Burgundy & Lime Sage Panel */}
          <div className="lg:col-span-5 rounded-2xl bg-[#893941] text-[#F5F3EC] p-7 sm:p-10 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-[#CB7885]/20">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#CB7885]/30 mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4D994] font-bold">
                  02 / CAPABILITIES MATRIX
                </span>
                <span className="text-xs font-mono text-[#CB7885]">Competencies</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFEFA] mb-6">
                Skills & Disciplines
              </h2>

              <div className="space-y-5 text-xs">
                {/* Design Expertise */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4D994] block mb-1.5 font-bold">
                    Design Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.designExpertise.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#211D1D]/50 border border-[#CB7885]/30 text-[11px] text-[#F5F3EC]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Creative Tools */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4D994] block mb-1.5 font-bold">
                    Creative Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.creativeTools.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#211D1D]/50 border border-[#CB7885]/30 text-[11px] text-[#F5F3EC]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical Capabilities */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4D994] block mb-1.5 font-bold">
                    Technical Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.technicalCapabilities.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#211D1D]/50 border border-[#CB7885]/30 text-[11px] text-[#F5F3EC]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#CB7885]/20 mt-6 flex items-center justify-between text-[11px] font-mono text-[#D4D994]">
              <span>Executive Advisory</span>
              <span>100% Code & Craft</span>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════════════════════════════════
            TWO-COLUMN ROW 2: UI/UX DESIGN (LEFT) + GRAPHIC DESIGN (RIGHT)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* PANEL 4: UI / UX DESIGN SHOWCASE (6 cols) — Warm Ivory Editorial Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-[#F5F3EC] text-[#211D1D] p-7 sm:p-9 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#893941]/15">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#211D1D]/15 mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#893941] font-bold">
                  03 / DIGITAL ARCHITECTURE
                </span>
                <span className="text-xs font-mono text-[#5E6623]">Interactive Flagships</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#893941] mb-6">
                UI / UX Design
              </h2>

              <div className="space-y-6">
                {uiUxProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group rounded-xl overflow-hidden border border-[#211D1D]/10 bg-white p-3.5 hover:border-[#893941] transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#211D1D] mb-3 relative">
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#211D1D]/80 text-[9px] font-mono uppercase text-[#F5F3EC]">
                        {project.client}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#893941] text-[9px] font-mono text-[#FFFEFA]">
                        {project.year}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-serif text-lg font-bold text-[#893941] group-hover:text-[#CB7885] transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#893941] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    <p className="text-xs font-serif italic text-[#5E6623] mb-1.5">
                      {project.subtitle}
                    </p>

                    <p className="text-xs text-[#211D1D]/80 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#211D1D]/10 mt-6 flex items-center justify-between text-xs font-mono text-[#893941]">
              <span>2 Featured Digital Systems</span>
              <span className="font-bold underline cursor-pointer" onClick={() => setSelectedProject(uiUxProjects[0])}>Inspect Architecture</span>
            </div>
          </div>

          {/* PANEL 5: GRAPHIC DESIGN SHOWCASE (6 cols) — Olive & Sage Editorial Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-[#211D1D] text-[#F5F3EC] p-7 sm:p-9 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#CB7885]/30">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#CB7885]/20 mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4D994] font-bold">
                  04 / BRAND & PACKAGING
                </span>
                <span className="text-xs font-mono text-[#CB7885]">Visual Identity</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FFFEFA] mb-6">
                Graphic Design
              </h2>

              <div className="space-y-6">
                {graphicProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group rounded-xl overflow-hidden border border-[#CB7885]/20 bg-white/[0.03] p-3.5 hover:border-[#D4D994] transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#211D1D] mb-3 relative">
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#893941] text-[9px] font-mono uppercase text-[#F5F3EC]">
                        {project.client}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#D4D994] text-[9px] font-mono text-[#211D1D] font-bold">
                        {project.year}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-serif text-lg font-bold text-[#FFFEFA] group-hover:text-[#D4D994] transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#D4D994] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    <p className="text-xs font-serif italic text-[#CB7885] mb-1.5">
                      {project.subtitle}
                    </p>

                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#CB7885]/20 mt-6 flex items-center justify-between text-xs font-mono text-[#D4D994]">
              <span>Branding • Foiling • Silkscreening</span>
              <span className="underline cursor-pointer" onClick={() => setSelectedProject(graphicProjects[0])}>View Monograph</span>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════════════════════════════════
            TWO-COLUMN ROW 3: SOCIAL MEDIA DESIGN (LEFT) + EXPERIENCE & EDUCATION (RIGHT)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* PANEL 6: SOCIAL MEDIA DESIGN SHOWCASE (6 cols) — Dusty Rose Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-[#CB7885] text-[#211D1D] p-7 sm:p-9 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#893941]/20">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#893941]/20 mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#893941] font-bold">
                  05 / EDITORIAL CAMPAIGNS
                </span>
                <span className="text-xs font-mono text-[#5E6623]">Social Grids</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#893941] mb-6">
                Social Media Design
              </h2>

              <div className="space-y-6">
                {socialProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group rounded-xl overflow-hidden border border-[#893941]/20 bg-[#F5F3EC] p-3.5 hover:border-[#893941] transition-all cursor-pointer shadow-sm"
                  >
                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#211D1D] mb-3 relative">
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#893941] text-[9px] font-mono uppercase text-[#F5F3EC]">
                        {project.client}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#D4D994] text-[9px] font-mono text-[#211D1D] font-bold">
                        {project.year}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-serif text-lg font-bold text-[#893941] group-hover:text-[#5E6623] transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#893941] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    <p className="text-xs font-serif italic text-[#5E6623] mb-1.5">
                      {project.subtitle}
                    </p>

                    <p className="text-xs text-[#211D1D]/80 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#893941]/20 mt-6 flex items-center justify-between text-xs font-mono text-[#893941]">
              <span>Editorial Lookbooks & Motion</span>
              <span className="font-bold underline cursor-pointer" onClick={() => setSelectedProject(socialProjects[0])}>Inspect Campaign</span>
            </div>
          </div>

          {/* PANEL 7: EXPERIENCE & EDUCATION (6 cols) — Warm Ivory Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-[#F5F3EC] text-[#211D1D] p-7 sm:p-9 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#893941]/15">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#211D1D]/15 mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#893941] font-bold">
                  06 / PEDIGREE & TRAJECTORY
                </span>
                <span className="text-xs font-mono text-[#5E6623]">Credentials</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#893941] mb-6">
                Experience & Education
              </h2>

              {/* Experience Timeline */}
              <div className="space-y-4 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#893941] font-bold block">
                  Professional Experience
                </span>
                <div className="space-y-3">
                  {experience.slice(0, 3).map((exp, idx) => (
                    <div key={idx} className="pb-3 border-b border-[#211D1D]/10 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-serif font-bold text-sm text-[#211D1D]">
                          {exp.role} <span className="font-normal italic text-[#893941]">@ {exp.company}</span>
                        </h4>
                        <span className="text-[10px] font-mono text-[#5E6623]">{exp.period}</span>
                      </div>
                      <p className="text-xs text-[#211D1D]/75 mt-0.5 line-clamp-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Qualifications */}
              <div className="pt-3 border-t border-[#211D1D]/15 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#893941] font-bold block">
                  Academic Pedigree
                </span>
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-serif font-bold text-sm text-[#211D1D]">{edu.degree}</h4>
                      <span className="text-[10px] font-mono text-[#5E6623]">{edu.period}</span>
                    </div>
                    <p className="font-serif italic text-[#893941] text-xs">{edu.institution}</p>
                    <p className="text-[11px] text-[#211D1D]/70">{edu.honors}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#211D1D]/10 mt-6 flex items-center justify-between text-xs font-mono">
              <span className="text-[#5E6623]">24+ International Accolades</span>
              <button onClick={onOpenCvModal} className="text-[#893941] font-bold underline cursor-pointer">
                Full Resume (PDF)
              </button>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════════════════════════════════
            SECTION 8: FULL-WIDTH COLLABORATION & CONTACT PANEL
        ════════════════════════════════════════════════════════════════════ */}
        <div id="contact" className="rounded-2xl bg-[#893941] text-[#F5F3EC] p-8 sm:p-14 shadow-[0_16px_50px_rgba(0,0,0,0.35)] border border-[#CB7885]/30 text-center flex flex-col items-center">
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

      {/* ── IN-DEPTH CASE STUDY MODAL ── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#F5F3EC] text-[#211D1D] border-2 border-[#893941] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg border border-[#893941]/30 text-[#893941] hover:bg-[#893941]/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase text-[#893941] font-bold">
                {selectedProject.client} • {selectedProject.year}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#893941] mt-0.5">
                {selectedProject.title}
              </h3>
              <p className="text-xs font-serif italic text-[#5E6623]">
                {selectedProject.subtitle}
              </p>
            </div>

            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#893941]/20 mb-6 bg-[#211D1D]">
              <img src={selectedProject.heroImage} alt={selectedProject.title} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white border border-[#893941]/15 mb-6 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase text-[#893941] font-bold block">Role</span>
                <span className="text-[#211D1D]">{selectedProject.role}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#893941] font-bold block">Metrics / Impact</span>
                <span className="text-[#5E6623] font-bold">{selectedProject.metrics}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs text-[#211D1D] font-sans leading-relaxed">
              <div>
                <h4 className="text-xs font-semibold text-[#893941] uppercase font-mono tracking-wider mb-1">
                  Design & Architecture Challenge
                </h4>
                <p>{selectedProject.challenge}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#893941] uppercase font-mono tracking-wider mb-1">
                  Engineered Creative Solution
                </h4>
                <p>{selectedProject.solution}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#893941] font-bold block mb-2">Applied Technologies & Mediums</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.technologies.map((t, i) => (
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
