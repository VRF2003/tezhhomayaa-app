export type FooterBlockType =
  | "brand"
  | "rich-text"
  | "link-group"
  | "social-links"
  | "newsletter"
  | "customer-care"
  | "currency-region"
  | "legal-links"
  | "image"
  | "video"
  | "divider"
  | "spacer"
  | "quote"
  | "campaign"
  | "contact";

export interface FooterCampaign {
  label: string;
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
}

export interface FooterSocialPlatform {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface FooterBlock {
  id: string;
  type: FooterBlockType;
  hidden?: boolean;
  heading?: string;
  content?: string;
  links?: { label: string; url: string }[];
  style?: {
    colSpan?: number;
    backgroundColor?: string;
    textColor?: string;
    headingColor?: string;
    fontSize?: string;
    textAlign?: string;
    paddingTop?: string;
    paddingBottom?: string;
  };
  // Newsletter
  placeholder?: string;
  buttonText?: string;
  // Customer Care
  email?: string;
  phone?: string;
  address?: string;
  responseTime?: string;
  // Image
  imageUrl?: string;
  imageAlt?: string;
  imageLink?: string;
  // Video
  videoUrl?: string;
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
  // Divider
  dividerColor?: string;
  dividerThickness?: string;
  dividerMargin?: string;
  // Spacer
  spacerHeight?: string;
  spacerHeightMobile?: string;
  // Quote
  quoteText?: string;
  quoteAuthor?: string;
  // Campaign
  campaigns?: FooterCampaign[];
  // Social (structured per-platform)
  socialPlatforms?: FooterSocialPlatform[];
  // Legal links selected list
  legalLinks?: { label: string; url: string; enabled: boolean }[];
  // Currency
  currencyEnabled?: boolean;
  currencyPosition?: string;
  showRegionSelector?: boolean;
}

export interface FooterSettings {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  hoverColor: string;
  borderColor: string;
  dividerColor: string;
  paddingTop: string;
  paddingBottom: string;
  columnGap: string;
  maxWidth: string;
  alignment: string;
  bottomBarText: string;
  bottomBarAlignment: string;
  bottomBarFontSize: string;
  bottomBarLinks: { label: string; url: string }[];
}

export interface FooterData {
  blocks: FooterBlock[];
  settings: FooterSettings;
}

export const defaultFooterData: FooterData = {
  settings: {
    backgroundColor: "var(--paper)",
    textColor: "var(--stone)",
    headingColor: "var(--brand)",
    linkColor: "var(--stone)",
    hoverColor: "var(--brand)",
    borderColor: "var(--border-soft)",
    dividerColor: "var(--border-soft)",
    paddingTop: "clamp(4rem, 8vw, 6rem)",
    paddingBottom: "clamp(3rem, 6vw, 5rem)",
    columnGap: "2rem",
    maxWidth: "none",
    alignment: "start",
    bottomBarText: "© TEZHHOMAYAA MMXXVI — ALL RIGHTS RESERVED",
    bottomBarAlignment: "space-between",
    bottomBarFontSize: "clamp(0.55rem, 0.8vw, 0.9rem)",
    bottomBarLinks: [
      { label: "PRIVACY", url: "/privacy" },
      { label: "LEGAL", url: "/legal" },
      { label: "COOKIES", url: "/cookies" }
    ]
  },
  blocks: [
    {
      id: "brand-1",
      type: "brand",
      heading: "TEZHHOMAYAA",
      content: "A sculptural luxury house. Form beyond motion — where art becomes the language of the body.",
      style: { colSpan: 5 }
    },
    {
      id: "social-1",
      type: "social-links",
      socialPlatforms: [
        { platform: "Instagram", url: "https://www.instagram.com/tezhhomayaa/", enabled: true },
        { platform: "Pinterest", url: "#", enabled: true },
        { platform: "Facebook", url: "#", enabled: false },
        { platform: "YouTube", url: "#", enabled: false },
        { platform: "LinkedIn", url: "#", enabled: false },
        { platform: "TikTok", url: "#", enabled: false }
      ],
      style: { colSpan: 5 }
    },
    {
      id: "links-explore",
      type: "link-group",
      heading: "Explore",
      links: [
        { label: "Collection", url: "/#collection" },
        { label: "Campaign", url: "/#campaign" },
        { label: "Philosophy", url: "/#philosophy" },
        { label: "Journal", url: "#" }
      ],
      style: { colSpan: 3 }
    },
    {
      id: "links-house",
      type: "link-group",
      heading: "House",
      links: [
        { label: "About", url: "/about" },
        { label: "Atelier", url: "#" },
        { label: "Stockists", url: "#" },
        { label: "Contact", url: "#" }
      ],
      style: { colSpan: 3 }
    },
    {
      id: "newsletter-1",
      type: "newsletter",
      heading: "JOIN THE REVOLUTION",
      content: "Receive rare dispatches from the atelier,\nnew collections,\nprivate releases,\nand artistic correspondences.",
      placeholder: "Your email address",
      buttonText: "Subscribe",
      style: { colSpan: 4 }
    }
  ]
};
