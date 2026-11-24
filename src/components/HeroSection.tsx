import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ContourBackground } from "./hero/ContourBackground"
import { PollenParticles } from "./hero/PollenParticles"
import { FlightFlower } from "./hero/FlightFlower"

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  // Container ref
  const sectionRef = useRef<HTMLElement | null>(null)

  // Element animation refs
  const headlineWrapRef = useRef<HTMLDivElement | null>(null)
  const letterCharRefs = useRef<(HTMLSpanElement | null)[]>([])
  const subtitleRef = useRef<HTMLDivElement | null>(null)

  const letters = ["A", "n", "j", "a", "l", "i"]

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(letterCharRefs.current, { y: 0, opacity: 1, scale: 1, filter: "none" })
        gsap.set(subtitleRef.current, { y: 0, opacity: 1, filter: "none" })
        return
      }

      // ======================================================================
      // A. MASTER INTRO SEQUENCE (Animated entry for whole hero text)
      // ======================================================================
      const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Initial positions
      gsap.set(letterCharRefs.current, { y: 75, opacity: 0, scale: 0.94, filter: "blur(6px)" })
      gsap.set(subtitleRef.current, { y: 25, opacity: 0, filter: "blur(4px)" })

      masterTl
        // 1. Letters of "Anjali" rise and settle with high legibility and spring easing
        .to(letterCharRefs.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.15,
          stagger: 0.05,
          ease: "power4.out"
        }, 0.15)

        // 2. Subtitle "Social Media Manager" rises and expands smoothly
        .to(subtitleRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out"
        }, 0.45)

      // Skip intro on click anywhere in hero
      const handleHeroClick = () => {
        if (masterTl.progress() < 0.9) {
          masterTl.progress(1)
        }
      }
      const sectionEl = sectionRef.current
      if (sectionEl) {
        sectionEl.addEventListener("click", handleHeroClick, { once: true })
      }

      // ======================================================================
      // B. POINTER PARALLAX & VARIABLE-FONT WAVE (Desktop hover)
      // ======================================================================
      if (window.matchMedia("(hover: hover)").matches && sectionEl) {
        const quickHeadlineX = gsap.quickTo(headlineWrapRef.current, "x", { duration: 0.8, ease: "power2.out" })
        const quickHeadlineY = gsap.quickTo(headlineWrapRef.current, "y", { duration: 0.8, ease: "power2.out" })
        const quickSubtitleX = gsap.quickTo(subtitleRef.current, "x", { duration: 0.85, ease: "power2.out" })
        const quickSubtitleY = gsap.quickTo(subtitleRef.current, "y", { duration: 0.85, ease: "power2.out" })

        const handlePointerMove = (e: MouseEvent) => {
          const rect = sectionEl.getBoundingClientRect()
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1

          quickHeadlineX(normX * -3.5)
          quickHeadlineY(normY * -2.5)
          quickSubtitleX(normX * -2.5)
          quickSubtitleY(normY * -1.8)

          letterCharRefs.current.forEach((char) => {
            if (!char) return
            const cRect = char.getBoundingClientRect()
            const cCenterX = cRect.left + cRect.width / 2
            const cCenterY = cRect.top + cRect.height / 2
            const dist = Math.hypot(e.clientX - cCenterX, e.clientY - cCenterY)
            const maxDist = 240
            if (dist < maxDist) {
              const factor = 1 - dist / maxDist
              const nudgeY = -7 * factor
              const weight = Math.round(800 + 100 * factor)
              gsap.to(char, {
                y: nudgeY,
                fontWeight: weight,
                duration: 0.25,
                ease: "power1.out",
                overwrite: "auto"
              })
            } else {
              gsap.to(char, {
                y: 0,
                fontWeight: 800,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
              })
            }
          })
        }

        const handlePointerLeave = () => {
          quickHeadlineX(0)
          quickHeadlineY(0)
          quickSubtitleX(0)
          quickSubtitleY(0)
          letterCharRefs.current.forEach((char) => {
            if (char) gsap.to(char, { y: 0, fontWeight: 800, duration: 0.3 })
          })
        }

        sectionEl.addEventListener("mousemove", handlePointerMove)
        sectionEl.addEventListener("mouseleave", handlePointerLeave)

        return () => {
          sectionEl.removeEventListener("click", handleHeroClick)
          sectionEl.removeEventListener("mousemove", handlePointerMove)
          sectionEl.removeEventListener("mouseleave", handlePointerLeave)
        }
      }

      // ======================================================================
      // C. HEADLINE & SUBTITLE SCROLL FADE
      // ======================================================================
      gsap.to(headlineWrapRef.current, {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "60% top",
          scrub: 1
        },
        y: -70,
        opacity: 0.2,
        ease: "none"
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-x-clip overflow-y-visible select-none cursor-default bg-[#F9EAE6]"
      style={{
        backgroundColor: "var(--hero-blush, #F9EAE6)"
      }}
      aria-label="Hero Showcase"
    >
      {/* ── LAYER 0: Topographic Contour Pattern (Full-Bleed Across Viewport) ── */}
      <ContourBackground />

      {/* ── LAYER 40: Pollen Particles ── */}
      <PollenParticles />

      {/* Top Spacer for Global Fixed Navigation Header */}
      <div className="relative z-10 w-full h-20 sm:h-24 pointer-events-none" />

      {/* ── CENTERPIECE: HUGE HEADLINE + CROWN FLOWER (Layers 10, 20) ── */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8">
        
        {/* ── LAYER 10: Headline "Anjali" + Subtitle "Social Media Manager" ── */}
        <div
          ref={headlineWrapRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 10, willChange: "transform" }}
        >
          <h1
            className="hero-headline-font text-[#161616] tracking-[-0.015em] leading-[0.88] whitespace-nowrap select-none text-center"
            style={{
              fontSize: "clamp(6.2rem, 19.5vw, 17.5rem)",
              fontWeight: 800
            }}
            aria-label="Anjali"
          >
            {letters.map((char, idx) => (
              <span key={idx} className="letter-mask" aria-hidden="true">
                <span
                  ref={(el) => (letterCharRefs.current[idx] = el)}
                  className="letter-char"
                  id={char === "j" ? "hero-letter-j" : undefined}
                >
                  {char}
                </span>
              </span>
            ))}
          </h1>

          {/* ── SUBTITLE: Social Media Manager (Same Black Text as Anjali #161616) ── */}
          <div
            ref={subtitleRef}
            className="mt-3 sm:mt-5 flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/80 border border-[#E9E9E9] backdrop-blur-xs shadow-xs pointer-events-auto"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#161616]" />
            <span className="hero-headline-font text-[11px] sm:text-xs md:text-[13px] tracking-[0.24em] uppercase font-bold text-[#161616]">
              Social Media Manager
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#161616]" />
          </div>
        </div>

        {/* ── LAYER 15: Flower Resting Anchor (Centered atop "j") ── */}
        <div
          id="hero-flower-anchor"
          className="absolute pointer-events-none"
          style={{
            zIndex: 15,
            left: "48%",
            top: "31%",
            width: "4px",
            height: "4px",
            transform: "translate(-50%, -50%)"
          }}
          aria-hidden="true"
        />

      </div>

      {/* ── LAYER 45: Persistent Flight Flower (Travels from top of "j" in Hero to About Portrait) ── */}
      <FlightFlower />

      {/* ── ORGANIC SEAMLESS TRANSITION: Hero (#F9EAE6) gently flows into Editorial Board ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-[#F9EAE6] z-10"
        aria-hidden="true"
      />
    </section>
  )
}
