import { ContentResolver } from "./lib/lep/resolvers/ContentResolver";
import { ProductionRuntimeContext } from "./lib/preview/core/types";
import { MarketService } from "./lib/market/MarketService";

const runtime = new ProductionRuntimeContext();

const variants: any[] = [
  {
    id: "variant-middle-east",
    marketId: "REGION",
    regionId: "Middle East",
    status: "PUBLISHED",
    publishedAt: "2026-07-17T10:00:00.000Z",
    deletedAt: null,
    validFrom: null,
    validUntil: null,
  },
  {
    id: "variant-japan",
    marketId: "mkt_jp",
    regionId: undefined,
    status: "PUBLISHED",
    publishedAt: "2026-07-17T12:00:00.000Z",
    deletedAt: null,
    validFrom: null,
    validUntil: null,
  },
  {
    id: "variant-global",
    marketId: "GLOBAL",
    regionId: undefined,
    status: "PUBLISHED",
    publishedAt: "2026-07-16T12:00:00.000Z",
    deletedAt: null,
    validFrom: null,
    validUntil: null,
  }
];

const italy = MarketService.getMarketByCode("IT")!;
const uae = MarketService.getMarketByCode("AE")!;
const japan = MarketService.getMarketByCode("JP")!;

console.log("Italy (Europe):", ContentResolver.resolve(italy, variants, runtime)?.id);
console.log("UAE (Middle East):", ContentResolver.resolve(uae, variants, runtime)?.id);
console.log("Japan:", ContentResolver.resolve(japan, variants, runtime)?.id);
