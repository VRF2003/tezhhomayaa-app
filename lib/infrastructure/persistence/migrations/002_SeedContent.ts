import { IMigration } from "./MigrationRunner";
import { RepositoryResolver } from "../resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import fs from "fs";
import path from "path";
import { Observability } from "@/lib/infrastructure/observability";

export class SeedContent_002 implements IMigration {
  version = 2;
  name = "002_SeedContent";

  async up(): Promise<void> {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    
    // List of well-known JSON files in the repo
    const filesToSeed = [
      { key: "homepage", file: "lib/homepage.json" },
      { key: "header", file: "lib/header.json" },
      { key: "menus", file: "lib/menus.json" },
      { key: "categories", file: "lib/categories.json" },
      { key: "lookbook", file: "lib/lookbook.json" },
      { key: "journal_theme", file: "lib/journal-theme.json" },
      { key: "journal", file: "lib/journal.json" },
      { key: "product_pages", file: "lib/product-pages.json" }
    ];

    for (const item of filesToSeed) {
      try {
        const filePath = path.join(process.cwd(), item.file);
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, "utf-8");
          const data = JSON.parse(raw);
          // Only save if it doesn't exist to prevent overriding user changes
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
    const keys = ["homepage", "header", "menus", "categories", "lookbook", "journal_theme", "journal", "product_pages"];
    for (const key of keys) {
      await docRepo.deleteDocument(key);
    }
  }
}
