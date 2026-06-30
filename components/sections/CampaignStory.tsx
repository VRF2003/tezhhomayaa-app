"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedText from "@/components/ui/AnimatedText";

export default function CampaignStory({ cmsData }: { cmsData?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.06, 1.0]);

  return (
    <section
      ref={sectionRef}
      id="campaign"
      aria-label="Campaign story — Eclipse Structure"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Full-bleed image ────────────────────────────────── */}
      {cmsData?.image && (
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <Image
            src={cmsData.image}
            alt={cmsData?.title || ""}
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{ filter: "brightness(0.95) contrast(1.08) saturate(0.85)" }}
          />
        </motion.div>
      )}

      {/* ── Localized Text Readability Gradient ──────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle at 10% 50%, rgba(250,250,248,0.65) 0%, rgba(250,250,248,0.15) 35%, transparent 65%)",
        }}
      />

      {/* ── Gold Left Accent Line ──────────────────────────── */}
      <ScrollReveal
        delay={0.2}
        y={0}
        className="absolute left-8 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 hidden md:block"
        aria-hidden="true"
      >
        <div
          style={{
            width: "1px",
            height: "72px",
            background: "linear-gradient(to bottom, var(--gold), transparent)",
          }}
        />
      </ScrollReveal>

      {/* ── Content ────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-24"
        style={{ paddingTop: "clamp(8rem, 15vw, 12rem)", paddingBottom: "clamp(8rem, 15vw, 12rem)" }}
      >
        <div className="max-w-xl">
          {/* Title */}
          {cmsData?.title && (
            <AnimatedText
              text={cmsData.title}
              tag="h2"
              mode="words"
              delay={0.2}
              stagger={0.1}
              duration={1.3}
              className="text-display"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)", display: "block", color: "var(--obsidian)", lineHeight: 1.05 }}
            />
          )}
          
          {cmsData?.subtitle && (
            <AnimatedText
              text={cmsData.subtitle}
              tag="span"
              mode="words"
              delay={0.4}
              stagger={0.1}
              duration={1.3}
              className="text-display"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                display: "block",
                fontStyle: "italic",
                color: "var(--stone)",
                lineHeight: 1.05
              }}
            />
          )}

          {/* Body */}
          {cmsData?.description && (
            <ScrollReveal delay={0.5} y={18} className="mt-8">
              <p
                className="text-editorial whitespace-pre-wrap"
                style={{ fontSize: "1.05rem", lineHeight: 1.85, maxWidth: "330px", color: "var(--slate)" }}
              >
                {cmsData.description}
              </p>
            </ScrollReveal>
          )}

          {/* CTA */}
          {cmsData?.buttonLabel && (
            <ScrollReveal delay={0.65} y={14} className="mt-10">
              <Link
                href={cmsData?.buttonUrl && cmsData?.buttonUrl !== "#" ? cmsData?.buttonUrl : "/"}
                id="campaign-story-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontFamily: "var(--font-cormorant, serif)",
                  fontSize: "1.05rem",
                  fontWeight: 300,
                  color: "var(--obsidian)",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  borderBottom: "1px solid var(--linen)",
                  paddingBottom: "4px",
                  transition: "color 0.3s, border-color 0.3s",
                }}
                className="hover:!text-brand hover:!border-brand"
              >
                {cmsData.buttonLabel}
                <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem" }}>→</span>
              </Link>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
