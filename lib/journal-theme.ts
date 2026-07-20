import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

export interface JournalTypographyPreset {
  h1: number;
  h2: number;
  h3: number;
  p: number;
  caption: number;
  quote: number;
  meta: number;
  button: number;
}

export interface JournalThemeConfig {
  typographyPreset: "Editorial XL" | "Luxury" | "Magazine" | "Compact" | "Minimal" | "Fashion House";
  designPreset: "Classic" | "Luxury" | "Magazine" | "Gallery" | "Campaign" | "Minimal" | "Immersive" | "Narrative";
  animationPreset: "None" | "Editorial" | "Luxury" | "Museum" | "Campaign" | "Cinematic";
  
  defaultHeroWidth: string; // e.g. "90%" or "100%"
  defaultHeroHeight: string; // e.g. "80vh"
  readingWidth: string; // e.g. "680px"
  paragraphWidth: string; // e.g. "680px"
  paragraphLineHeight: number;
  imageSpacing: string;
  imageWidth: string;
  
  navbarBehavior: "transparent-to-white" | "solid" | "hidden";
  shopLayout: "auto" | "manual" | "ai";
  relatedStoriesLayout: "magazine" | "cards" | "text-only";
  footerStyle: "immersive" | "standard";
  
  typography: {
    desktop: JournalTypographyPreset;
    tablet: JournalTypographyPreset;
    mobile: JournalTypographyPreset;
  }
}

const DEFAULT_THEME: JournalThemeConfig = {
  typographyPreset: "Luxury",
  designPreset: "Magazine",
  animationPreset: "Editorial",
  defaultHeroWidth: "90%",
  defaultHeroHeight: "80vh",
  readingWidth: "680px",
  paragraphWidth: "760px",
  paragraphLineHeight: 1.6,
  imageSpacing: "120px",
  imageWidth: "100%",
  navbarBehavior: "transparent-to-white",
  shopLayout: "manual",
  relatedStoriesLayout: "magazine",
  footerStyle: "immersive",
  typography: {
    desktop: { h1: 4.5, h2: 3, h3: 2, p: 1.125, caption: 0.75, quote: 2.5, meta: 0.65, button: 0.75 },
    tablet: { h1: 3.5, h2: 2.5, h3: 1.75, p: 1, caption: 0.7, quote: 2, meta: 0.6, button: 0.7 },
    mobile: { h1: 2.5, h2: 2, h3: 1.5, p: 1, caption: 0.65, quote: 1.5, meta: 0.55, button: 0.65 }
  }
};

export async function getJournalTheme(): Promise<JournalThemeConfig> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("journal_theme");
    if (!data) {
      await saveJournalTheme(DEFAULT_THEME);
      return DEFAULT_THEME;
    }
    return data as JournalThemeConfig;
  } catch (e) {
    return DEFAULT_THEME;
  }
}

export async function saveJournalTheme(config: JournalThemeConfig): Promise<void> {
  const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
  await docRepo.saveDocument("journal_theme", config);
}
