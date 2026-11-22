import React, { useState, useEffect } from "react"
import { Menu, X, FileText, Plus, Heart } from "lucide-react"

interface NavigationProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenCvModal, onOpenContactModal }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("hero")

  const navLinks = [
    { id: "hero", name: "Home", href: "#hero" },
    { id: "about", name: "About", href: "#about" },
    { id: "work", name: "Work", href: "#work" },
    { id: "contact", name: "Contact", href: "#contact" },
  ]

  useEffect(() => {
    let ticking = false

    const updateActiveSection = () => {
      const scrollY = window.scrollY
      const winHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      setScrolled(scrollY > 25)

      // 1. Top of page
      if (scrollY < 100) {
        setActiveSection("hero")
        ticking = false
        return
      }

      // 2. Bottom of page
      if (winHeight + scrollY >= docHeight - 70) {
        setActiveSection("contact")
        ticking = false
        return
      }

      // 3. Focal point at 38% of viewport
      const focalY = winHeight * 0.38
      const sectionIds = ["hero", "about", "work", "contact"]
      let current = ""

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Section currently contains the focal line
        if (rect.top <= focalY && rect.bottom > focalY) {
          current = id
          break
        }
      }

      // Smooth fallback to last section whose top was passed
      if (!current) {
        for (const id of sectionIds) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top <= focalY) {
            current = id
          }
        }
      }

      if (current) {
        setActiveSection(current)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateActiveSection() // Initial check on mount

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[#F9EAE6]/85 backdrop-blur-md border-b border-[#CB7885]/20 shadow-[0_4px_24px_rgba(137,57,65,0.06)]"
            : "py-5 sm:py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Logo Group */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Anjali Home"
          >
            <div className="w-[34px] h-[34px] rounded-full bg-[#161616] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                <path d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2ZM5.5 8C5.5 8 6 12.5 9 14.5C7 15 5 13.5 4.5 11C4 8.5 5.5 8 5.5 8ZM18.5 8C18.5 8 20 8.5 19.5 11C19 13.5 17 15 15 14.5C18 12.5 18.5 8 18.5 8ZM12 15C9.5 15 7.5 17 7.5 19.5C7.5 21 8.5 22 12 22C15.5 22 16.5 21 16.5 19.5C16.5 17 14.5 15 12 15Z"/>
              </svg>
            </div>
            <span className="font-sans font-medium text-[14.5px] tracking-[-0.02em] text-[#161616] lowercase">
              anjali
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2" role="menubar">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  role="menuitem"
                  className={`text-[12px] font-sans font-medium px-4 py-1.5 rounded-full border transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? "text-[#161616] border-[#161616]/25 bg-white shadow-xs font-semibold scale-[1.03]"
                      : "text-[#555] hover:text-[#161616] hover:border-[#D1D1D1] bg-white/70 backdrop-blur-xs border-[#E9E9E9]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && (
                      <Heart className="w-2.5 h-2.5 fill-[#893941] text-[#893941] shrink-0 animate-pulse" />
                    )}
                    {link.name}
                  </span>
                </a>
              )
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenCvModal}
              className="w-[32px] h-[32px] rounded-full border border-[#E9E9E9] bg-white/80 hover:bg-white hover:border-[#D1D1D1] text-[#161616] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
              aria-label="View Curriculum Vitae"
              title="Curriculum Vitae"
              type="button"
            >
              <FileText className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>

            <button
              onClick={onOpenContactModal}
              className="w-[32px] h-[32px] rounded-full border border-[#E9E9E9] bg-white/80 hover:bg-white hover:border-[#D1D1D1] text-[#161616] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
              aria-label="Initiate Inquiry"
              title="Initiate Inquiry"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-[#E9E9E9] bg-white text-[#161616]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F9EAE6]/98 backdrop-blur-xl md:hidden flex flex-col justify-between p-6 pt-24 border-b border-[#CB7885]/20 text-[#211D1D]">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-lg font-serif py-2 border-b border-[#CB7885]/15 flex items-center justify-between transition-colors ${
                    isActive
                      ? "text-[#893941] font-bold pl-2"
                      : "text-[#211D1D] hover:text-[#893941]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <Heart className="w-3 h-3 fill-[#893941] text-[#893941] shrink-0" />
                    )}
                    {link.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#5E6623]">0{idx + 1}</span>
                </a>
              )
            })}
          </nav>

          <div className="flex flex-col gap-2.5 mt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenCvModal()
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#CB7885]/30 text-[#893941] text-xs font-mono tracking-wider bg-white shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#CB7885]" />
              <span>Curriculum Vitae</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenContactModal()
              }}
              className="w-full py-2.5 rounded-xl bg-[#893941] text-[#FFFEFA] text-xs font-mono tracking-wider font-medium shadow-md"
            >
              Initiate Inquiry
            </button>
          </div>
        </div>
      )}
    </>
  )
}
