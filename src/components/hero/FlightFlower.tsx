import React, { useEffect, useRef } from "react"
import gsap from "gsap"

export const FlightFlower: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const container = containerRef.current
    if (!container) return

    let animFrame: number
    let mouseX = 0
    let mouseY = 0
    let isHoveringHero = true

    // Pointer parallax while in hero
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.4) {
        isHoveringHero = false
        return
      }
      isHoveringHero = true
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      mouseX = normX * 14
      mouseY = normY * 11
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Flight calculation function
    const updateFlight = () => {
      if (!container) return

      const scrollY = window.scrollY
      const winW = window.innerWidth
      const winH = window.innerHeight

      // 1. Initial Hero Anchor atop the "j" in Anjali
      const heroX = winW * 0.48 + (isHoveringHero ? mouseX : 0)
      const heroY = winH * 0.31 + (isHoveringHero ? mouseY : 0)
      const heroScale = 1.0
      const heroRotation = 0

      // 2. Target Anchor at Top-Right of About Me Portrait Card
      const portraitCard = document.getElementById("about-portrait-card")
      let targetX = heroX
      let targetY = heroY + winH * 0.8
      let targetScale = 0.24
      const targetRotation = -28
      let dockScrollY = winH * 0.85

      if (portraitCard) {
        const pRect = portraitCard.getBoundingClientRect()
        // Top-right corner of the portrait photo frame
        targetX = pRect.right - 28
        targetY = pRect.top + 28
        // When portrait reaches the upper-middle of viewport
        dockScrollY = Math.max(portraitCard.offsetTop - winH * 0.35, 1)
      }

      // Calculate travel progress between hero (0) and about card (1)
      const progress = Math.min(Math.max(scrollY / dockScrollY, 0), 1)

      // Smooth ease for flight
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      let curX: number
      let curY: number
      let curScale: number
      let curRot: number
      let curOpacity = 1

      if (progress < 1) {
        // In flight between hero and about portrait
        curX = heroX + (targetX - heroX) * easedProgress
        curY = heroY + (targetY - heroY) * easedProgress
        curScale = heroScale + (targetScale - heroScale) * easedProgress
        curRot = heroRotation + (targetRotation - heroRotation) * easedProgress
        curOpacity = 1
      } else {
        // Docked onto the portrait card, moving with it
        curX = targetX
        curY = targetY
        curScale = targetScale
        curRot = targetRotation

        // Fade out only if the portrait scrolls completely past the top of the viewport
        if (portraitCard) {
          const pRect = portraitCard.getBoundingClientRect()
          if (pRect.bottom < 50) {
            curOpacity = Math.max(0, (pRect.bottom + 50) / 100)
          } else {
            curOpacity = 1
          }
        }
      }

      if (prefersReducedMotion) {
        curX = heroX
        curY = heroY
        curScale = heroScale
        curRot = 0
      }

      // Apply transform using hardware acceleration
      container.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%) scale(${curScale}) rotate(${curRot}deg)`
      container.style.opacity = `${curOpacity}`

      animFrame = requestAnimationFrame(updateFlight)
    }

    animFrame = requestAnimationFrame(updateFlight)

    // Gentle idle float on flower image when in hero
    if (!prefersReducedMotion && imgRef.current) {
      gsap.to(imgRef.current, {
        y: -6,
        rotation: 0.8,
        duration: 3.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      id="traveling-flight-flower"
      className="fixed top-0 left-0 pointer-events-none select-none"
      style={{
        zIndex: 45,
        width: "clamp(240px, 30vw, 400px)",
        height: "clamp(280px, 35vw, 460px)",
        willChange: "transform, opacity",
        filter: "drop-shadow(0 20px 32px rgba(0, 0, 0, 0.12)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.05))"
      }}
      aria-hidden="true"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <picture>
          <img
            ref={imgRef}
            src="/assets/lily/lily-full.png"
            alt="Botanical Flower Bouquet"
            width={465}
            height={536}
            // @ts-expect-error - fetchpriority is valid HTML attribute
            fetchpriority="high"
            className="w-full h-full object-contain pointer-events-none"
            loading="eager"
          />
        </picture>
      </div>
    </div>
  )
}
