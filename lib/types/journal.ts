import { UniversalSectionData } from "./homepage";

export type JournalCategory = string; 
export type JournalStatus = "Draft" | "Scheduled" | "Published" | "Archived" | "Private" | "Members Only";
export type ArticleType = "Editorial" | "Campaign" | "Lookbook" | "Interview" | "Travel Diary" | "Fashion Week" | "Philosophy" | "Collection Launch" | "Behind The Scenes" | "Product Story" | "Visual Essay";

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: JournalCategory;
  articleType: ArticleType;
  author: string;
  readingTime: string; // Manual override or auto
  publishDate: string; // ISO format
  status: JournalStatus;
  heroImage: {
    url: string;
    alt: string;
  };
  thumbnailImage?: {
    url: string;
    alt: string;
  };
  seo: {
    title: string;
    description: string;
    openGraphImage: string;
  };
  featured: boolean; 
  relatedProducts: string[]; 
  relatedArticles: string[]; 

  // Editorial Overrides
  useGlobalTheme: boolean;
  overrides?: {
    heroHeight?: string;
    typographyPreset?: string;
    animationPreset?: string;
    readingWidth?: string;
    navbarBehavior?: string;
    shopLayout?: string;
  };

  // Modular Builder Array
  sections: UniversalSectionData[];
  
  order: number; 
  createdAt: string;
  updatedAt: string;
}
