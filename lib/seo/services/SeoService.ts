import { SeoMetadata } from "../core/types";
import { ISeoRepository } from "../repositories/ISeoRepository";
import { SeoResolver } from "../resolvers/SeoResolver";
import { Market } from "@/lib/market/types";
import { RuntimeContext, ProductionRuntimeContext } from "@/lib/preview/core/types";

export class SeoService {
  constructor(private repo: ISeoRepository) {}

  /**
   * Orchestrates the resolution and deep-merging of SEO Metadata for a given slug.
   */
  async resolveMetadata(slug: string, market: Market, runtime: RuntimeContext = new ProductionRuntimeContext()): Promise<SeoMetadata | null> {
    const variants = await this.repo.findBySlug(slug);
    if (!variants || variants.length === 0) return null;

    const [globalWinner, regionWinner, marketWinner] = SeoResolver.resolveHierarchy(market, variants, runtime);

    if (!globalWinner && !regionWinner && !marketWinner) return null;

    // Field-Level Inheritance (Deep Merge)
    // We start with global, overwrite with region, then overwrite with market
    const merged: SeoMetadata = {
      ...(globalWinner || {}),
      ...(regionWinner || {}),
      ...(marketWinner || {})
    } as SeoMetadata;

    // Deep merge structured data if multiple exist
    if (globalWinner?.structuredData || regionWinner?.structuredData || marketWinner?.structuredData) {
      merged.structuredData = {
        ...(globalWinner?.structuredData || {}),
        ...(regionWinner?.structuredData || {}),
        ...(marketWinner?.structuredData || {})
      };
    }

    return merged;
  }

  /**
   * Validates metadata before creation or publishing.
   */
  async validate(metadata: SeoMetadata): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!metadata.slug) errors.push("Slug is required.");
    if (!metadata.title) errors.push("Page Title is required.");
    if (!metadata.description) errors.push("Meta Description is required.");

    if (metadata.canonicalUrl && !metadata.canonicalUrl.startsWith("http")) {
      errors.push("Canonical URL must be an absolute URL.");
    }

    if (metadata.robots && !/^(index|noindex),\s*(follow|nofollow)$/i.test(metadata.robots)) {
      errors.push("Invalid robots directive format. Example: 'index, follow'.");
    }

    if (metadata.ogTitle && !metadata.ogImage) {
      errors.push("Open Graph Image is required when Open Graph Title is set.");
    }

    if (metadata.twitterTitle && !metadata.twitterImage) {
      errors.push("Twitter Image is required when Twitter Title is set.");
    }

    if (metadata.structuredData) {
      if (typeof metadata.structuredData !== "object") {
        errors.push("Structured Data must be a valid JSON object.");
      } else if (!metadata.structuredData["@context"] || !metadata.structuredData["@type"]) {
        errors.push("Structured Data must contain @context and @type.");
      }
    }

    // Duplicate Check: Same slug, same market, same priority
    const existing = await this.repo.findBySlug(metadata.slug);
    const conflict = existing.find(e => 
      e.id !== metadata.id && 
      e.marketId === metadata.marketId && 
      e.priority === metadata.priority
    );
    if (conflict) {
      errors.push(`Priority conflict with existing SEO item '${conflict.id}'. Change priority to resolve.`);
    }

    return { valid: errors.length === 0, errors };
  }
}
