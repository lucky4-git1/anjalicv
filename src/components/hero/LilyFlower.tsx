import React, { useEffect, useRef } from "react"
import gsap from "gsap"

interface LilyFlowerProps {
  bloomRef?: React.RefObject<HTMLDivElement | null>
  budRef?: React.RefObject<HTMLDivElement | null>
  leavesRef?: React.RefObject<HTMLDivElement | null>
  containerRef?: React.RefObject<HTMLDivElement | null>
  isBreathing?: boolean
}

export const LilyFlower: React.FC<LilyFlowerProps> = ({
  bloomRef,
  containerRef,
  isBreathing = false
}) => {
  const localContainerRef = useRef<HTMLDivElement | null>(null)
  const localBloomRef = useRef<HTMLDivElement | null>(null)

  const container = containerRef || localContainerRef
  const bloom = bloomRef || localBloomRef

  // Bloom breath reaction when user clicks chevrons
  useEffect(() => {
    if (!isBreathing || !container.current) return
    gsap.to(container.current, {
      scale: 1.05,
      rotation: "+=1.5",
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
      <div
        ref={bloom}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <picture>
          <img
            src="/assets/lily/lily-full.png"
            alt="Pink Stargazer Lily and Orchid Botanical Composition"
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
