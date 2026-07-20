export interface IDocumentRepository {
  getDocument<T>(key: string): Promise<T | null>;
  saveDocument<T>(key: string, data: T): Promise<void>;
  deleteDocument(key: string): Promise<void>;
  getAllDocuments(): Promise<{ key: string; data: any }[]>;
}
