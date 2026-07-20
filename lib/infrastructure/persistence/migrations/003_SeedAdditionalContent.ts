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
      { key: "appearance", file: "lib/appearance.json" },
      { key: "collection_banners", file: "lib/collection-banners.json" },
      { key: "commerce", file: "lib/commerce.json" },
      { key: "footer", file: "lib/footer.json" },
      { key: "newsletter", file: "lib/newsletter.json" },
      { key: "products", file: "lib/products.json" },
      { key: "size_guide", file: "lib/size-guide.json" },
      { key: "tags", file: "lib/tags.json" },
      { key: "smart_collections_settings", file: "lib/smart-collections-settings.json" },
      { key: "smart_collections", file: "lib/smart-collections.json" },
      { key: "collections", file: "lib/collections.json" }
    ];

    for (const item of filesToSeed) {
      try {
        const filePath = process.cwd() + "/" + item.file;
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, "utf-8");
          const data = JSON.parse(raw);
          const existing = await docRepo.getDocument(item.key);
          if (!existing) {
            await docRepo.saveDocument(item.key, data);
            Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")(`Seeded ${item.key} into DocumentRepository`);
          }
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
