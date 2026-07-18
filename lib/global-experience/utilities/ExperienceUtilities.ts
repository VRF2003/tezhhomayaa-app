import { ExperienceServices } from "../services";
import { MarketResolver } from "./MarketResolver";
import { LocaleResolver } from "./LocaleResolver";
import { CurrencyResolver } from "./CurrencyResolver";
import { TimezoneResolver } from "./TimezoneResolver";
import { RegionResolver } from "./RegionResolver";

export class ExperienceUtilities {
  public readonly market: MarketResolver;
  public readonly locale: LocaleResolver;
  public readonly currency: CurrencyResolver;
  public readonly timezone: TimezoneResolver;
  public readonly region: RegionResolver;

  constructor(services: ExperienceServices) {
    this.market = new MarketResolver(services);
    this.locale = new LocaleResolver(services);
    this.currency = new CurrencyResolver(services);
    this.timezone = new TimezoneResolver(services);
    this.region = new RegionResolver(services);
  }
}
