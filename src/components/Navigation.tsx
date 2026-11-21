import React, { useState, useEffect } from "react"
import { Menu, X, Download, ArrowUpRight, FileText, Plus } from "lucide-react"

interface NavigationProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenCvModal, onOpenContactModal }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isHeroInView, setIsHeroInView] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Observe #hero to switch between hero-light theme and dark-board theme
    const heroEl = document.getElementById("hero")
    if (heroEl) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeroInView(entry.isIntersecting)
        },
        { threshold: 0.15 }
      )
      observer.observe(heroEl)
      return () => {
        observer.disconnect()
        window.removeEventListener("scroll", handleScroll)
      }
    }

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
          isHeroInView
            ? "py-5 sm:py-6 bg-transparent"
            : scrolled
            ? "py-2.5 bg-[#211D1D]/90 backdrop-blur-md border-b border-[#CB7885]/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Logo Group */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Anjali Home"
          >
            {isHeroInView ? (
              // Reference Theme: Black Circle with White Lotus Icon + "anjali" wordmark
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full bg-[#161616] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                    <path d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2ZM5.5 8C5.5 8 6 12.5 9 14.5C7 15 5 13.5 4.5 11C4 8.5 5.5 8 5.5 8ZM18.5 8C18.5 8 20 8.5 19.5 11C19 13.5 17 15 15 14.5C18 12.5 18.5 8 18.5 8ZM12 15C9.5 15 7.5 17 7.5 19.5C7.5 21 8.5 22 12 22C15.5 22 16.5 21 16.5 19.5C16.5 17 14.5 15 12 15Z"/>
                  </svg>
                </div>
                <span className="font-sans font-medium text-[14.5px] tracking-[-0.02em] text-[#161616] lowercase">
                  anjali
                </span>
              </div>
            ) : (
              // Dark Theme Monogram for Portfolio Board
              <div className="flex items-center gap-2.5">
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
              </div>
            )}
          </a>

          {/* Desktop Navigation Links */}
          {isHeroInView ? (
            // Reference Theme: Outlined Hairline Pills
            <nav className="hidden md:flex items-center gap-2" role="menubar">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  role="menuitem"
                  className={`text-[12px] font-sans font-medium px-4 py-1.5 rounded-full border border-[#E9E9E9] transition-all duration-200 ${
                    idx === 0
                      ? "text-[#161616] border-[#D1D1D1] bg-white shadow-xs"
                      : "text-[#767676] hover:text-[#161616] hover:border-[#D1D1D1] bg-white/70 backdrop-blur-xs"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          ) : (
            // Dark Theme Nav for Portfolio Board
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
          )}

          {/* Action CTAs */}
          {isHeroInView ? (
            // Reference Theme: Outlined Circular Action Buttons
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={onOpenCvModal}
                className="w-[32px] h-[32px] rounded-full border border-[#E9E9E9] bg-white/75 hover:bg-white hover:border-[#D1D1D1] text-[#161616] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                aria-label="View Curriculum Vitae"
                type="button"
              >
                <FileText className="w-3.5 h-3.5 stroke-[1.8]" />
              </button>

              <button
                onClick={onOpenContactModal}
                className="w-[32px] h-[32px] rounded-full border border-[#E9E9E9] bg-white/75 hover:bg-white hover:border-[#D1D1D1] text-[#161616] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                aria-label="Initiate Inquiry"
                type="button"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
              </button>
            </div>
          ) : (
            // Dark Theme CTAs for Portfolio Board
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
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full border transition-colors ${
              isHeroInView
                ? "border-[#E9E9E9] bg-white text-[#161616]"
                : "border-[#CB7885]/30 text-zinc-300 hover:text-white bg-[#211D1D]"
            }`}
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
