import { runDocumentRepositoryContractTests } from './IDocumentRepository.contract';
import { DocumentRepository } from '../../persistence/repositories/content/DocumentRepository';
import { IDatabaseDriver } from '../../persistence/drivers/IDatabaseDriver';

// Simple Memory Driver for testing
class MemoryDriver implements IDatabaseDriver {
  private store: Record<string, Record<string, any>> = {};

  async read(collection: string, id: string): Promise<any> {
    return this.store[collection]?.[id] || null;
  }

  async write(collection: string, id: string, data: any): Promise<void> {
    if (!this.store[collection]) this.store[collection] = {};
    this.store[collection][id] = data;
  }

  async delete(collection: string, id: string): Promise<void> {
    if (this.store[collection]) {
      delete this.store[collection][id];
    }
  }

  async query(collection: string): Promise<any[]> {
    if (!this.store[collection]) return [];
    return Object.entries(this.store[collection]).map(([id, data]) => ({ id, ...data }));
  }
}

// Execute contract for DocumentRepository with MemoryDriver
runDocumentRepositoryContractTests(() => {
  return new DocumentRepository(new MemoryDriver());
});
