import { ExperienceUtilities } from "../utilities";

export class CurrencyFormatter {
  private formatters: Map<string, Intl.NumberFormat> = new Map();

  constructor(private readonly utilities: ExperienceUtilities) {}

  private getFormatter(currencyCode: string, compact: boolean): Intl.NumberFormat {
    let locale = this.utilities.locale.getLocale();
    
    // Force Indian numbering system for INR
    if (currencyCode === "INR") {
      locale = "en-IN";
    }

    // Determine the correct number of decimal places based on currency
    const zeroDecimalCurrencies = ["VND", "INR", "JPY", "KRW"];
    const fractionDigits = zeroDecimalCurrencies.includes(currencyCode) ? 0 : 2;

    const cacheKey = `${locale}-${currencyCode}-${compact}-${fractionDigits}`;

    if (!this.formatters.has(cacheKey)) {
      this.formatters.set(
        cacheKey,
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currencyCode,
          notation: compact ? "compact" : "standard",
          numberingSystem: "latn",
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        })
      );
    }

    return this.formatters.get(cacheKey)!;
  }

  /**
   * Formats a raw amount into a localized currency string.
   * 
   * IMPORTANT: Formatting is NOT conversion. 
   * We display prices using the currency in which they are stored 
   * (e.g., INR) to prevent changing the economic meaning of a price.
   * Multi-currency pricing belongs to the future Pricing Engine phase.
   * 
   * @param amount The raw numerical amount
   * @param currencyCode The currency the amount is actually stored in (defaults to INR)
   */
  formatCurrency(rawAmount: number | string, currencyCode: string = "INR"): string {
    const amount = typeof rawAmount === "number" ? rawAmount : parseFloat(String(rawAmount).replace(/[^0-9.]/g, "")) || 0;
    return this.getFormatter(currencyCode, false).format(amount);
  }

  formatCurrencyCompact(rawAmount: number | string, currencyCode: string = "INR"): string {
    const amount = typeof rawAmount === "number" ? rawAmount : parseFloat(String(rawAmount).replace(/[^0-9.]/g, "")) || 0;
    return this.getFormatter(currencyCode, true).format(amount);
  }
}
