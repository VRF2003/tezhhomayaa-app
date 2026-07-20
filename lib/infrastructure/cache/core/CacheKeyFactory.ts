export const CACHE_TAGS = {
  HOMEPAGE: 'homepage',
  NAVIGATION: 'navigation',
  COLLECTION: 'collection',
  CAMPAIGN: 'campaign',
  SEO: 'seo',
  TRANSLATION: 'translation',
  MARKET: 'market',
} as const;

export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS];

export class CacheKeyFactory {
  static create(domain: string, entityType: string, identifier: string): string {
    return `${domain}:${entityType}:${identifier}`;
  }

  static createList(domain: string, entityType: string, queryHash?: string): string {
    return queryHash 
      ? `${domain}:${entityType}:list:${queryHash}` 
      : `${domain}:${entityType}:list`;
  }
}
