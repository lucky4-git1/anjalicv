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
  const headlineWrapRef = useRef<HTMLHeadingElement | null>(null)
  const letterCharRefs = useRef<(HTMLSpanElement | null)[]>([])
  const flowerDiscRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)

  const letters = ["A", "n", "j", "a", "l", "i"]

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(letterCharRefs.current, { y: 0, opacity: 1 })
        gsap.set(flowerDiscRef.current, { scale: 1, opacity: 1 })
        return
      }

      // ======================================================================
      // A. MASTER INTRO SEQUENCE (2.0s, skippable by click)
      // ======================================================================
      const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Initial positions
      gsap.set(letterCharRefs.current, { y: 55, opacity: 0 })
      gsap.set(flowerDiscRef.current, { scale: 0, opacity: 0 })

      masterTl
        // 1. Letters of "Anjali" rise and settle with high legibility
        .to(letterCharRefs.current, {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.05,
          ease: "power4.out"
        }, 0.15)

        // 2. Soft pastel pink disc scales in behind bloom
        .to(flowerDiscRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: "back.out(1.25)"
        }, 0.3)

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
        const quickDiscX = gsap.quickTo(flowerDiscRef.current, "x", { duration: 0.75, ease: "power2.out" })
        const quickDiscY = gsap.quickTo(flowerDiscRef.current, "y", { duration: 0.75, ease: "power2.out" })
        const quickHeadlineX = gsap.quickTo(headlineWrapRef.current, "x", { duration: 0.8, ease: "power2.out" })
        const quickHeadlineY = gsap.quickTo(headlineWrapRef.current, "y", { duration: 0.8, ease: "power2.out" })

        const handlePointerMove = (e: MouseEvent) => {
          const rect = sectionEl.getBoundingClientRect()
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1

          quickDiscX(normX * 6)
          quickDiscY(normY * 5)
          quickHeadlineX(normX * -3.5)
          quickHeadlineY(normY * -2.5)

          if (cursorRef.current) {
            cursorRef.current.style.left = `${e.clientX}px`
            cursorRef.current.style.top = `${e.clientY}px`
          }

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
          quickDiscX(0)
          quickDiscY(0)
          quickHeadlineX(0)
          quickHeadlineY(0)
          letterCharRefs.current.forEach((char) => {
            if (char) gsap.to(char, { y: 0, fontWeight: 800, duration: 0.3 })
          })
        }

        sectionEl.addEventListener("mousemove", handlePointerMove)
        sectionEl.addEventListener("mouseleave", handlePointerLeave)
      }

      // ======================================================================
      // C. SCROLL DISCS & HEADLINE FADE
      // ======================================================================
      gsap.to(flowerDiscRef.current, {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "45% top",
          scrub: 1
        },
        scale: 0.2,
        opacity: 0,
        ease: "power1.out"
      })

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
      {/* Soft Custom Magnetic Cursor */}
      <div
        ref={cursorRef}
        className="hero-cursor-dot hidden lg:block"
        aria-hidden="true"
      />

      {/* ── LAYER 0: Topographic Contour Pattern (Full-Bleed Across Viewport) ── */}
      <ContourBackground />

      {/* ── LAYER 40: Pollen Particles ── */}
      <PollenParticles />

      {/* Top Spacer for Global Fixed Navigation Header */}
      <div className="relative z-10 w-full h-20 sm:h-24 pointer-events-none" />

      {/* ── CENTERPIECE: HUGE HEADLINE + CROWN FLOWER (Layers 10, 20) ── */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8">
        
        {/* ── LAYER 10: Headline "Anjali" (Full Visibility, Single-Storey Geometric, Round Dots) ── */}
        <div
          ref={headlineWrapRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
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

        {/* ── LAYER 20: Soft Pastel Pink Disc (Perched behind bloom atop "j") ── */}
        <div
          ref={flowerDiscRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            zIndex: 20,
            width: "clamp(190px, 23vw, 310px)",
            height: "clamp(190px, 23vw, 310px)",
            backgroundColor: "var(--hero-circle, #FDE8EC)",
            left: "48%",
            top: "32%",
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity"
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
