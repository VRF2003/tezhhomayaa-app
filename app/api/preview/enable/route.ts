import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PreviewService } from "@/lib/preview/services/PreviewService";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  
  if (!token) {
    return new Response("Missing preview token", { status: 400 });
  }

  try {
    // Validate first
    PreviewService.validateToken(token);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("tezhhomayaa-preview", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (e) {
    return new Response((e as Error).message, { status: 401 });
  }
}
