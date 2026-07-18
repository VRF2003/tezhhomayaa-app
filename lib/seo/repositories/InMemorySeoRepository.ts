import { SeoMetadata } from "../core/types";
import { ISeoRepository } from "./ISeoRepository";

const mockSeoMetadata: SeoMetadata[] = [
  // 5. Global Fallback
  {
    id: "seo-global",
    slug: "homepage",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 10,
    title: "Tezhhomayaa | Global Luxury",
    description: "Discover the finest luxury goods shipped worldwide.",
    canonicalUrl: "https://tezhhomayaa.com",
    robots: "index, follow",
    ogTitle: "Tezhhomayaa Global",
    ogDescription: "World-class luxury at your fingertips.",
    ogImage: "https://tezhhomayaa.com/images/og-global.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tezhhomayaa",
      "url": "https://tezhhomayaa.com"
    },
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 1. India Metadata
  {
    id: "seo-in",
    slug: "homepage",
    marketId: "mkt_in",
    status: "PUBLISHED",
    priority: 100,
    title: "Tezhhomayaa India | Exclusive Collections",
    // Inherits description and OG image from Global
    canonicalUrl: "https://tezhhomayaa.com/in",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 2. Bahrain Metadata
  {
    id: "seo-bh",
    slug: "homepage",
    marketId: "mkt_bh",
    status: "PUBLISHED",
    priority: 100,
    title: "Tezhhomayaa Bahrain | National Day Luxury",
    description: "Celebrate Bahrain with our exclusive timepieces.",
    ogImage: "https://tezhhomayaa.com/images/og-bh.jpg",
    canonicalUrl: "https://tezhhomayaa.com/bh",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 3. UAE Metadata
  {
    id: "seo-ae",
    slug: "homepage",
    marketId: "mkt_ae",
    status: "PUBLISHED",
    priority: 100,
    title: "Tezhhomayaa UAE | Dubai & Abu Dhabi Exclusives",
    canonicalUrl: "https://tezhhomayaa.com/ae",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 4. Region Fallback (Middle East)
  {
    id: "seo-me-region",
    slug: "homepage",
    marketId: "REGION",
    regionId: "Middle East",
    status: "PUBLISHED",
    priority: 50,
    title: "Tezhhomayaa Middle East",
    description: "Modest luxury collections for the GCC.",
    ogImage: "https://tezhhomayaa.com/images/og-me.jpg",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 6. Scheduled SEO campaign (Future Holiday 2026)
  {
    id: "seo-scheduled-holiday",
    slug: "homepage",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 200,
    title: "Tezhhomayaa | Holiday 2026 Gift Guide",
    validFrom: "2026-11-01T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 7. Expired SEO campaign
  {
    id: "seo-expired",
    slug: "homepage",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 500,
    title: "Tezhhomayaa | 2020 Flash Sale",
    validFrom: "2020-01-01T00:00:00.000Z",
    validUntil: "2020-01-31T23:59:59.000Z",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 8. Priority Conflict (Tie Breaker)
  {
    id: "seo-global-alt",
    slug: "homepage",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 10, // Same priority as seo-global
    title: "Tezhhomayaa | Modern Elegance",
    publishedAt: new Date().toISOString(), // Newer, so it wins
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 9. Canonical generation (Collection page)
  {
    id: "seo-collection-bags",
    slug: "collection/bags",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 10,
    title: "Luxury Bags | Tezhhomayaa",
    canonicalUrl: "https://tezhhomayaa.com/collections/bags",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 10. Open Graph generation
  {
    id: "seo-og-test",
    slug: "test-og",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 10,
    title: "OG Test Page",
    ogTitle: "Open Graph Title Specific",
    ogDescription: "An overriding OG description",
    ogImage: "https://tezhhomayaa.com/images/test-og.png",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 11. Twitter Card generation
  {
    id: "seo-twitter-test",
    slug: "test-twitter",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 10,
    title: "Twitter Test Page",
    twitterTitle: "Twitter Card Specific Title",
    twitterImage: "https://tezhhomayaa.com/images/test-twitter.png",
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 12. Structured Data generation
  {
    id: "seo-sd-test",
    slug: "test-sd",
    marketId: "GLOBAL",
    status: "PUBLISHED",
    priority: 10,
    title: "Structured Data Test",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Luxury Test Watch",
      "brand": { "@type": "Brand", "name": "Tezhhomayaa" }
    },
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  }
];

export class InMemorySeoRepository implements ISeoRepository {
  async findById(id: string): Promise<SeoMetadata | null> {
    const item = mockSeoMetadata.find(c => c.id === id);
    if (!item || item.deletedAt) return null;
    return JSON.parse(JSON.stringify(item));
  }

  async findBySlug(slug: string): Promise<SeoMetadata[]> {
    return mockSeoMetadata
      .filter(c => c.slug === slug && !c.deletedAt)
      .map(c => JSON.parse(JSON.stringify(c)));
  }

  async findAll(): Promise<SeoMetadata[]> {
    return mockSeoMetadata
      .filter(c => !c.deletedAt)
      .map(c => JSON.parse(JSON.stringify(c)));
  }

  async create(metadata: SeoMetadata): Promise<void> {
    mockSeoMetadata.push(JSON.parse(JSON.stringify(metadata)));
  }

  async update(metadata: SeoMetadata): Promise<void> {
    const index = mockSeoMetadata.findIndex(c => c.id === metadata.id);
    if (index >= 0) {
      mockSeoMetadata[index] = JSON.parse(JSON.stringify(metadata));
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const index = mockSeoMetadata.findIndex(c => c.id === id);
    if (index >= 0) {
      mockSeoMetadata[index].deletedAt = new Date().toISOString();
      mockSeoMetadata[index].deletedBy = deletedBy;
    }
  }
}
