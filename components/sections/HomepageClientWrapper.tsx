"use client";

import React, { useState, useEffect } from "react";
import { normalizeSectionData } from "@/lib/types/homepage";
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
import JournalSection from "./JournalSection";

// Editorial Blocks
import { 
  EditorialHeading, 
  EditorialParagraph, 
  EditorialDivider, 
  EditorialSpacer, 
  EditorialSingleImage, 
  EditorialButtonGroup,
  EditorialPullQuote,
  EditorialLargeQuote,
  EditorialSplitImageText,
  EditorialTwoColumn,
  EditorialThreeColumn,
  EditorialStickyImage,
  EditorialCaption
} from "./EditorialBlocks";

import {
  EditorialImageGallery,
  EditorialMasonryGallery,
  EditorialVideo,
  EditorialYouTube,
  EditorialImageHotspots,
  EditorialShopTheStory,
  EditorialProductCarousel,
  EditorialRelatedProducts,
  EditorialCompleteTheLook,
  EditorialFeaturedCollection,
  EditorialNewsletter,
  EditorialRelatedStories,
  EditorialCTA,
  EditorialRecentlyViewed,
  EditorialYouMayAlsoLike,
  EditorialStickyPurchaseBar,
  EditorialFloatingWishlist,
  AdvRichTextBlock,
  AdvRawHTMLBlock,
  AdvCodeBlock,
  AdvFounderQuote,
  AdvDownloadBlock,
  AdvContactBlock,
  AdvTimeline,
  AdvStatistics,
  AdvFAQ,
  AdvTabs,
  AdvTable,
  AdvAwards,
  AdvPressLogos,
  AdvSustainability,
  AdvBrandValues,
  AdvBeforeAfter,
  AdvAudioBlock,
  AdvStoreLocator,
  AdvEventCountdown,
  AdvBentoGrid,
  EditorialHero
} from "./DynamicBlocks";

export default function HomepageClientWrapper({ initialSections, articleMetadata }: { initialSections: any[], articleMetadata?: any }) {
  const [sections, setSections] = useState(initialSections);

  const [isAdminPreview, setIsAdminPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminPreview(window.location.search.includes("adminPreview=true"));
    }
  }, []);

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
      {isAdminPreview && (
        <style dangerouslySetInnerHTML={{ __html: `
          a, button { 
            pointer-events: none !important; 
            cursor: default !important; 
          }
        `}} />
      )}
      {sections.filter((s: any) => !s.hidden).map((section: any) => {
        const normData = normalizeSectionData(section.data);
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
            
          case "journal-section":
            return <JournalSection key={section.id} cmsData={section.data} sectionId={section.id} />;

          // Editorial Mapping Phase 2A
          case "editorial-hero":
          case "hero-banner":
            return <EditorialHero key={section.id} section={normData} />;
          case "editorial-heading":
            return <EditorialHeading key={section.id} section={normData} />;
          case "editorial-paragraph":
          case "rich-text-block": // Map legacy rich-text to here if used in journal, or keep separate. We'll leave rich-text-block above, so this just handles the new paragraph.
            return <EditorialParagraph key={section.id} section={normData} />;
          case "divider":
            return <EditorialDivider key={section.id} section={normData} />;
          case "spacer":
            return <EditorialSpacer key={section.id} section={normData} />;
          case "fullscreen-image":
            return <EditorialSingleImage key={section.id} section={normData} />;
          case "button-group":
            return <EditorialButtonGroup key={section.id} section={normData} />;

          // Editorial Mapping Phase 2B
          case "pull-quote":
            return <EditorialPullQuote key={section.id} section={normData} />;
          case "large-quote":
            return <EditorialLargeQuote key={section.id} section={normData} />;
          case "image-text":
            return <EditorialSplitImageText key={section.id} section={normData} />;
          case "two-column-text":
            return <EditorialTwoColumn key={section.id} section={normData} />;
          case "three-column-text":
            return <EditorialThreeColumn key={section.id} section={normData} />;
          case "sticky-image":
            return <EditorialStickyImage key={section.id} section={normData} />;
          case "caption":
            return <EditorialCaption key={section.id} section={normData} />;

          // Editorial Mapping Phase 2C
          case "image-gallery":
            return <EditorialImageGallery key={section.id} section={normData} />;
          case "masonry-gallery":
            return <EditorialMasonryGallery key={section.id} section={normData} />;
          case "video-block":
            return <EditorialVideo key={section.id} section={normData} />;
          case "youtube-embed":
            return <EditorialYouTube key={section.id} section={normData} />;
          case "image-hotspots":
            return <EditorialImageHotspots key={section.id} section={normData} />;

          // Editorial Commerce Mapping Phase 2D
          case "shop-the-story":
            return <EditorialShopTheStory key={section.id} section={normData} />;
          case "product-carousel":
            return <EditorialProductCarousel key={section.id} section={normData} />;
          case "related-products":
            return <EditorialRelatedProducts key={section.id} section={normData} />;
          case "complete-the-look":
            return <EditorialCompleteTheLook key={section.id} section={normData} />;
          case "featured-collection": // Reusing editorial wrapper
            return <EditorialFeaturedCollection key={section.id} section={normData} />;
          case "newsletter-block": // Reusing editorial wrapper
            return <EditorialNewsletter key={section.id} section={normData} />;
          case "related-stories":
            return <EditorialRelatedStories key={section.id} section={normData} />;
          case "editorial-cta":
            return <EditorialCTA key={section.id} section={normData} />;
          case "recently-viewed":
            return <EditorialRecentlyViewed key={section.id} section={normData} />;
          case "you-may-also-like":
            return <EditorialYouMayAlsoLike key={section.id} section={normData} />;
          case "sticky-purchase-bar":
            return <EditorialStickyPurchaseBar key={section.id} section={normData} />;
          case "floating-wishlist":
            return <EditorialFloatingWishlist key={section.id} section={normData} />;

          // Advanced Blocks Phase 2E.1
          case "adv-rich-text":
            return <AdvRichTextBlock key={section.id} section={normData} />;
          case "html-block":
          case "adv-raw-html":
            return <AdvRawHTMLBlock key={section.id} section={normData} />;
          case "code-block":
          case "adv-code-block":
            return <AdvCodeBlock key={section.id} section={normData} />;
          case "adv-founder-quote":
            return <AdvFounderQuote key={section.id} section={normData} />;
          case "adv-download-block":
            return <AdvDownloadBlock key={section.id} section={normData} />;
          case "adv-contact-block":
            return <AdvContactBlock key={section.id} section={normData} />;

          // Advanced Blocks Phase 2E.2
          case "timeline":
          case "adv-timeline":
            return <AdvTimeline key={section.id} section={normData} />;
          case "statistics":
          case "adv-statistics":
            return <AdvStatistics key={section.id} section={normData} />;
          case "faq":
          case "adv-faq":
            return <AdvFAQ key={section.id} section={normData} />;
          case "adv-tabs":
            return <AdvTabs key={section.id} section={normData} />;
          case "table":
          case "adv-table":
            return <AdvTable key={section.id} section={normData} />;
          case "adv-awards":
            return <AdvAwards key={section.id} section={normData} />;
          case "adv-press-logos":
            return <AdvPressLogos key={section.id} section={normData} />;
          case "adv-sustainability":
            return <AdvSustainability key={section.id} section={normData} />;
          case "adv-brand-values":
            return <AdvBrandValues key={section.id} section={normData} />;

          // Advanced Blocks Phase 2E.3
          case "adv-before-after":
            return <AdvBeforeAfter key={section.id} section={normData} />;
          case "adv-audio-block":
            return <AdvAudioBlock key={section.id} section={normData} />;
          case "adv-store-locator":
            return <AdvStoreLocator key={section.id} section={normData} />;
          case "adv-event-countdown":
            return <AdvEventCountdown key={section.id} section={normData} />;
          case "adv-bento-grid":
            return <AdvBentoGrid key={section.id} section={normData} />;

          default:
            return null;
        }
      })}
    </>
  );
}
