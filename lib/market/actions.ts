"use server";

import { cookies } from "next/headers";
import { MARKET_COOKIE_NAME, MarketService } from "./MarketService";

/**
 * Updates the user's selected market cookie.
 * This is a Server Action so it can be safely called from client components
 * and instantly available to server components on subsequent requests.
 */
export async function setMarketCookie(marketCode: string) {
  const market = MarketService.getMarketByCode(marketCode);
  
  if (!market) {
    throw new Error(`Invalid market code: ${marketCode}`);
  }

  // Set the cookie for 1 year
  const cookieStore = await cookies();
  cookieStore.set(MARKET_COOKIE_NAME, market.marketCode, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    httpOnly: false, // Allows reading from client if necessary, though server is preferred
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true, marketCode: market.marketCode };
}
