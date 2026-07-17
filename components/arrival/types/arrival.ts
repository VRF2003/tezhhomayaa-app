export type ArrivalStep = 
  | "REGION" 
  | "COUNTRY" 
  | "LANGUAGE" 
  | "SEQUENCE" 
  | "COMPLETE";

export interface ArrivalState {
  currentStep: ArrivalStep;
  selectedRegion: string | null;
  selectedCountry: string | null;
  selectedLanguage: string | null;
  arrivalTheme: "DARK" | "LIGHT";
  isTransitioning: boolean;
}

export interface ArrivalConfig {
  logoText: string;
  welcomeLine: string;
  heading: string;
  subheading: string;
  searchPlaceholder: string;
  footerLinks: Array<{ label: string; href: string }>;
  regions: Array<{ id: string; label: string }>;
  countries: Record<string, Array<{ id: string; label: string; currency: string }>>;
  languages: Record<string, Array<{ id: string; label: string; localLabel: string }>>;
}
