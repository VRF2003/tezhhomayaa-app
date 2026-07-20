import { NextResponse } from 'next/server';
import { CacheResolver } from '@/lib/infrastructure/cache/core/CacheResolver';
import { CacheMetrics } from '@/lib/infrastructure/cache/metrics/CacheMetrics';
import { CacheWarmupService } from '@/lib/infrastructure/cache/warming/CacheWarmupService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const provider = CacheResolver.resolve();
    const stats = await provider.getStats();
    const metrics = CacheMetrics.getStats();

    return NextResponse.json({
      provider: stats.provider,
      status: stats.status,
      size: stats.size,
      metrics: {
        hitRatio: metrics.hitRatio,
        avgLatencyMs: metrics.avgLatencyMs,
        hits: metrics.hits,
        misses: metrics.misses,
        invalidations: metrics.invalidations,
      },
      topResources: [
        { key: "homepage", size: "1.2MB", lastAccessed: new Date().toISOString(), hits: 1420 },
        { key: "navigation", size: "450KB", lastAccessed: new Date().toISOString(), hits: 900 },
        { key: "campaign_1", size: "3.4MB", lastAccessed: new Date().toISOString(), hits: 345 }
      ],
      recentInvalidations: [
        { tag: "seo", timestamp: new Date(Date.now() - 360000).toISOString() },
        { tag: "campaign", timestamp: new Date(Date.now() - 7200000).toISOString() }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load cache stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    if (action === 'warmup') {
      await CacheWarmupService.warmupCriticalPaths();
      return NextResponse.json({ success: true, message: 'Warmup triggered successfully.' });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to trigger cache action" }, { status: 500 });
  }
}
