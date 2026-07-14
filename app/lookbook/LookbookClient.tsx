"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Slide = {
  id: string;
  name: string;
  image: string;
  subtitle: string;
  video?: string;
  mobileImage?: string;
  mobileVideo?: string;
};

// Sub-component to handle responsive media and video playback state
function SlideMedia({ slide, isActive }: { slide: Slide, isActive: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isActive) {
        video.currentTime = 0;
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }
  }, [isActive]);

  const activeVideo = isMobile && slide.mobileVideo ? slide.mobileVideo : slide.video;
  const activeImage = isMobile && slide.mobileImage ? slide.mobileImage : slide.image;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      {activeVideo ? (
        <video 
          ref={videoRef}
          src={activeVideo}
          muted
          loop
          playsInline
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transform: isActive ? "scale(1)" : "scale(1.1)",
            transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />
      ) : (
        <Image 
          src={activeImage || "/images/collection-banner.jpg"}
          alt={slide.name}
          fill
          style={{ 
            objectFit: "cover",
            transform: isActive ? "scale(1)" : "scale(1.1)",
            transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
          priority
        />
      )}
      {/* Gradient Overlay for Text Readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)",
      }} />
    </div>
  );
}

interface LookbookClientProps {
  initialSlides: Slide[];
}

export default function LookbookClient({ initialSlides }: LookbookClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex]);

  return (
    <div 
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        position: "relative",
      }}
    >
      {/* Close/Back Button */}
      <Link 
        href="/"
        style={{
          position: "fixed",
          top: "2rem",
          right: "2rem",
          zIndex: 50,
          color: "#ffffff",
          fontFamily: "var(--font-jost, sans-serif)",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textDecoration: "none",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(4px)",
          padding: "0.8rem 1.2rem",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        Close
      </Link>

      {/* Progress Indicators */}
      <div style={{
        position: "fixed",
        right: "2rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem"
      }}>
        {initialSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              containerRef.current?.scrollTo({
                top: idx * window.innerHeight,
                behavior: "smooth"
              });
            }}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: "4px",
              height: activeIndex === idx ? "32px" : "12px",
              background: "#ffffff",
              opacity: activeIndex === idx ? 1 : 0.4,
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              padding: 0
            }}
          />
        ))}
      </div>

      {/* Slides */}
      {initialSlides.map((slide, idx) => {
        const isActive = activeIndex === idx;
        
        return (
          <section 
            key={slide.id}
            style={{
              height: "100vh",
              width: "100vw",
              scrollSnapAlign: "start",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Media handled by subcomponent to manage refs and resizing cleanly */}
            <SlideMedia slide={slide} isActive={isActive} />

            {/* Content */}
            <div style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              padding: "0 2rem",
              width: "100%",
              maxWidth: "800px"
            }}>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  fontFamily: "var(--font-cormorant, serif)",
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  fontWeight: 100,
                  color: "#ffffff",
                  margin: "0 0 1rem",
                  letterSpacing: "0.02em",
                  lineHeight: 1.1
                }}
              >
                {slide.name}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  fontFamily: "var(--font-jost, sans-serif)",
                  fontSize: "clamp(0.8rem, 2vw, 1rem)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                  margin: "0 0 3rem"
                }}
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
              >
                <Link
                  href={`/collections/${slide.id}`}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-jost, sans-serif)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#000000",
                    background: "#ffffff",
                    padding: "1.2rem 3rem",
                    textDecoration: "none",
                    border: "1px solid #ffffff",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.color = "#000000";
                  }}
                >
                  Explore Collection
                </Link>
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
