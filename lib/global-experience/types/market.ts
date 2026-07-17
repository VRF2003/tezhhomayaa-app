import { RegionId } from "./region";

export interface Market {
  id: string; // e.g., "in-en", "ae-ar", "ca-fr"
  region: RegionId; // Link back to the region
  country: string; // e.g., "India", "United Arab Emirates", "Canada"
  countryCode: string; // ISO 3166-1 alpha-2 e.g., "IN", "AE", "CA"
  language: string; // e.g., "English", "Arabic", "French"
  locale: string; // e.g., "en-IN", "ar-AE", "fr-CA"
  currency: string; // ISO 4217 e.g., "INR", "AED", "CAD"
  currencySymbol: string; // e.g., "₹", "د.إ", "$"
  timezone: string; // IANA timezone e.g., "Asia/Kolkata", "Asia/Dubai", "America/Toronto"
  numberFormat: string; // e.g., "en-IN", "ar-AE", "fr-CA" (used for Intl.NumberFormat)
  dateFormat: string; // e.g., "en-IN", "ar-AE", "fr-CA" (used for Intl.DateTimeFormat)
  defaultLanguage: boolean; // Is this the primary language for this country?
  isDefault: boolean; // Is this the default market overall? (usually US or IN)
}
