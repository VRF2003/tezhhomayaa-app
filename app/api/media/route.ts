import { NextRequest, NextResponse } from "next/server";
import { readdirSync, statSync, unlinkSync, existsSync } from "fs";
import { join } from "path";

const uploadsDir = join(process.cwd(), "public", "uploads");

export async function GET(req: NextRequest) {
  try {
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ success: true, files: [] });
    }

    const fileNames = readdirSync(uploadsDir);
    const files = fileNames
      .filter(f => !f.startsWith("."))
      .map(name => {
        const stats = statSync(join(uploadsDir, name));
        let type = "image/jpeg";
        if (name.endsWith(".png")) type = "image/png";
        if (name.endsWith(".gif")) type = "image/gif";
        if (name.endsWith(".mp4")) type = "video/mp4";
        if (name.endsWith(".webm")) type = "video/webm";
        if (name.endsWith(".webp")) type = "image/webp";

        return {
          name,
          url: `/uploads/${name}`,
          size: stats.size,
          type,
          created: stats.birthtimeMs,
        };
      })
      .sort((a, b) => b.created - a.created);

    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    if (!fileName || fileName.includes("/") || fileName.includes("..")) {
      return NextResponse.json({ success: false, error: "Invalid file name" }, { status: 400 });
    }

    const filePath = join(uploadsDir, fileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
