import { NextResponse } from 'next/server';
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { Observability } from "@/lib/infrastructure/observability";

export async function GET() {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("lookbook");
    return NextResponse.json(data || []);
  } catch (error) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")('Failed to read lookbook data:', error);
    // Return empty array if file doesn't exist or is invalid
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure the data is an array
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array.' }, { status: 400 });
    }

    // Write back to file
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("lookbook", data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")('Failed to update lookbook data:', error);
    return NextResponse.json({ error: 'Failed to update lookbook data' }, { status: 500 });
  }
}
