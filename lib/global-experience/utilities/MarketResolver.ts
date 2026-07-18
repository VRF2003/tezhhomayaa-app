import { ExperienceServices } from "../services";

export class MarketResolver {
  constructor(private readonly services: ExperienceServices) {}

  getMarketId(): string {
    return this.services.getMarketId();
  }

  getMarket(): string {
    return this.services.getMarketId();
  }

  isDefaultMarket(): boolean {
    // The fallback default market for the platform is in-en
    return this.services.getMarketId() === "in-en";
  }

  isMarket(marketId: string): boolean {
    return this.services.getMarketId() === marketId;
  }
}
