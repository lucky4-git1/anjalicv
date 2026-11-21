import React, { useEffect, useRef } from "react"

export const PollenParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let isVisible = true
    let isTabActive = !document.hidden
    let animationFrameId: number

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.05 })
    observer.observe(canvas)

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // 7 faint glowing particles
    const particleCount = 7
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      radius: Math.random() * 2.2 + 1.2,
      vx: (Math.random() - 0.45) * 0.4,
      vy: Math.random() * 0.35 + 0.15,
      alpha: Math.random() * 0.35 + 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? "244, 184, 205" : "229, 138, 160" // Rose/Blush tones
    }))

    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      if (!isVisible || !isTabActive) return

      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.wobble += p.wobbleSpeed
        p.x += p.vx + Math.sin(p.wobble) * 0.3
        p.y += p.vy

        // Wrap around bounds
        if (p.y > height + 10) p.y = -10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`
        ctx.shadowColor = `rgba(${p.color}, 0.5)`
        ctx.shadowBlur = 4
        ctx.fill()
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-40"
      aria-hidden="true"
    />
  )
}
