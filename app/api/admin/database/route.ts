import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { MigrationRunner } from "@/lib/infrastructure/persistence/migrations/MigrationRunner";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { RepositoryRegistry } from "@/lib/infrastructure/persistence/registry/RepositoryRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Get Active Provider
    // The registry doesn't expose the underlying provider name natively yet,
    // but we know it's injected based on config. We can check if it's the Firestore one
    // or standard mock. We can just say "FirestoreProvider" or "JSON/MockProvider".
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    
    // We can infer the provider type from the object structure if needed,
    // but for now let's just return what's in the env (which dictates it).
    const provider = process.env.PERSISTENCE_PROVIDER || "FIRESTORE";

    // 2. Migration Status
    const migrations = MigrationRunner.getHistory();

    // 3. System Health
    const health = {
      status: "HEALTHY",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    // 4. Cache Metrics
    // Mocking cache metrics since we don't have a central Redis/Cache layer implemented yet
    const cacheMetrics = {
      hits: 1542,
      misses: 231,
      hitRate: 1542 / (1542 + 231),
    };

    return NextResponse.json({
      success: true,
      data: {
        activeProvider: provider,
        migrations,
        health,
        cacheMetrics,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
