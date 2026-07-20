import { SearchDocument } from "../types";

export class SearchDocumentBuilder {
  static build(entityId: string, entityType: string, payload: any): SearchDocument {
    // Generate keywords based on payload values
    const keywords = this.extractKeywords(payload);
    
    return {
      id: entityId,
      type: entityType,
      payload,
      keywords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private static extractKeywords(payload: any): string[] {
    const keywords = new Set<string>();
    
    if (typeof payload === 'object' && payload !== null) {
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string' && value.length > 2) {
          keywords.add(value);
        } else if (Array.isArray(value)) {
          value.forEach(v => {
            if (typeof v === 'string') keywords.add(v);
          });
        }
      }
    }
    
    return Array.from(keywords);
  }
}
