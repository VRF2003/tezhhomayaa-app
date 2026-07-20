export type CachePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface CachePolicy {
  ttlSeconds: number;
  priority: CachePriority;
  maxSizeBytes?: number; // Maximum size in bytes
  slidingExpiration?: boolean; // If true, reset TTL on access
  // Extension points
  staleWhileRevalidate?: boolean;
  refreshAheadSeconds?: number;
}

export const CacheProfiles = {
  LONG_LIVED: {
    ttlSeconds: 60 * 60 * 24 * 7, // 7 days
    priority: 'NORMAL' as CachePriority,
  },
  VOLATILE: {
    ttlSeconds: 60 * 5, // 5 minutes
    priority: 'LOW' as CachePriority,
  },
  CRITICAL_INFRA: {
    ttlSeconds: 60 * 60 * 24, // 1 day
    priority: 'CRITICAL' as CachePriority,
    slidingExpiration: true,
  }
};
