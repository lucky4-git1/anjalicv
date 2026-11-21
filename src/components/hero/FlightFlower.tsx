import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const FlightFlower: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const container = containerRef.current
    if (!container) return

    // Flight state object driven by ScrollTrigger
    const flight = { p: 0 }

    // Subtle pointer parallax when resting in hero
    const mousePos = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      if (flight.p > 0.08) return
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      mousePos.targetX = normX * 12
      mousePos.targetY = normY * 8
    }

    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
    }

    // ScrollTrigger to scrub flight progress with smooth physics momentum
    const trigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      endTrigger: "#portrait-flower-anchor",
      end: "center 42%",
      scrub: 1.2,
      onUpdate: (self) => {
        flight.p = self.progress
      }
    })

    // GSAP Ticker ensures buttery 60/120fps sync with zero coordinate drift
    const renderFrame = () => {
      if (!container) return

      const heroAnchor =
        document.getElementById("hero-flower-anchor") ||
        document.getElementById("hero-letter-j")
      const portraitAnchor = document.getElementById("portrait-flower-anchor")

      if (!heroAnchor || !portraitAnchor) return

      const heroRect = heroAnchor.getBoundingClientRect()
      const portRect = portraitAnchor.getBoundingClientRect()

      const p = Math.min(Math.max(flight.p, 0), 1)

      // Smooth pointer parallax falloff
      mousePos.currentX += (mousePos.targetX - mousePos.currentX) * 0.1
      mousePos.currentY += (mousePos.targetY - mousePos.currentY) * 0.1
      const mouseFactor = Math.max(0, 1 - p * 6)

      // Start position (pinned atop "j" in hero)
      const startX = heroRect.left + heroRect.width / 2 + mousePos.currentX * mouseFactor
      const startY = heroRect.top + heroRect.height / 2 + mousePos.currentY * mouseFactor

      // End position (docked on top-right of portrait photo)
      const endX = portRect.left + portRect.width / 2
      const endY = portRect.top + portRect.height / 2

      // Silky cubic-bezier easing for the journey
      const easedP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2

      let curX: number
      let curY: number
      let curScale: number
      let curRot: number
      let curOpacity = 1

      if (p < 1) {
        // In flight: smooth glide with botanical arc (lift + drift)
        curX = startX + (endX - startX) * easedP
        curY = startY + (endY - startY) * easedP

        // Organic arc trajectory: gentle aerodynamic lift as flower travels
        const arc = Math.sin(p * Math.PI)
        curX += arc * -32
        curY += arc * -48

        curScale = 1.0 + (0.25 - 1.0) * easedP
        curRot = 0 + (-26 - 0) * easedP
      } else {
        // Perfectly docked to portrait card, moves with it as user scrolls
        curX = endX
        curY = endY
        curScale = 0.25
        curRot = -26

        // Fade out gracefully only when portrait scrolls past the top of the viewport
        if (portRect.bottom < 80) {
          curOpacity = Math.max(0, portRect.bottom / 80)
        }
      }

      if (prefersReducedMotion) {
        curX = p > 0.5 ? endX : startX
        curY = p > 0.5 ? endY : startY
        curScale = p > 0.5 ? 0.25 : 1.0
        curRot = p > 0.5 ? -26 : 0
      }

      // Apply transform with GPU acceleration
      container.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%) scale(${curScale}) rotate(${curRot}deg)`
      container.style.opacity = `${curOpacity}`
    }

    gsap.ticker.add(renderFrame)

    // Gentle organic breathing float when resting in the hero
    let floatTween: gsap.core.Tween | null = null
    if (!prefersReducedMotion && imgRef.current) {
      floatTween = gsap.to(imgRef.current, {
        y: -6,
        rotation: 0.8,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }

    return () => {
      gsap.ticker.remove(renderFrame)
      trigger.kill()
      if (floatTween) floatTween.kill()
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
        width: "clamp(260px, 32vw, 420px)",
        height: "clamp(300px, 37vw, 480px)",
        willChange: "transform, opacity",
        filter: "drop-shadow(0 20px 32px rgba(0, 0, 0, 0.14)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.06))"
      }}
      aria-hidden="true"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <picture>
          <img
            ref={imgRef}
            src="/assets/lily/lily-full.png"
            alt="Botanical Lily Bouquet"
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
