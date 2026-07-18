import { TranslationSet } from "../core/types";

export interface ITranslationRepository {
  findById(id: string): Promise<TranslationSet | null>;
  findAll(): Promise<TranslationSet[]>;
  findByNamespace(namespace: string): Promise<TranslationSet[]>;
  create(set: TranslationSet): Promise<void>;
  update(set: TranslationSet): Promise<void>;
  softDelete(id: string, deletedBy: string): Promise<void>;
}
