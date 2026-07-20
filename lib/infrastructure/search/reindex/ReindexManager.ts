import { IndexManager } from "../indexes/IndexManager";
import { IndexPipeline } from "../pipelines/IndexPipeline";
import { IndexSettings } from "../types";

export class ReindexManager {
  static async fullReindex(settings: IndexSettings): Promise<void> {
    // Recreate the index
    await IndexManager.rebuildIndex(settings);

    // Run pipeline for all entities
    await IndexPipeline.runFullIndex(settings.name);
  }

  static async incrementalReindex(indexName: string, entityId: string, entityType: string): Promise<void> {
    await IndexPipeline.runIncrementalUpdate(indexName, entityId, entityType);
  }
}
