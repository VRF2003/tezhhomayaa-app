export interface CeremonyTheme {
  id: string;
  headline: string;
  subheadline: string;
  closingMessage: string;
  backgroundColors: string[];
}

export const CEREMONY_THEMES: Record<string, CeremonyTheme> = {
  "golden-dusk": {
    id: "golden-dusk",
    headline: "Welcome to {country}",
    subheadline: "Where contemporary elegance meets timeless craftsmanship.",
    closingMessage: "Preparing your Tezhhomayaa experience...",
    backgroundColors: ["#111111", "#1a1816", "#151412"],
  },
  "quiet-light": {
    id: "quiet-light",
    headline: "Welcome to {country}",
    subheadline: "Where quiet luxury speaks loudest.",
    closingMessage: "Enter Tezhhomayaa...",
    backgroundColors: ["#141414", "#1b1a1c", "#171717"],
  },
  "stone-atelier": {
    id: "stone-atelier",
    headline: "Welcome to {country}",
    subheadline: "The modern sanctuary of design.",
    closingMessage: "Preparing your Tezhhomayaa experience...",
    backgroundColors: ["#0f1110", "#141514", "#101010"],
  },
};
