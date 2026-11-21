import React, { useEffect, useRef, useState } from "react"

export const ContourBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUseFallback(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setUseFallback(true)
      return
    }

    let isVisible = true
    let isTabActive = !document.hidden
    let animationFrameId: number
    let lastTime = performance.now()
    let frameCount = 0
    let totalFpsTime = 0
    let time = 0

    // Grid configuration for marching squares / field contours
    const cols = 48
    const rows = 32

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    // Visibility observer to pause offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.05 })
    observer.observe(canvas)

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Perlin-like 2D noise evaluation
    const noise2D = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 0.18 + t * 0.35) * Math.cos(y * 0.18 + t * 0.25) +
        Math.sin((x + y) * 0.12 - t * 0.2) * 0.5 +
        Math.cos(x * 0.08 - y * 0.08 + t * 0.15) * 0.35
      )
    }

    // Render loop capped at ~30 FPS
    const targetFps = 30
    const frameInterval = 1000 / targetFps

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render)

      if (!isVisible || !isTabActive) return

      const delta = now - lastTime
      if (delta < frameInterval) return

      // FPS monitoring for first 60 frames
      if (frameCount < 60) {
        totalFpsTime += delta
        frameCount++
        if (frameCount === 60) {
          const avgFps = 1000 / (totalFpsTime / 60)
          if (avgFps < 45) {
            setUseFallback(true)
            return
          }
        }
      }

      lastTime = now - (delta % frameInterval)
      time += 0.008

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      ctx.clearRect(0, 0, width, height)

      ctx.lineWidth = 1.15
      ctx.strokeStyle = "#E9E9E9"

      const cellW = width / cols
      const cellH = height / rows

      // Generate scalar field
      const field: number[][] = []
      for (let i = 0; i <= cols; i++) {
        field[i] = []
        for (let j = 0; j <= rows; j++) {
          field[i][j] = noise2D(i * 0.35, j * 0.35, time)
        }
      }

      // Contour thresholds (isoclines)
      const isoclines = [-0.6, -0.3, 0.0, 0.3, 0.6]

      ctx.beginPath()
      for (const iso of isoclines) {
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const tl = field[i][j] >= iso ? 1 : 0
            const tr = field[i + 1][j] >= iso ? 1 : 0
            const br = field[i + 1][j + 1] >= iso ? 1 : 0
            const bl = field[i][j + 1] >= iso ? 1 : 0
            const cellType = (tl << 3) | (tr << 2) | (br << 1) | bl

            if (cellType === 0 || cellType === 15) continue

            const x0 = i * cellW
            const y0 = j * cellH
            const topX = x0 + cellW * 0.5
            const topY = y0
            const rightX = x0 + cellW
            const rightY = y0 + cellH * 0.5
            const botX = x0 + cellW * 0.5
            const botY = y0 + cellH
            const leftX = x0
            const leftY = y0 + cellH * 0.5

            switch (cellType) {
              case 1:
              case 14:
                ctx.moveTo(leftX, leftY)
                ctx.lineTo(botX, botY)
                break
              case 2:
              case 13:
                ctx.moveTo(botX, botY)
                ctx.lineTo(rightX, rightY)
                break
              case 3:
              case 12:
                ctx.moveTo(leftX, leftY)
                ctx.lineTo(rightX, rightY)
                break
              case 4:
              case 11:
                ctx.moveTo(topX, topY)
                ctx.lineTo(rightX, rightY)
                break
              case 5:
                ctx.moveTo(leftX, leftY)
                ctx.lineTo(topX, topY)
                ctx.moveTo(botX, botY)
                ctx.lineTo(rightX, rightY)
                break
              case 6:
              case 9:
                ctx.moveTo(topX, topY)
                ctx.lineTo(botX, botY)
                break
              case 7:
              case 8:
                ctx.moveTo(leftX, leftY)
                ctx.lineTo(topX, topY)
                break
              case 10:
                ctx.moveTo(topX, topY)
                ctx.lineTo(rightX, rightY)
                ctx.moveTo(leftX, leftY)
                ctx.lineTo(botX, botY)
                break
            }
          }
        }
      }
      ctx.stroke()
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      observer.disconnect()
    }
  }, [])

  if (useFallback) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover" preserveAspectRatio="none">
          <path d="M-50,60 Q200,120 400,70 T800,110 T1250,50" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,140 Q250,190 500,130 T900,180 T1250,130" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,220 Q200,270 450,210 T850,250 T1250,210" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,300 Q300,370 600,290 T1000,340 T1250,290" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,380 Q250,440 550,370 T950,420 T1250,380" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,470 Q200,530 500,460 T900,510 T1250,460" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,550 Q300,620 600,540 T1000,600 T1250,540" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,640 Q250,710 550,630 T950,690 T1250,630" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <path d="M-50,720 Q200,780 500,710 T900,760 T1250,720" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          {/* Organic closed hill loops */}
          <ellipse cx="220" cy="220" rx="90" ry="60" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <ellipse cx="220" cy="220" rx="140" ry="95" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <ellipse cx="980" cy="560" rx="110" ry="75" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
          <ellipse cx="980" cy="560" rx="160" ry="115" fill="none" stroke="#E9E9E9" strokeWidth="1.15" />
        </svg>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-55 z-0"
      aria-hidden="true"
    />
  )
}
