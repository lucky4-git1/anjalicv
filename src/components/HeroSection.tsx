import React, { useEffect, useRef, useState, useMemo } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ContourBackground } from "./hero/ContourBackground"
import { LilyFlower } from "./hero/LilyFlower"
import { PollenParticles } from "./hero/PollenParticles"
import { PORTFOLIO_DATA } from "../data/portfolioData"

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onOpenCvModal: () => void
  onOpenContactModal: () => void
}

interface SlideItem {
  id: string
  name: string
  thumb: string
  alt: string
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { personal } = PORTFOLIO_DATA

  // Slides dataset
  const slides: SlideItem[] = useMemo(() => [
    {
      id: "stargazer",
      name: "Stargazer Lily",
      thumb: "/assets/lily/thumb.png",
      alt: "Stargazer Lily Bloom"
    }
  ], [])

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)

  // Container refs
  const sectionRef = useRef<HTMLElement | null>(null)

  // Element animation refs
  const headlineWrapRef = useRef<HTMLHeadingElement | null>(null)
  const letterCharRefs = useRef<(HTMLSpanElement | null)[]>([])
  const flowerDiscRef = useRef<HTMLDivElement | null>(null)
  const flowerContainerRef = useRef<HTMLDivElement | null>(null)
  const bloomRef = useRef<HTMLDivElement | null>(null)
  const bottomBarRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const prevBtnRef = useRef<HTMLButtonElement | null>(null)
  const nextBtnRef = useRef<HTMLButtonElement | null>(null)

  const currentSlide = slides[currentSlideIndex]
  const letters = ["A", "n", "j", "a", "l", "i"]

  const handleChevronClick = (direction: "prev" | "next") => {
    if (slides.length > 1) {
      setCurrentSlideIndex((prev) =>
        direction === "next" ? (prev + 1) % slides.length : (prev - 1 + slides.length) % slides.length
      )
    } else {
      setIsBreathing(true)
      setTimeout(() => setIsBreathing(false), 700)
    }
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(letterCharRefs.current, { y: 0, opacity: 1 })
        gsap.set(flowerDiscRef.current, { scale: 1, opacity: 1 })
        gsap.set(flowerContainerRef.current, { scale: 1, opacity: 1, rotation: 0, x: 0, y: 0 })
        gsap.set(bottomBarRef.current, { opacity: 1, y: 0 })
        return
      }

      // ======================================================================
      // A. MASTER INTRO SEQUENCE (2.2s total, skippable by click)
      // ======================================================================
      const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Initial states
      gsap.set(letterCharRefs.current, { y: 60, opacity: 0 })
      gsap.set(flowerDiscRef.current, { scale: 0, opacity: 0 })
      gsap.set(flowerContainerRef.current, { scale: 0.75, rotation: -8, opacity: 0 })
      gsap.set(bottomBarRef.current, { opacity: 0, y: 14 })

      masterTl
        // 1. Letters of "Anjali" rise and settle with pristine clarity
        .to(letterCharRefs.current, {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.05,
          ease: "power4.out"
        }, 0.15)

        // 2. Soft pastel pink disc scales in
        .to(flowerDiscRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: "back.out(1.25)"
        }, 0.3)

        // 3. Flower rotates into position and blossoms
        .to(flowerContainerRef.current, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.25,
          ease: "expo.out"
        }, 0.45)

        // 4. Bottom UI bar fades and slides in
        .to(bottomBarRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out"
        }, 0.85)

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
      // B. IDLE LIFE: Gentle flower float
      // ======================================================================
      gsap.to(bloomRef.current, {
        y: -6,
        rotation: 0.8,
        duration: 3.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.8
      })

      // ======================================================================
      // C. POINTER PARALLAX & VARIABLE-FONT WAVE (Desktop hover: hover)
      // ======================================================================
      if (window.matchMedia("(hover: hover)").matches && sectionEl) {
        const quickBloomX = gsap.quickTo(flowerContainerRef.current, "x", { duration: 0.55, ease: "power2.out" })
        const quickBloomY = gsap.quickTo(flowerContainerRef.current, "y", { duration: 0.55, ease: "power2.out" })
        const quickDiscX = gsap.quickTo(flowerDiscRef.current, "x", { duration: 0.75, ease: "power2.out" })
        const quickDiscY = gsap.quickTo(flowerDiscRef.current, "y", { duration: 0.75, ease: "power2.out" })
        const quickHeadlineX = gsap.quickTo(headlineWrapRef.current, "x", { duration: 0.8, ease: "power2.out" })
        const quickHeadlineY = gsap.quickTo(headlineWrapRef.current, "y", { duration: 0.8, ease: "power2.out" })

        const handleMagnetic = (btn: HTMLElement | null, e: MouseEvent) => {
          if (!btn) return
          const rect = btn.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const distX = e.clientX - centerX
          const distY = e.clientY - centerY
          const dist = Math.hypot(distX, distY)
          if (dist < 60) {
            gsap.to(btn, { x: distX * 0.35, y: distY * 0.35, duration: 0.25, ease: "power2.out" })
          } else {
            gsap.to(btn, { x: 0, y: 0, duration: 0.35, ease: "elastic.out(1, 0.4)" })
          }
        }

        const handlePointerMove = (e: MouseEvent) => {
          const rect = sectionEl.getBoundingClientRect()
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1

          quickBloomX(normX * 13)
          quickBloomY(normY * 11)
          quickDiscX(normX * 6)
          quickDiscY(normY * 5)
          quickHeadlineX(normX * -3.5)
          quickHeadlineY(normY * -2.5)

          handleMagnetic(prevBtnRef.current, e)
          handleMagnetic(nextBtnRef.current, e)

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
          quickBloomX(0)
          quickBloomY(0)
          quickDiscX(0)
          quickDiscY(0)
          quickHeadlineX(0)
          quickHeadlineY(0)
          if (prevBtnRef.current) gsap.to(prevBtnRef.current, { x: 0, y: 0, duration: 0.3 })
          if (nextBtnRef.current) gsap.to(nextBtnRef.current, { x: 0, y: 0, duration: 0.3 })
          letterCharRefs.current.forEach((char) => {
            if (char) gsap.to(char, { y: 0, fontWeight: 800, duration: 0.3 })
          })
        }

        sectionEl.addEventListener("mousemove", handlePointerMove)
        sectionEl.addEventListener("mouseleave", handlePointerLeave)
      }

      // ======================================================================
      // D. SCROLL JOURNEY: FLOWER ROTATES & FLIES DOWN TO ABOUT ME PORTRAIT CORNER
      // (NO BLACK OVERLAY / NO BLACKED EFFECT)
      // ======================================================================
      gsap.to(flowerContainerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2
        },
        y: 420,
        x: -160,
        scale: 0.38,
        rotation: -42,
        ease: "power1.inOut"
      })

      gsap.to(flowerDiscRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1
        },
        scale: 0.2,
        opacity: 0,
        ease: "power1.out"
      })

      gsap.to(headlineWrapRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "70% top",
          scrub: 1
        },
        y: -90,
        opacity: 0.15,
        ease: "none"
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [slides.length])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden select-none cursor-default bg-[#F9EAE6]"
      style={{
        backgroundColor: "var(--hero-blush, #F9EAE6)",
        isolation: "isolate"
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

      {/* ── CENTERPIECE: HUGE HEADLINE + PINK DISC + LILY BLOOM (Layers 10, 20, 30) ── */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8">
        
        {/* ── LAYER 10: Headline "Anjali" (Properly Visible, Title Case with Visible Dots) ── */}
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
                >
                  {char}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* ── LAYER 20: Soft Pastel Pink Disc (--hero-circle, behind bloom) ── */}
        <div
          ref={flowerDiscRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            zIndex: 20,
            width: "clamp(200px, 24vw, 320px)",
            height: "clamp(200px, 24vw, 320px)",
            backgroundColor: "var(--hero-circle, #FDE8EC)",
            left: "var(--flower-x, 50%)",
            top: "49.5%",
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity"
          }}
          aria-hidden="true"
        />

        {/* ── LAYER 30: Botanical Lily & Orchid Bouquet (Center Balanced, Anjali Clearly Visible) ── */}
        <div
          ref={flowerContainerRef}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            zIndex: 30,
            width: "clamp(250px, 32vw, 420px)",
            height: "clamp(290px, 37vw, 490px)",
            left: "var(--flower-x, 50%)",
            top: "49%",
            transform: "translate(-50%, -50%)",
            willChange: "transform"
          }}
        >
          <LilyFlower
            bloomRef={bloomRef}
            isBreathing={isBreathing}
          />
        </div>

      </div>

      {/* ── LAYER 50: Canvas Bottom UI Bar (Thumbnail, Label, Chevrons) ── */}
      <div
        ref={bottomBarRef}
        className="relative z-50 w-full flex items-center justify-between px-6 sm:px-12 pb-6 sm:pb-8 pointer-events-auto"
      >
        {/* Bottom-Left: Round Thumbnail + Label */}
        <div className="flex items-center gap-3">
          <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-[#ECECEC] bg-zinc-100 shadow-xs flex-shrink-0">
            <img
              src={currentSlide.thumb}
              alt=""
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-sans font-medium text-[13.5px] tracking-[-0.015em] text-[#161616]">
            {currentSlide.name}
          </span>
        </div>

        {/* Bottom-Center: Subtle Role Tagline */}
        <div className="hidden md:block">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
            {personal.title}
          </span>
        </div>

        {/* Bottom-Right: Outlined Chevron Arrows */}
        <div className="flex items-center gap-2">
          <button
            ref={prevBtnRef}
            onClick={() => handleChevronClick("prev")}
            className="w-[32px] h-[32px] sm:w-[30px] sm:h-[30px] rounded-full border border-[#D1D1D1] bg-white/80 hover:bg-white hover:border-[#161616] text-[#161616] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            aria-label="Previous flower slide"
            type="button"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
          </button>

          <button
            ref={nextBtnRef}
            onClick={() => handleChevronClick("next")}
            className="w-[32px] h-[32px] sm:w-[30px] sm:h-[30px] rounded-full border border-[#D1D1D1] bg-white/80 hover:bg-white hover:border-[#161616] text-[#161616] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            aria-label="Next flower slide"
            type="button"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      </div>

    </section>
  )
}
