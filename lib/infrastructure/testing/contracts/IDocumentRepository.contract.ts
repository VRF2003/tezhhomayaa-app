import { IDocumentRepository } from '@/lib/content/repositories/IDocumentRepository';
import { expect, describe, it, beforeEach } from 'vitest';

export function runDocumentRepositoryContractTests(
  repoFactory: () => IDocumentRepository
) {
  describe('IDocumentRepository Contract', () => {
    let repo: IDocumentRepository;

    beforeEach(() => {
      repo = repoFactory();
    });

    it('should save and retrieve a document', async () => {
      const doc = { title: 'Test Document', active: true };
      await repo.saveDocument('test_doc_1', doc);
      
      const retrieved = await repo.getDocument<{title: string}>('test_doc_1');
      expect(retrieved).not.toBeNull();
      expect(retrieved?.title).toBe('Test Document');
    });

    it('should return null for non-existent documents', async () => {
      const retrieved = await repo.getDocument('missing_doc');
      expect(retrieved).toBeNull();
    });

    it('should delete a document', async () => {
      const doc = { title: 'To Delete' };
      await repo.saveDocument('to_delete_1', doc);
      await repo.deleteDocument('to_delete_1');
      
      const retrieved = await repo.getDocument('to_delete_1');
      expect(retrieved).toBeNull();
    });

    it('should get all documents', async () => {
      await repo.saveDocument('all_1', { data: 1 });
      await repo.saveDocument('all_2', { data: 2 });
      
      const allDocs = await repo.getAllDocuments();
      const keys = allDocs.map(d => d.key);
      expect(keys).toContain('all_1');
      expect(keys).toContain('all_2');
    });
  });
}
