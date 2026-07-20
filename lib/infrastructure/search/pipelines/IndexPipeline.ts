import { SearchDocumentBuilder } from "./SearchDocumentBuilder";
import { SearchService } from "../core/SearchService";

export class IndexPipeline {
  static async runFullIndex(indexName: string): Promise<void> {
    // In a real implementation, this would iterate over all repositories
    // e.g. ProductRepository.findAll(), CampaignRepository.findAll()
    // build SearchDocuments, and batch index them.
    console.log(`Running full index for ${indexName}`);
  }

  static async runIncrementalUpdate(indexName: string, entityId: string, entityType: string, payload?: any): Promise<void> {
    if (!payload) {
      // In a real implementation, fetch the entity from the corresponding repository
      // e.g. if entityType === "PRODUCT", fetch from ProductRepository
      payload = { placeholder: true, id: entityId };
    }
    
    const document = SearchDocumentBuilder.build(entityId, entityType, payload);
    await SearchService.indexDocument(indexName, document);
  }

  static async runDeletion(indexName: string, entityId: string): Promise<void> {
    await SearchService.deleteDocument(indexName, entityId);
  }
}
