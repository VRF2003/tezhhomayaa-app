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
      { key: "homepage", data: require("@/lib/homepage.json") },
      { key: "header", data: require("@/lib/header.json") },
      { key: "menus", data: require("@/lib/menus.json") },
      { key: "categories", data: require("@/lib/categories.json") },
      { key: "lookbook", data: require("@/lib/lookbook.json") },
      { key: "journal_theme", data: require("@/lib/journal-theme.json") },
      { key: "journal", data: require("@/lib/journal.json") },
      { key: "product_pages", data: require("@/lib/product-pages.json") }
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
    const keys = ["homepage", "header", "menus", "categories", "lookbook", "journal_theme", "journal", "product_pages"];
    for (const key of keys) {
      await docRepo.deleteDocument(key);
    }
  }
}
