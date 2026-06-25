import { NextResponse } from "next/server";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    // Open Exchange Rates or er-api provides free rates.
    // Using open.er-api.com as it doesn't require an API key for the free tier.
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 86400 } // ISR cache
    });

    if (!res.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await res.json();
    
    return NextResponse.json({
      base: data.base_code,
      rates: data.rates // Object of currency codes to rates e.g. { "USD": 0.012, "EUR": 0.011 }
    });
  } catch (error) {
    console.error("Exchange rate fetch error:", error);
    // Return empty rates so the client falls back to base INR (1:1)
    return NextResponse.json({ base: "INR", rates: {} }, { status: 500 });
  }
}
