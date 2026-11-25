"use client";
import React, { useEffect, useState, useRef, useId } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "./use-mobile";

interface Iphone15ProProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  src?: string;
  alt?: string;
}

const Iphone15Pro: React.FC<Iphone15ProProps> = ({
  width = 290,
  height,
  src,
  alt = "iPhone screen content",
  className,
  ...props
}) => {
  const rawId = useId();
  const clipId = `roundedCorners-${rawId.replace(/[^a-zA-Z0-9-_]/g, "")}`;
  const computedHeight =
    typeof height === "number"
      ? height
      : typeof width === "number"
        ? Math.round(width * (882 / 433))
        : undefined;

  return (
    <div className={cn("relative filter drop-shadow-2xl", className)}>
      <svg
        width={width}
        height={computedHeight}
        viewBox="0 0 433 882"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-500 ease-in-out"
        {...props}
      >
        {/* Outer frame */}
        <path
          d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
          className="dark:fill-[#DADADA] fill-[#2B2B2B]"
        />
        {/* side nubs */}
        <path
          d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
          className="dark:fill-[#DADADA] fill-[#2B2B2B]"
        />
        <path
          d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z"
          className="dark:fill-[#DADADA] fill-[#2B2B2B]"
        />
        <path
          d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z"
          className="dark:fill-[#DADADA] fill-[#2B2B2B]"
        />
        <path
          d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z"
          className="dark:fill-[#DADADA] fill-[#2B2B2B]"
        />
        {/* inner body */}
        <path
          d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
          className="fill-[#1A1A1A] dark:fill-gradient-to-b dark:from-white dark:to-[#F0F0F0]"
        />
        <path
          opacity="0.5"
          d="M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z"
          className="dark:fill-[#DADADA] fill-[#383838]"
        />
        {/* screen area */}
        <path
          d="M21.25 75C21.25 44.2101 46.2101 19.25 77 19.25H355C385.79 19.25 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 21.25 837.79 21.25 807V75Z"
          className="dark:fill-[#F5F5F5] fill-[#111111] dark:stroke-[#E0E0E0] stroke-[#222222] stroke-[0.5]"
          filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))"
        />
        {src && (
          <foreignObject
            x="21.25"
            y="19.25"
            width="389.5"
            height="843.5"
            clipPath={`url(#${clipId})`}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor: "#111",
              }}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const filename = src.split("/").pop();
                  if (filename && !src.includes("assets.solaceui.com")) {
                    (e.currentTarget as HTMLImageElement).src = `https://assets.solaceui.com/solaceui-${filename}`;
                  }
                }}
              />
            </div>
          </foreignObject>
        )}
        {/* Dynamic Island notch area */}
        <path
          d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
          className="fill-[#000000] dark:fill-[#000000]"
        />
        <path
          d="M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z"
          className="fill-[#1A1A1A]"
        />
        <path
          d="M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
          className="fill-[#2B2B2B]"
        />
        {/* Highlight border */}
        <path
          d="M76 4C37.3401 4 6 35.3401 6 74V808C6 846.66 37.3401 878 76 878H356C394.66 878 426 846.66 426 808V74C426 35.3401 394.66 4 356 4H76Z"
          className="fill-transparent stroke-white/10 stroke-[0.5]"
        />
        <defs>
          <clipPath id={clipId}>
            <rect
              x="21.25"
              y="19.25"
              width="389.5"
              height="843.5"
              rx="55.75"
              ry="55.75"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export interface ImageItem {
  src: string;
  alt: string;
}

interface PhoneCarouselProps {
  images: ImageItem[];
  className?: string;
  featureMode?: boolean;
  featuresData?: { images: ImageItem[] }[];
  activeFeatureIndex?: number;
}

export const PhoneCarousel: React.FC<PhoneCarouselProps> = ({
  images,
  className,
  featureMode,
  featuresData,
  activeFeatureIndex = 0,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (featureMode) return;

    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && !isHovering && images.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3200);
    }
    return () => clearInterval(interval);
  }, [isPaused, isHovering, images.length, featureMode]);

  if (!isClient) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center">
        <div className="animate-pulse w-64 h-96 rounded-3xl bg-[#893941]/10"></div>
      </div>
    );
  }

  // FEATURE MODE
  if (featureMode && featuresData) {
    const total = featuresData.length;
    const active = activeFeatureIndex;
    const prev = (active - 1 + total) % total;
    const next = (active + 1) % total;

    const prevImage = featuresData[prev].images[0];
    const activeImage = featuresData[active].images[0];
    const nextImage = featuresData[next].images[0];

    return (
      <section
        className={cn("relative w-full py-6 md:py-10 overflow-visible", className)}
        aria-label="iPhone product showcase in feature mode"
      >
        <div className="relative h-[600px] sm:h-[650px] lg:h-[700px] w-full">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            {/* 1) Back phone (prev) */}
            <div
              className="absolute opacity-60 transition-transform duration-500"
              style={{
                transform: "translateY(-20px) scale(0.92)",
                zIndex: 10,
              }}
            >
              <Iphone15Pro
                width={isMobile ? 260 : 330}
                height="auto"
                src={prevImage.src}
                alt={prevImage.alt}
              />
            </div>

            {/* 2) Middle phone (next) */}
            <div
              className="absolute opacity-80 transition-transform duration-500"
              style={{
                transform: "translateY(25px) scale(0.96)",
                zIndex: 20,
              }}
            >
              <Iphone15Pro
                width={isMobile ? 260 : 330}
                height="auto"
                src={nextImage.src}
                alt={nextImage.alt}
              />
            </div>

            {/* 3) Front phone (active) */}
            <div
              className="relative transition-transform duration-500"
              style={{
                transform: "translateY(70px) scale(1)",
                zIndex: 30,
              }}
            >
              <Iphone15Pro
                width={isMobile ? 260 : 330}
                height="auto"
                src={activeImage.src}
                alt={activeImage.alt}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // NORMAL CAROUSEL MODE
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const phoneWidth = isMobile ? 240 : 290;

  return (
    <section
      className={cn("relative w-full py-4 md:py-6 overflow-hidden select-none", className)}
      aria-label="iPhone product showcase"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Main carousel container */}
          <div
            ref={carouselRef}
            className="flex justify-center items-center min-h-[520px] sm:min-h-[590px] md:min-h-[630px] relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative flex justify-center items-center w-full h-full">
              {images.map((image, index) => {
                const isActive = index === currentIndex;
                const isPrevious =
                  index === currentIndex - 1 ||
                  (currentIndex === 0 && index === images.length - 1);
                const isNext =
                  index === currentIndex + 1 ||
                  (currentIndex === images.length - 1 && index === 0);

                let transformStyle = "translateX(0) scale(0.85)";
                if (isActive) {
                  transformStyle = "translateX(0) scale(1)";
                } else if (isPrevious) {
                  transformStyle = isMobile
                    ? "translateX(-45%) scale(0.85)"
                    : "translateX(-65%) scale(0.9)";
                } else if (isNext) {
                  transformStyle = isMobile
                    ? "translateX(45%) scale(0.85)"
                    : "translateX(65%) scale(0.9)";
                }

                return (
                  <div
                    key={index}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform",
                      isActive
                        ? "z-20 opacity-100 cursor-pointer pointer-events-auto"
                        : "opacity-0 pointer-events-none",
                      isPrevious
                        ? "opacity-45 z-10 filter brightness-[0.8] blur-[0.3px] pointer-events-auto cursor-pointer"
                        : "",
                      isNext
                        ? "opacity-45 z-10 filter brightness-[0.8] blur-[0.3px] pointer-events-auto cursor-pointer"
                        : "",
                      !isActive && !isPrevious && !isNext ? "opacity-0 scale-75" : ""
                    )}
                    style={{
                      transform: transformStyle,
                    }}
                    onClick={() => {
                      if (isPrevious) handlePrevious();
                      if (isNext) handleNext();
                    }}
                    aria-hidden={!isActive}
                  >
                    <div className="group transition-transform duration-300">
                      <Iphone15Pro
                        width={phoneWidth}
                        height="auto"
                        src={image.src}
                        alt={image.alt}
                        className="transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 z-30">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full bg-[#2A2424]/80 backdrop-blur-md border-[#CB7885]/30 hover:bg-[#893941] hover:border-[#FFFEFA]/40 shadow-lg transition-all duration-200 text-[#F5F3EC]"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePause}
              className="rounded-full bg-[#2A2424]/80 backdrop-blur-md border-[#CB7885]/30 hover:bg-[#893941] hover:border-[#FFFEFA]/40 shadow-lg transition-all duration-200 text-[#F5F3EC]"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="h-4 w-4 ml-0.5" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full bg-[#2A2424]/80 backdrop-blur-md border-[#CB7885]/30 hover:bg-[#893941] hover:border-[#FFFEFA]/40 shadow-lg transition-all duration-200 text-[#F5F3EC]"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PhoneCarousel;
