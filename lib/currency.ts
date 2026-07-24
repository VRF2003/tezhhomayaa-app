import { Observability } from "@/lib/infrastructure/observability";
export type CurrencyCode = "INR" | "BHD" | "AED" | "SAR" | "KWD" | "QAR" | "OMR" | "SGD" | "THB" | "MYR" | "VND" | "USD" | "CAD" | "GBP" | "EUR" | "CHF" | "JPY" | "KRW" | "CNY" | "AUD" | "BRL" | "ZAR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  position?: "left" | "right";
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal" },
  { code: "OMR", symbol: "ر.ع.", name: "Omani Rial" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", position: "right" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" }
];

export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  "IN": "INR",
  "BH": "BHD",
  "AE": "AED",
  "SA": "SAR",
  "KW": "KWD",
  "QA": "QAR",
  "OM": "OMR",
  "SG": "SGD",
  "TH": "THB",
  "MY": "MYR",
  "VN": "VND",
  "US": "USD",
  "CA": "CAD",
  "GB": "GBP",
  "CH": "CHF",
  "JP": "JPY",
  "KR": "KRW",
  "CN": "CNY",
  "AU": "AUD",
  "BR": "BRL",
  "ZA": "ZAR",
  // Europe general mappings
  "FR": "EUR", "DE": "EUR", "IT": "EUR", "ES": "EUR", "NL": "EUR",
  "BE": "EUR", "GR": "EUR", "PT": "EUR", "AT": "EUR", "FI": "EUR",
  "IE": "EUR"
};

export function parsePrice(raw: string | number): number {
  if (typeof raw === "number") return raw;
  const num = parseFloat(raw.toString().replace(/[^\d.]/g, ""));
  return isNaN(num) ? 0 : num;
}

export function formatPriceForCurrency(amount: number, currencyCode: CurrencyCode, rate: number = 1): string {
  const converted = amount * rate;
  const config = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  
  // Basic formatting logic. Different currencies have different decimals, but we'll stick to typical formatting.
  const decimalPlaces = ["VND", "INR", "JPY", "KRW"].includes(currencyCode) ? 0 : 2;
  
  let formattedValue = converted.toLocaleString("en-US", { 
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces 
  });

  // INR uses Indian numbering system normally
  if (currencyCode === "INR") {
    formattedValue = converted.toLocaleString("en-IN", {
       maximumFractionDigits: 0
    });
  }

  if (config.position === "right") {
    return `${formattedValue} ${config.symbol}`;
  }
  
  return `${config.symbol}${formattedValue}`;
}

export function getProductPrice(product: { id: string; price?: string | number }): number {
  if (product.price === undefined || product.price === null || product.price === "") {
    Observability.getLogger("System").warn.bind(Observability.getLogger("System"), "Warn")("Invalid product price", { id: product.id, price: product.price });
    return 0;
  }
  const priceValue = typeof product.price === "number"
    ? product.price
    : parseFloat(String(product.price).replace(/[^0-9.]/g, ""));
  return isNaN(priceValue) ? 0 : priceValue;
}

export function getProductComparePrice(product: { id?: string; compareAtPrice?: string | number }): number | null {
  if (product.compareAtPrice === undefined || product.compareAtPrice === null || product.compareAtPrice === "") {
    return null;
  }
  const priceValue = typeof product.compareAtPrice === "number"
    ? product.compareAtPrice
    : parseFloat(String(product.compareAtPrice).replace(/[^0-9.]/g, ""));
  return isNaN(priceValue) ? null : priceValue;
}

