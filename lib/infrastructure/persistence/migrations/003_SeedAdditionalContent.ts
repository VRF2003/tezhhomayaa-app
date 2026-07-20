import { IMigration } from "./MigrationRunner";
import { RepositoryResolver } from "../resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import fs from "fs";
import path from "path";
import { Observability } from "@/lib/infrastructure/observability";

export class SeedAdditionalContent_003 implements IMigration {
  version = 3;
  name = "003_SeedAdditionalContent";

  async up(): Promise<void> {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    
    const filesToSeed = [
      { key: "appearance", data: require("@/lib/appearance.json") },
      { key: "collection_banners", data: require("@/lib/collection-banners.json") },
      { key: "commerce", data: require("@/lib/commerce.json") },
      { key: "footer", data: require("@/lib/footer.json") },
      { key: "products", data: require("@/lib/products.json") },
      { key: "size_guide", data: require("@/lib/size-guide.json") },
      { key: "tags", data: require("@/lib/tags.json") },
      { key: "smart_collections_settings", data: require("@/lib/smart-collections-settings.json") },
      { key: "smart_collections", data: require("@/lib/smart-collections.json") }
    ];

    for (const item of filesToSeed) {
      try {
        const existing = await docRepo.getDocument(item.key);
        if (!existing) {
          await docRepo.saveDocument(item.key, item.data);
          Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")(`Seeded ${item.key} into DocumentRepository`);
        }
      } catch (e) {
        Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(`Failed to seed ${item.key}`, e);
      }
    }
  }

  async down(): Promise<void> {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const keys = ["appearance", "collection_banners", "commerce", "footer", "newsletter", "products", "size_guide", "tags", "smart_collections_settings", "smart_collections", "collections"];
    for (const key of keys) {
      await docRepo.deleteDocument(key);
    }
  }
}
