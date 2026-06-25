"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ShopBanner() {
  return (
    <section aria-label="Shop The Collection" className="w-full relative">
      <div className="relative w-full h-[60vh] min-h-[500px] md:h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background Image — luxury dolly-in campaign animation */}
        <style>{`
          @keyframes luxuryZoom {
            0%   { transform: scale(1) translateX(0px); }
            100% { transform: scale(1.08) translateX(-20px); }
          }
          .luxury-campaign-img {
            animation: luxuryZoom 18s ease-in-out infinite alternate;
            will-change: transform;
          }
        `}</style>
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/campaign-story.png"
            alt="Tezhhomayaa Collection"
            fill
            sizes="100vw"
            className="object-cover object-[center_30%] luxury-campaign-img"
            style={{
              filter: "brightness(0.7) contrast(1.1) saturate(0.9)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center flex flex-col items-center px-6">
          <ScrollReveal delay={0.1}>
            <span
              className="block mb-6"
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "var(--paper)",
              }}
            >
              TEZHHOMAYAA COLLECTION
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h2
              className="mb-10"
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 300,
                color: "var(--white)",
                lineHeight: 1.1,
              }}
            >
              Shop The Collection
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <a
              href="#collection"
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                color: "var(--white)",
                textDecoration: "none",
                borderBottom: "1px solid var(--white)",
                paddingBottom: "6px",
                transition: "opacity 0.3s ease",
              }}
              className="hover:opacity-70 uppercase"
            >
              Shop Now
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
