import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"

interface LilyFlowerProps {
  bloomRef?: React.RefObject<HTMLDivElement | null>
  budRef?: React.RefObject<HTMLDivElement | null>
  leavesRef?: React.RefObject<HTMLDivElement | null>
  containerRef?: React.RefObject<HTMLDivElement | null>
  isBreathing?: boolean
}

export const LilyFlower: React.FC<LilyFlowerProps> = ({
  bloomRef: externalBloomRef,
  budRef: externalBudRef,
  leavesRef: externalLeavesRef,
  containerRef: externalContainerRef,
  isBreathing = false
}) => {
  const localContainerRef = useRef<HTMLDivElement | null>(null)
  const localBloomRef = useRef<HTMLDivElement | null>(null)
  const localBudRef = useRef<HTMLDivElement | null>(null)
  const localLeavesRef = useRef<HTMLDivElement | null>(null)

  const container = externalContainerRef || localContainerRef
  const bloom = externalBloomRef || localBloomRef
  const bud = externalBudRef || localBudRef
  const leaves = externalLeavesRef || localLeavesRef

  const [hasLayers, setHasLayers] = useState<boolean | null>(null)
  const [hasFull, setHasFull] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if layered PNGs exist
    const testImg = new Image()
    testImg.src = "/assets/lily/lily-bloom.png"
    testImg.onload = () => setHasLayers(true)
    testImg.onerror = () => {
      // Fallback to single cutout
      const fullImg = new Image()
      fullImg.src = "/assets/lily/lily-full.png"
      fullImg.onload = () => {
        setHasLayers(false)
        setHasFull(true)
      }
      fullImg.onerror = () => {
        setHasLayers(false)
        setHasFull(false)
        console.warn("Lily assets not found. Drop layered PNGs (lily-bloom.png, lily-bud.png, leaf-1.png) or lily-full.png into /public/assets/lily/")
      }
    }
  }, [])

  // Bloom breath reaction when user clicks chevrons
  useEffect(() => {
    if (!isBreathing || !container.current) return
    gsap.to(container.current, {
      scale: 1.05,
      rotation: "+=2",
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })
  }, [isBreathing, container])

  return (
    <div
      ref={container}
      className="relative w-full h-full flex items-center justify-center pointer-events-none select-none"
      style={{
        filter: "drop-shadow(0 22px 34px rgba(0, 0, 0, 0.12)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.05))",
        willChange: "transform"
      }}
    >
      {hasLayers === true ? (
        // Multi-plane layered composition
        <>
          {/* Back radiating leaves layer (z-25) */}
          <div
            ref={leaves}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 25, willChange: "transform" }}
          >
            <picture>
              <img
                src="/assets/lily/leaf-1.png"
                alt=""
                width={431}
                height={455}
                className="w-full h-full object-contain pointer-events-none"
                loading="eager"
              />
            </picture>
          </div>

          {/* Pale-lilac bud layer (z-30) */}
          <div
            ref={bud}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 30, willChange: "transform" }}
          >
            <picture>
              <img
                src="/assets/lily/lily-bud.png"
                alt=""
                width={431}
                height={455}
                className="w-full h-full object-contain pointer-events-none"
                loading="eager"
              />
            </picture>
          </div>

          {/* Main Stargazer Bloom layer (z-30) */}
          <div
            ref={bloom}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 30, willChange: "transform" }}
          >
            <picture>
              <img
                src="/assets/lily/lily-bloom.png"
                alt="Pink Stargazer Lily Bloom"
                width={431}
                height={455}
                // @ts-expect-error - fetchpriority is valid HTML attribute
                fetchpriority="high"
                className="w-full h-full object-contain pointer-events-none"
                loading="eager"
              />
            </picture>
          </div>
        </>
      ) : hasFull === true || hasLayers === null ? (
        // Single cutout composition fallback
        <div
          ref={bloom}
          className="relative w-full h-full pointer-events-none"
          style={{ zIndex: 30, willChange: "transform" }}
        >
          <picture>
            <img
              src="/assets/lily/lily-full.png"
              alt="Pink Stargazer Lily Bloom with foliage and bud"
              width={431}
              height={455}
              // @ts-expect-error - fetchpriority is valid HTML attribute
              fetchpriority="high"
              className="w-full h-full object-contain pointer-events-none"
              loading="eager"
            />
          </picture>
        </div>
      ) : (
        // Vector SVG Botanical Lily fallback if no files present
        <div ref={bloom} className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-[85%] h-[85%]" aria-label="Botanical Stargazer Lily Illustration">
            <defs>
              <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2F5" />
                <stop offset="35%" stopColor="#F4B8CD" />
                <stop offset="70%" stopColor="#E58AA0" />
                <stop offset="100%" stopColor="#B83270" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7E882E" />
                <stop offset="100%" stopColor="#4A5216" />
              </linearGradient>
            </defs>
            {/* Leaves */}
            <path d="M200,200 Q260,100 240,40 Q180,90 200,200Z" fill="url(#leafGrad)" />
            <path d="M200,200 Q110,130 80,90 Q120,160 200,200Z" fill="url(#leafGrad)" />
            <path d="M200,200 Q120,290 90,340 Q150,280 200,200Z" fill="url(#leafGrad)" />
            <path d="M200,200 Q230,310 220,380 Q250,290 200,200Z" fill="url(#leafGrad)" />
            {/* Petals */}
            <path d="M200,200 Q140,80 180,30 Q230,90 200,200Z" fill="url(#petalGrad1)" stroke="#FFF" strokeWidth="2" />
            <path d="M200,200 Q290,120 350,90 Q300,180 200,200Z" fill="url(#petalGrad1)" stroke="#FFF" strokeWidth="2" />
            <path d="M200,200 Q320,240 370,270 Q280,270 200,200Z" fill="url(#petalGrad1)" stroke="#FFF" strokeWidth="2" />
            <path d="M200,200 Q210,310 200,360 Q170,290 200,200Z" fill="url(#petalGrad1)" stroke="#FFF" strokeWidth="2" />
            <path d="M200,200 Q90,260 40,240 Q110,210 200,200Z" fill="url(#petalGrad1)" stroke="#FFF" strokeWidth="2" />
            {/* Center Stamens */}
            <circle cx="200" cy="200" r="10" fill="#E88BAF" />
            <line x1="200" y1="200" x2="225" y2="175" stroke="#E66A2B" strokeWidth="2.5" />
            <circle cx="225" cy="175" r="3" fill="#802800" />
            <line x1="200" y1="200" x2="175" y2="180" stroke="#E66A2B" strokeWidth="2.5" />
            <circle cx="175" cy="180" r="3" fill="#802800" />
          </svg>
        </div>
      )}
    </div>
  )
}
