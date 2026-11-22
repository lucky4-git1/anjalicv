import React from "react"
import { X, Printer } from "lucide-react"
import { PORTFOLIO_DATA } from "../data/portfolioData"

interface CvModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const { personal, experience, education, accolades } = PORTFOLIO_DATA

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#F5F3EC] text-[#211D1D] rounded-2xl p-6 sm:p-10 shadow-2xl border-2 border-[#893941] print:p-0 print:m-0 print:shadow-none print:w-full print:border-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#211D1D]/15 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#893941]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#893941] font-bold">
              Official Curriculum Vitae • Anjali Rajput
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#893941] text-[#FFFEFA] text-xs font-mono uppercase tracking-wider hover:bg-[#a1434c] transition-colors cursor-pointer"
            >
              <Printer className="w-3 h-3 text-[#D4D994]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#211D1D]/10 hover:bg-[#211D1D]/20 text-[#211D1D] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PRINTABLE EDITORIAL CV SHEET ── */}
        <div className="space-y-6 text-xs sm:text-sm">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b-2 border-[#893941]">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#893941]">
                {personal.fullName}
              </h1>
              <p className="text-xs font-serif italic text-[#5E6623] mt-0.5">
                {personal.title}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 text-left sm:text-right text-[11px] font-mono text-[#211D1D]/80">
              <p>{personal.location}</p>
              <p>{personal.email}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#893941] font-bold mb-1.5">
              Profile & Practice
            </h2>
            <p className="font-sans leading-relaxed text-[#211D1D]/90">
              {personal.bio} Over 10 years directing luxury brand identity systems, high-ticket digital flagships, and spatial WebGL engines, resulting in over $140M in transaction uplift and 24+ global accolades (Awwwards, Red Dot, Cannes Lions).
            </p>
          </div>

          {/* Experience Anthology */}
          <div>
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#893941] font-bold mb-4">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={idx} className="pb-4 border-b border-[#211D1D]/10 last:border-b-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                    <h3 className="font-serif font-bold text-base text-[#211D1D]">
                      {exp.role} <span className="font-normal italic text-[#893941]">@ {exp.company}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-[#5E6623]">{exp.period} • {exp.location}</span>
                  </div>
                  <p className="text-xs font-sans text-[#211D1D]/80 mb-2">
                    {exp.description}
                  </p>
                  <ul className="space-y-1 list-disc list-inside text-xs font-sans text-[#211D1D]/90">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Background & Honors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#893941]/20">
            <div>
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#893941] font-bold mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <h4 className="font-serif font-bold text-sm text-[#211D1D]">{edu.degree}</h4>
                    <p className="text-xs font-serif italic text-[#893941]">{edu.institution} ({edu.period})</p>
                    <p className="text-[11px] font-sans text-[#211D1D]/80">{edu.honors}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#893941] font-bold mb-3">
                Selected Honors
              </h2>
              <div className="space-y-1.5 text-xs font-sans">
                {accolades.slice(0, 5).map((acc, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 border-b border-[#211D1D]/10">
                    <span className="font-semibold text-[#211D1D]">{acc.title} ({acc.organization})</span>
                    <span className="text-[#893941] font-mono text-[11px]">{acc.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
