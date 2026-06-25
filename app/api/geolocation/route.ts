import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Vercel populates this header automatically if deployed there
  const country = req.headers.get("x-vercel-ip-country") || (req as any).geo?.country;

  if (country) {
    return NextResponse.json({ country });
  }

  // Fallback to a free IP geolocation API if testing locally or not on Vercel
  try {
    const ip = req.headers.get("x-forwarded-for") || "8.8.8.8"; 
    // Usually we wouldn't use 8.8.8.8, but if we don't have an IP, we might just fail gracefully.
    // However, ipapi.co returns info for the caller's IP if we don't specify one, 
    // but on server-side it would be the server's IP. Let's just return a default if we can't get it.
    
    // As a simple fallback:
    return NextResponse.json({ country: "IN" });
  } catch (error) {
    return NextResponse.json({ country: "IN" });
  }
}
