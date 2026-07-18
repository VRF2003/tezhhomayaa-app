import { NextRequest, NextResponse } from "next/server";
import { PreviewService } from "@/lib/preview/services/PreviewService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Server-side generate securely
    const url = PreviewService.generateSignedUrl({
      marketId: body.marketId,
      languageCode: body.languageCode,
      previewDate: body.previewDate,
      draftContentEnabled: body.draftContentEnabled
    });

    return NextResponse.json({ url });
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
}
