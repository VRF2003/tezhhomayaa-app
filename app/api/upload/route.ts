import { NextRequest, NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Observability } from "@/lib/infrastructure/observability";

export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name || "upload.png";
    const extension = originalName.split('.').pop() || 'png';
    const filename = `media-${uniqueSuffix}.${extension}`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `uploads/${filename}`);
    
    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type || 'image/jpeg',
    });
    
    const url = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Firebase Upload Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
