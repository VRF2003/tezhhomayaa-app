import { SearchService } from "../core/SearchService";
import { IndexSettings } from "../types";

export class IndexManager {
  static async createIndex(settings: IndexSettings): Promise<void> {
    const exists = await SearchService.getProvider().indexExists(settings.name);
    if (!exists) {
      await SearchService.getProvider().createIndex(settings);
    }
  }

  static async deleteIndex(indexName: string): Promise<void> {
    await SearchService.getProvider().deleteIndex(indexName);
  }

  static async rebuildIndex(settings: IndexSettings): Promise<void> {
    // Rebuilding conceptually deletes and recreates, 
    // or uses a zero-downtime alias swap strategy if supported by the provider.
    // Basic implementation:
    const tempName = `${settings.name}_temp_${Date.now()}`;
    const tempSettings = { ...settings, name: tempName };
    
    // Create new index
    await SearchService.getProvider().createIndex(tempSettings);
    
    // ... data would be piped to tempName here (done via ReindexManager)
    
    // Then swap alias (if provider supports it) or replace.
    // For our simplified abstraction without aliases right now:
    await this.deleteIndex(settings.name);
    await SearchService.getProvider().createIndex(settings);
    // Note: ReindexManager will re-populate it.
  }
}
