import { UniversalMediaData } from "@/components/sections/UniversalMediaRenderer";
import { BreakpointConfig } from "@/components/admin/AppearanceProvider";

export type SectionType = 
  | "hero-slider"
  | "collection-showcase"
  | "editorial-section"
  | "split-layout"
  | "image-section"
  | "spacer"
  | "product-carousel"
  | "featured-collection"
  | "lookbook-grid"
  | "quote-block"
  | "newsletter-block"
  | "instagram-feed"
  | "rich-text-block"
  | "contact-info-block"
  | "contact-form"
  | "social-presence"
  | "motion-arrival"
  | "motion-manifesto"
  | "motion-canvas"
  | "motion-storytelling"
  | "motion-values"
  | "motion-atelier"
  | "motion-future"
  | "motion-signature"
  | "journal-section"
  | "editorial-heading"
  | "editorial-paragraph"
  | "large-quote"
  | "pull-quote"
  | "divider"
  | "youtube-embed"
  | "pinterest-embed"
  | "timeline"
  | "statistics"
  | "faq"
  | "table"
  | "code-block"
  | "html-block"
  | "image-text"
  | "two-column-text"
  | "three-column-text"
  | "sticky-image"
  | "fullscreen-image"
  | "image-hotspots"
  | "image-gallery"
  | "masonry-gallery"
  | "video-block"
  | "caption"
  | "related-products"
  | "shop-the-story"
  | "related-stories"
  | "complete-the-look"
  | "editorial-cta"
  | "recently-viewed"
  | "you-may-also-like"
  | "sticky-purchase-bar"
  | "floating-wishlist"
  | "adv-rich-text"
  | "adv-raw-html"
  | "adv-code-block"
  | "adv-founder-quote"
  | "adv-download-block"
  | "adv-contact-block"
  | "adv-timeline"
  | "adv-statistics"
  | "adv-faq"
  | "adv-tabs"
  | "adv-table"
  | "adv-awards"
  | "adv-press-logos"
  | "adv-sustainability"
  | "adv-brand-values"
  | "adv-before-after"
  | "adv-audio-block"
  | "adv-store-locator"
  | "adv-event-countdown"
  | "adv-bento-grid";

export type UniversalSectionData = {
  content: {
    heading: string;
    italicHeading: string;
    subheading: string;
    description: string;
    description2?: string;
    description3?: string;
    primaryButton: { enabled: boolean; label: string; url: string; style: string };
    secondaryButton: { enabled: boolean; label: string; url: string; style: string };
    tertiaryButton: { enabled: boolean; label: string; url: string; style: string };
  };
  layout: {
    desktop: { x: number; y: number; width: number; height: number; align: string; padding: string; margin: string; textWidth: number };
    tablet: { x: number; y: number; width: number; height: number; align: string; padding: string; margin: string; textWidth: number };
    mobile: { x: number; y: number; width: number; height: number; align: string; padding: string; margin: string; textWidth: number };
  };
  style: {
    heading: {
      fontSize: number;
      fontWeight: number;
      letterSpacing: number;
      lineHeight: number;
      textColor: string;
      textShadow: string;
      align?: string;
    };
    subheading: {
      fontSize: number;
      fontWeight: number;
      letterSpacing: number;
      lineHeight: number;
      textColor: string;
      textShadow: string;
      align?: string;
    };
    description: {
      fontSize: number;
      fontWeight: number;
      letterSpacing: number;
      lineHeight: number;
      textColor: string;
      textShadow: string;
      align?: string;
      maxWidth?: number;
    };
    button: {
      fontSize: number;
      fontWeight: number;
      padding: string;
      borderRadius: number;
      textColor: string;
      backgroundColor: string;
      backgroundOpacity?: number;
    };
    // Legacy top-level fallbacks kept for safe backward compatibility
    fontFamily: string;
    fontSize?: number;
    subheadingFontSize?: number;
    descriptionFontSize?: number;
    fontWeight?: number;
    letterSpacing?: number;
    lineHeight?: number;
    textColor?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    textShadow?: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    darkOverlay: number;
    lightOverlay: number;
    gradientOverlay: boolean;
  };
  animation?: {
    type: "fade" | "slide-up" | "slide-left" | "slide-right" | "reveal" | "scale" | "mask-reveal" | "none";
    duration: number; // e.g. 1000ms
    delay: number; // e.g. 0ms
    easing: string; // e.g. cubic-bezier(...)
    scrollTrigger: boolean;
  };
  advanced?: {
    anchorId?: string;
    customCssClass?: string;
    zIndex?: number;
    sticky?: boolean;
    lazyLoad?: boolean;
    cmsNotes?: string;
  };
  [key: string]: any;
  media: UniversalMediaData;
  journalConfig?: {
    layout: string;
    articleCount: number;
  };
  productSequence?: string[];
  includeProducts?: string[];
  excludeProducts?: string[];
  // Legacy fallback fields for backwards compatibility
  heading?: string;
  description?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  shadow?: string;
  x?: number;
  y?: number;
  mobileX?: number;
  mobileY?: number;
  width?: number;
  overlayStrength?: number;
  gradientOverlay?: boolean;
  button?: { enabled: boolean; label: string; url: string; style: string };
  primaryButton?: { enabled: boolean; label: string; url: string; style: string };
  secondaryButton?: { enabled: boolean; label: string; url: string; style: string };
  buttonStyle?: string;

  // Specific extensions
  collectionShowcase?: { layoutType: string; items: any[], maxWidth: string };
  splitLayout?: { ratio: string; layout: string };
  
  contactInfo?: {
    fields: { label: string; value: string; link?: string }[];
  };
  contactForm?: {
    enabled: boolean;
    successMessage: string;
    destinationEmail: string;
    subjects: string[];
  };
  socialPresence?: {
    links: { platform: string; url: string }[];
  };
  typographyOverrides?: {
    enabled: boolean;
    desktop?: Partial<BreakpointConfig>;
    tablet?: Partial<BreakpointConfig>;
    mobile?: Partial<BreakpointConfig>;
  };
};

// A helper to initialize missing fields securely
export function normalizeSectionData(data: any): UniversalSectionData {
  const d = data || {};
  const computedStyle = {
    heading: {
      fontSize: d.style?.heading?.fontSize ?? d.style?.fontSize ?? d.fontSize ?? 4,
      fontWeight: d.style?.heading?.fontWeight ?? d.style?.fontWeight ?? d.fontWeight ?? 300,
      letterSpacing: d.style?.heading?.letterSpacing ?? d.style?.letterSpacing ?? d.letterSpacing ?? 0.05,
      lineHeight: d.style?.heading?.lineHeight ?? d.style?.lineHeight ?? d.lineHeight ?? 1.1,
      textColor: d.style?.heading?.textColor ?? d.style?.textColor ?? d.textColor ?? "#1a1a18",
      textShadow: d.style?.heading?.textShadow ?? d.style?.textShadow ?? d.shadow ?? "none",
      align: d.style?.heading?.align ?? d.layout?.desktop?.align ?? "center"
    },
    subheading: {
      fontSize: d.style?.subheading?.fontSize ?? d.style?.subheadingFontSize ?? 1,
      fontWeight: d.style?.subheading?.fontWeight ?? 400,
      letterSpacing: d.style?.subheading?.letterSpacing ?? 0.2,
      lineHeight: d.style?.subheading?.lineHeight ?? 1.2,
      textColor: d.style?.subheading?.textColor ?? d.style?.textColor ?? d.textColor ?? "#1a1a18",
      textShadow: d.style?.subheading?.textShadow ?? "none",
      align: d.style?.subheading?.align ?? d.layout?.desktop?.align ?? "center"
    },
    description: {
      fontSize: d.style?.description?.fontSize ?? d.style?.descriptionFontSize ?? 1.1,
      fontWeight: d.style?.description?.fontWeight ?? 300,
      letterSpacing: d.style?.description?.letterSpacing ?? 0.02,
      lineHeight: d.style?.description?.lineHeight ?? 1.6,
      textColor: d.style?.description?.textColor ?? d.style?.textColor ?? d.textColor ?? "#1a1a18",
      textShadow: d.style?.description?.textShadow ?? "none",
      align: d.style?.description?.align ?? d.layout?.desktop?.align ?? "center",
      maxWidth: d.style?.description?.maxWidth ?? 800
    },
    button: {
      fontSize: d.style?.button?.fontSize ?? 0.75,
      fontWeight: d.style?.button?.fontWeight ?? 400,
      padding: d.style?.button?.padding ?? "0.6rem 1.4rem",
      borderRadius: d.style?.button?.borderRadius ?? 0,
      textColor: d.style?.button?.textColor ?? "#ffffff",
      backgroundColor: d.style?.button?.backgroundColor ?? "#1a1a18",
      backgroundOpacity: d.style?.button?.backgroundOpacity ?? 100
    },
    fontFamily: d.style?.fontFamily ?? "var(--font-cormorant, serif)",
    backgroundColor: d.style?.backgroundColor ?? "transparent",
    borderColor: d.style?.borderColor ?? "transparent",
    borderWidth: d.style?.borderWidth ?? 0,
    borderRadius: d.style?.borderRadius ?? 0,
    darkOverlay: d.style?.darkOverlay ?? d.overlayStrength ?? 0,
    lightOverlay: d.style?.lightOverlay ?? 0,
    gradientOverlay: d.style?.gradientOverlay ?? d.gradientOverlay ?? false,
    // Legacy passthroughs
    fontSize: d.style?.fontSize ?? d.fontSize ?? 4,
    subheadingFontSize: d.style?.subheadingFontSize ?? 1,
    descriptionFontSize: d.style?.descriptionFontSize ?? 1.1,
    fontWeight: d.style?.fontWeight ?? d.fontWeight ?? 300,
    letterSpacing: d.style?.letterSpacing ?? d.letterSpacing ?? 0.05,
    lineHeight: d.style?.lineHeight ?? d.lineHeight ?? 1.1,
    textColor: d.style?.textColor ?? d.textColor ?? "#1a1a18",
    textShadow: d.style?.textShadow ?? d.shadow ?? "none",
  };

  return {
    ...d,
    content: {
      heading: d.content?.heading ?? d.heading ?? d.title ?? "New Section",
      italicHeading: d.content?.italicHeading ?? d.titleItalic ?? "",
      subheading: d.content?.subheading ?? d.subtitle ?? "",
      description: d.content?.description ?? d.description ?? "",
      primaryButton: {
        enabled: d.content?.primaryButton?.enabled ?? d.button?.enabled ?? d.primaryButton?.enabled ?? true,
        label: d.content?.primaryButton?.label ?? d.button?.label ?? d.primaryButton?.label ?? "Explore",
        url: (d.content?.primaryButton?.url && d.content?.primaryButton?.url !== "#" ? d.content.primaryButton.url : null) ?? (d.button?.url && d.button?.url !== "#" ? d.button.url : null) ?? (d.primaryButton?.url && d.primaryButton?.url !== "#" ? d.primaryButton.url : null) ?? d.url ?? "#",
        style: d.content?.primaryButton?.style ?? d.button?.style ?? d.primaryButton?.style ?? d.buttonStyle ?? "luxury"
      },
      secondaryButton: {
        enabled: d.content?.secondaryButton?.enabled ?? d.secondaryButton?.enabled ?? false,
        label: d.content?.secondaryButton?.label ?? d.secondaryButton?.label ?? "Learn More",
        url: (d.content?.secondaryButton?.url && d.content?.secondaryButton?.url !== "#" ? d.content.secondaryButton.url : null) ?? (d.secondaryButton?.url && d.secondaryButton?.url !== "#" ? d.secondaryButton.url : null) ?? d.secondaryUrl ?? "#",
        style: d.content?.secondaryButton?.style ?? d.secondaryButton?.style ?? d.buttonStyle ?? "outline"
      },
      tertiaryButton: {
        enabled: d.content?.tertiaryButton?.enabled ?? d.tertiaryButton?.enabled ?? false,
        label: d.content?.tertiaryButton?.label ?? d.tertiaryButton?.label ?? "Contact Us",
        url: (d.content?.tertiaryButton?.url && d.content?.tertiaryButton?.url !== "#" ? d.content.tertiaryButton.url : null) ?? (d.tertiaryButton?.url && d.tertiaryButton?.url !== "#" ? d.tertiaryButton.url : null) ?? "#",
        style: d.content?.tertiaryButton?.style ?? d.tertiaryButton?.style ?? "ghost"
      },
    },
    layout: {
      desktop: {
        x: d.layout?.desktop?.x ?? d.x ?? 50,
        y: d.layout?.desktop?.y ?? d.y ?? 50,
        width: d.layout?.desktop?.width ?? d.width ?? 100,
        height: d.layout?.desktop?.height ?? 80,
        align: d.layout?.desktop?.align ?? "center",
        padding: d.layout?.desktop?.padding ?? "0",
        margin: d.layout?.desktop?.margin ?? "0",
        textWidth: d.layout?.desktop?.textWidth ?? 80,
      },
      tablet: {
        x: d.layout?.tablet?.x ?? d.x ?? 50,
        y: d.layout?.tablet?.y ?? d.y ?? 50,
        width: d.layout?.tablet?.width ?? d.width ?? 100,
        height: d.layout?.tablet?.height ?? 80,
        align: d.layout?.tablet?.align ?? "center",
        padding: d.layout?.tablet?.padding ?? "0",
        margin: d.layout?.tablet?.margin ?? "0",
        textWidth: d.layout?.tablet?.textWidth ?? 80,
      },
      mobile: {
        x: d.layout?.mobile?.x ?? d.mobileX ?? d.x ?? 50,
        y: d.layout?.mobile?.y ?? d.mobileY ?? d.y ?? 50,
        width: d.layout?.mobile?.width ?? d.width ?? 100,
        height: d.layout?.mobile?.height ?? 80,
        align: d.layout?.mobile?.align ?? "center",
        padding: d.layout?.mobile?.padding ?? "0",
        margin: d.layout?.mobile?.margin ?? "0",
        textWidth: d.layout?.mobile?.textWidth ?? 90,
      }
    },
    style: computedStyle,
    media: d.media ? {
      ...d.media,
      desktop: d.media.desktop || { url: "" },
      mobile: d.media.mobile || { url: "" },
      type: d.media.type || (d.media.desktop?.url?.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image"),
      videoSettings: {
        autoplay: d.media.videoSettings?.autoplay ?? true,
        loop: d.media.videoSettings?.loop ?? true,
        muted: d.media.videoSettings?.muted ?? true,
        controls: d.media.videoSettings?.controls ?? false,
        lazyLoad: d.media.videoSettings?.lazyLoad ?? true,
        playOnHover: d.media.videoSettings?.playOnHover ?? false
      }
    } : {
      type: d.video ? "video" : "image",
      desktop: { url: d.video || d.desktopImage || d.image || "" },
      mobile: { url: d.mobileImage || d.image || "" },
      videoSettings: { autoplay: true, loop: true, muted: true, controls: false, lazyLoad: true, playOnHover: false }
    },
    animation: {
      type: d.animation?.type ?? d.advanced?.animation ?? (typeof d.animation === "string" ? d.animation : "slide-up"),
      duration: d.animation?.duration ?? d.advanced?.duration ?? 1.2,
      delay: d.animation?.delay ?? d.advanced?.delay ?? 0,
      easing: d.animation?.easing ?? "ease",
      scrollTrigger: d.animation?.scrollTrigger ?? true,
    },
    advanced: {
      anchorId: d.advanced?.anchorId ?? "",
      customCssClass: d.advanced?.customCssClass ?? "",
    },
    collectionShowcase: d.collectionShowcase ?? {
      layoutType: d.layout || "grid",
      maxWidth: d.maxWidth || "boxed",
      items: (d.items || []).map((item: any) => {
        const itemStyle = item.style || {};
        const cascadedStyle = {
          ...computedStyle,
          ...itemStyle,
          heading: { ...computedStyle.heading, ...itemStyle.heading },
          subheading: { ...computedStyle.subheading, ...itemStyle.subheading },
          description: { ...computedStyle.description, ...itemStyle.description },
          button: { ...computedStyle.button, ...itemStyle.button }
        };

        // Recursively normalize so items get the full suite of UniversalSectionData
        const normalizedItem = normalizeSectionData({
          ...item,
          id: item.id || `item_${Math.random().toString(36).substring(2, 9)}`,
          content: item.content || {
            heading: item.overrideHeading || item.collectionId?.split('/').pop() || "Collection",
            description: item.overrideDescription || "",
            primaryButton: { enabled: !!item.overrideButton, label: item.overrideButton || "Explore", url: item.url || item.collectionId || "#", style: "luxury" }
          },
          style: cascadedStyle
        });
        // Preserve collection specific fields that aren't part of standard universal data
        return {
          ...normalizedItem,
          collectionId: item.collectionId || "",
          url: item.url || item.collectionId || "#"
        };
      })
    },
    splitLayout: d.splitLayout ?? {
      ratio: d.ratio || "50-50",
      layout: d.layout || "image-left"
    },
    contactInfo: d.contactInfo ?? {
      fields: d.fields ?? []
    },
    contactForm: d.contactForm ?? {
      successMessage: "Thank you for your message. We will be in touch shortly.",
      destinationEmail: "care@tezhhomayaa.com",
      subjects: ["Client Services", "Order Support", "Wholesale", "Press", "Collaboration", "Other"]
    },
    socialPresence: d.socialPresence ?? {
      links: [
        { platform: "Instagram", url: "#" },
        { platform: "Facebook", url: "#" }
      ]
    },
    typographyOverrides: d.typographyOverrides ?? {
      enabled: false
    },
    productSequence: d.productSequence ?? [],
    includeProducts: d.includeProducts ?? [],
    excludeProducts: d.excludeProducts ?? []
  };
}
