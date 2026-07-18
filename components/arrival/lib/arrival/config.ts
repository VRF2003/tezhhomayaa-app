import { ArrivalConfig } from "../../types/arrival";

export const ARRIVAL_CONFIG: ArrivalConfig = {
  logoText: "TEZHHOMAYAA",
  welcomeLine: "Welcome",
  heading: "Before we begin,",
  subheading: "let's tailor your experience.",
  searchPlaceholder: "Search country or region...",
  footerLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Change Language", href: "#" },
    { label: "Version 1.0", href: "#" },
  ],
  regions: [
    { id: "asia_pacific", label: "Asia Pacific" },
    { id: "middle_east", label: "Middle East" },
    { id: "europe", label: "Europe" },
    { id: "north_america", label: "North America" },
    { id: "south_america", label: "South America" },
    { id: "africa", label: "Africa" },
  ],
  countries: {
    middle_east: [
      { id: "AE", label: "United Arab Emirates", currency: "AED" },
      { id: "SA", label: "Saudi Arabia", currency: "SAR" },
      { id: "QA", label: "Qatar", currency: "QAR" },
      { id: "BH", label: "Bahrain", currency: "BHD" },
      { id: "KW", label: "Kuwait", currency: "KWD" },
      { id: "OM", label: "Oman", currency: "OMR" },
    ],
    europe: [
      { id: "FR", label: "France", currency: "EUR" },
      { id: "IT", label: "Italy", currency: "EUR" },
      { id: "GB", label: "United Kingdom", currency: "GBP" },
      { id: "CH", label: "Switzerland", currency: "CHF" },
    ],
    asia_pacific: [
      { id: "IN", label: "India", currency: "INR" },
      { id: "JP", label: "Japan", currency: "JPY" },
      { id: "KR", label: "South Korea", currency: "KRW" },
      { id: "CN", label: "China", currency: "CNY" },
      { id: "AU", label: "Australia", currency: "AUD" },
    ],
    north_america: [
      { id: "US", label: "United States", currency: "USD" },
      { id: "CA", label: "Canada", currency: "CAD" },
    ],
    south_america: [
      { id: "BR", label: "Brazil", currency: "BRL" },
    ],
    africa: [
      { id: "ZA", label: "South Africa", currency: "ZAR" },
    ]
  },
  languages: {
    AE: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "ar", label: "العربية", localLabel: "العربية" },
    ],
    SA: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "ar", label: "العربية", localLabel: "العربية" },
    ],
    QA: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "ar", label: "العربية", localLabel: "العربية" },
    ],
    BH: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "ar", label: "العربية", localLabel: "العربية" },
    ],
    KW: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "ar", label: "العربية", localLabel: "العربية" },
    ],
    OM: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "ar", label: "العربية", localLabel: "العربية" },
    ],
    SG: [
      { id: "en", label: "English", localLabel: "English" },
      { id: "zh", label: "Chinese", localLabel: "中文" },
      { id: "ms", label: "Malay", localLabel: "Bahasa Melayu" },
      { id: "ta", label: "Tamil", localLabel: "Tamil" },
    ],
    IN: [
      { id: "en", label: "English", localLabel: "English" },
    ],
    FR: [
      { id: "fr", label: "French", localLabel: "Français" },
      { id: "en", label: "English", localLabel: "English" },
    ],
    IT: [
      { id: "it", label: "Italian", localLabel: "Italiano" },
      { id: "en", label: "English", localLabel: "English" },
    ],
    JP: [
      { id: "ja", label: "Japanese", localLabel: "日本語" },
      { id: "en", label: "English", localLabel: "English" },
    ],
    CN: [
      { id: "zh", label: "Chinese", localLabel: "中文" },
      { id: "en", label: "English", localLabel: "English" },
    ],
    KR: [
      { id: "ko", label: "Korean", localLabel: "한국어" },
      { id: "en", label: "English", localLabel: "English" },
    ],
    // Default fallback mapping for other countries
    default: [
      { id: "en", label: "English", localLabel: "English" },
    ]
  }
};
