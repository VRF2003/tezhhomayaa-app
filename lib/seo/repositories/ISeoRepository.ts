import { SeoMetadata } from "../core/types";

export interface ISeoRepository {
  findById(id: string): Promise<SeoMetadata | null>;
  findBySlug(slug: string): Promise<SeoMetadata[]>;
  findAll(): Promise<SeoMetadata[]>;
  create(metadata: SeoMetadata): Promise<void>;
  update(metadata: SeoMetadata): Promise<void>;
  softDelete(id: string, deletedBy: string): Promise<void>;
}
