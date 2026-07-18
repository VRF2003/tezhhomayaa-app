import { ContentItem } from "../core/types";

export interface IContentItemRepository {
  findById(id: string): Promise<ContentItem | null>;
  findAll(): Promise<ContentItem[]>;
  create(item: ContentItem): Promise<void>;
  update(item: ContentItem): Promise<void>;
  softDelete(id: string, deletedBy: string): Promise<void>;
}
