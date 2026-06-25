"use client";

import React, { useState, useEffect } from "react";
import HeroFilm from "./HeroFilm";
import SingleCampaignBanner from "./SingleCampaignBanner";
import EditorialSection from "./EditorialSection";
import CollectionShowcase from "./CollectionShowcase";
import SplitLayout from "./SplitLayout";
import RichTextBlock from "./RichTextBlock";
import QuoteBlock from "./QuoteBlock";
import NewsletterBlock from "./NewsletterBlock";
import InstagramFeed from "./InstagramFeed";
import ContactInfoBlock from "./ContactInfoBlock";
import ContactForm from "./ContactForm";
import SocialPresence from "./SocialPresence";

// Motion Experience
import MotionArrival from "./motion/MotionArrival";
import MotionManifesto from "./motion/MotionManifesto";
import MotionCanvas from "./motion/MotionCanvas";
import MotionStorytelling from "./motion/MotionStorytelling";
import MotionValues from "./motion/MotionValues";
import MotionAtelier from "./motion/MotionAtelier";
import MotionFuture from "./motion/MotionFuture";
import MotionSignature from "./motion/MotionSignature";

export default function HomepageClientWrapper({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    // Only listen if we are inside an iframe
    if (typeof window !== "undefined" && window !== window.parent) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "SYNC_PREVIEW" && event.data?.sections) {
          setSections(event.data.sections);
        }
      };
      window.addEventListener("message", handleMessage);
      
      // Let the parent know we are ready to receive data
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
      
      return () => window.removeEventListener("message", handleMessage);
    }
  }, []);

  return (
    <>
      {sections.filter((s: any) => !s.hidden).map((section: any) => {
        switch (section.type) {
          case "hero-slider":
            return <HeroFilm key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "spacer":
            const dH = section.data?.heightDesktop || 128;
            const mH = section.data?.heightMobile || 96;
            return (
              <div key={section.id} className="w-full" aria-hidden="true">
                <style dangerouslySetInnerHTML={{ __html: `
                  .spacer-${section.id} { height: ${mH}px; }
                  @media (min-width: 768px) { .spacer-${section.id} { height: ${dH}px; } }
                `}} />
                <div className={`spacer-${section.id}`} />
              </div>
            );

          case "image-section":
            return <SingleCampaignBanner key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "collection-showcase":
            return <CollectionShowcase key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "editorial-section":
            return <EditorialSection key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "split-layout":
          case "split-image-section":
            return <SplitLayout key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "rich-text-block":
            return <RichTextBlock key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "lookbook-grid":
            // Reuse CollectionShowcase for Lookbook since it supports masonry/grids
            return <CollectionShowcase key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "quote-block":
            return <QuoteBlock key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "newsletter-block":
            return <NewsletterBlock key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "instagram-feed":
            return <InstagramFeed key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "contact-info-block":
            return <ContactInfoBlock key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "contact-form":
            return <ContactForm key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "social-presence":
            return <SocialPresence key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "product-carousel":
          case "featured-collection":
            // Fallback to EditorialSection for text-heavy or simple media blocks until specialized components are built
            return <EditorialSection key={section.id} cmsData={section.data} sectionId={section.id} />;

          case "motion-arrival":
            return <MotionArrival key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-manifesto":
            return <MotionManifesto key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-canvas":
            return <MotionCanvas key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-storytelling":
            return <MotionStorytelling key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-values":
            return <MotionValues key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-atelier":
            return <MotionAtelier key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-future":
            return <MotionFuture key={section.id} cmsData={section.data} sectionId={section.id} />;
          
          case "motion-signature":
            return <MotionSignature key={section.id} cmsData={section.data} sectionId={section.id} />;

          default:
            return null;
        }
      })}
    </>
  );
}
