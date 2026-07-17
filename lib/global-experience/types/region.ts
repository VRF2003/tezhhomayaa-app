export type RegionId = 
  | "asia-pacific" 
  | "middle-east" 
  | "europe" 
  | "north-america"
  | "south-america"
  | "africa";

export interface Country {
  id: string; // e.g., "in", "us", "ae"
  code: string; // ISO 3166-1 alpha-2 e.g., "IN", "US", "AE"
  label: string; // e.g., "India", "United States", "United Arab Emirates"
}

export interface Region {
  id: RegionId;
  label: string; // e.g., "Asia Pacific", "Middle East"
  countries: Country[];
}
