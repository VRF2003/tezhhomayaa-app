import { ExperienceServices } from "../services";

export class CurrencyResolver {
  constructor(private readonly services: ExperienceServices) {}

  getCurrency(): string {
    return this.services.getCurrencyCode();
  }

  getCurrencyCode(): string {
    return this.services.getCurrencyCode();
  }

  getCurrencySymbol(): string {
    return this.services.getCurrencySymbol();
  }

  isSupportedCurrency(currencyCode: string): boolean {
    // Since utilities rely purely on the active market's snapshot,
    // we only assert against the currently active currency here.
    return this.services.getCurrencyCode() === currencyCode;
  }
}
