import React, { useState, useEffect } from "react"
import { Menu, X, Download, ArrowUpRight } from "lucide-react"

interface NavigationProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenCvModal, onOpenContactModal }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Cover", href: "#hero" },
    { name: "About", href: "#portfolio-board" },
    { name: "Portfolio", href: "#portfolio-board" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2.5 bg-[#211D1D]/90 backdrop-blur-md border-b border-[#CB7885]/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Minimalist Monogram / Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#893941] via-[#CB7885] to-[#D4D994] p-[1px] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#211D1D] flex items-center justify-center">
                <span className="font-serif italic font-bold text-xs text-[#D4D994] group-hover:text-white transition-colors">
                  A
                </span>
              </div>
            </div>
            <span className="font-serif tracking-widest text-sm font-semibold text-[#F5F3EC] group-hover:text-[#CB7885] transition-colors">
              ANJALI
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 bg-[#211D1D]/75 backdrop-blur-lg border border-[#CB7885]/20 px-5 py-1.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[11px] font-mono tracking-wider uppercase text-zinc-300 hover:text-[#D4D994] transition-colors py-0.5"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenCvModal}
              className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-full border border-[#CB7885]/30 hover:border-[#D4D994] bg-[#211D1D]/50 hover:bg-[#893941]/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Download className="w-3 h-3 text-[#D4D994]" />
              <span>Resume</span>
            </button>

            <button
              onClick={onOpenContactModal}
              className="px-4 py-1.5 rounded-full bg-[#893941] hover:bg-[#a1434c] text-[#FFFEFA] text-[11px] font-mono uppercase tracking-wider font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_4px_12px_rgba(137,57,65,0.4)] transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3 h-3 text-[#D4D994]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-[#CB7885]/30 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#211D1D]/95 backdrop-blur-xl md:hidden flex flex-col justify-between p-6 pt-24 border-b border-[#CB7885]/20">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif text-[#F5F3EC] hover:text-[#CB7885] py-2 border-b border-[#CB7885]/10 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-[10px] font-mono text-[#D4D994]">0{navLinks.indexOf(link) + 1}</span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 mt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenCvModal()
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#CB7885]/30 text-zinc-300 text-xs font-mono tracking-wider"
            >
              <Download className="w-3.5 h-3.5 text-[#D4D994]" />
              <span>Curriculum Vitae</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenContactModal()
              }}
              className="w-full py-2.5 rounded-xl bg-[#893941] text-[#FFFEFA] text-xs font-mono tracking-wider font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              Initiate Inquiry
            </button>
          </div>
        </div>
      )}
    </>
  )
}
