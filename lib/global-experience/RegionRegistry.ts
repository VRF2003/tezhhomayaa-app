import { Region } from "./types/region";

export const REGIONS: Region[] = [
  {
    id: "asia-pacific",
    label: "Asia Pacific",
    countries: [
      { id: "in", code: "IN", label: "India" },
      { id: "sg", code: "SG", label: "Singapore" },
      { id: "jp", code: "JP", label: "Japan" },
      { id: "cn", code: "CN", label: "China" },
    ],
  },
  {
    id: "middle-east",
    label: "Middle East",
    countries: [
      { id: "ae", code: "AE", label: "United Arab Emirates" },
      { id: "sa", code: "SA", label: "Saudi Arabia" },
      { id: "qa", code: "QA", label: "Qatar" },
      { id: "bh", code: "BH", label: "Bahrain" },
      { id: "kw", code: "KW", label: "Kuwait" },
      { id: "om", code: "OM", label: "Oman" },
    ],
  },
  {
    id: "europe",
    label: "Europe",
    countries: [
      { id: "gb", code: "GB", label: "United Kingdom" },
      { id: "fr", code: "FR", label: "France" },
      { id: "de", code: "DE", label: "Germany" },
      { id: "es", code: "ES", label: "Spain" },
      { id: "it", code: "IT", label: "Italy" },
    ],
  },
  {
    id: "north-america",
    label: "North America",
    countries: [
      { id: "us", code: "US", label: "United States" },
      { id: "ca", code: "CA", label: "Canada" },
    ],
  },
];
