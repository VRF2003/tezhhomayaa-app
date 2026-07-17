import { ARRIVAL_CONFIG } from "./config";
import { MarketService } from "@/lib/market/MarketService";

export function createMarketFromArrival(
  regionId: string | null,
  countryId: string | null,
  languageId: string | null
): string {
  
  const region = ARRIVAL_CONFIG.regions.find(r => r.id === regionId);
  const country = regionId ? ARRIVAL_CONFIG.countries[regionId]?.find(c => c.id === countryId) : null;
  
  let targetCode = country?.id || "US";

  // Map Arrival Config specific IDs to Market Engine IDs
  if (targetCode === "UK") targetCode = "GB";

  // Validate against the strict Market Engine
  // If the market engine doesn't support this country yet, fallback to US
  // This prevents runtime errors for new countries added to MAP but not Commerce
  const isValid = MarketService.getMarketByCode(targetCode);
  
  if (!isValid) {
    targetCode = "US";
  }

  // Return the market code which is expected by `setMarket(marketCode)`
  return targetCode;
}
