import { bootstrapPersistence } from "./lib/infrastructure/persistence/bootstrap";
import { RepositoryResolver } from "./lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "./lib/content/repositories/IDocumentRepository";

async function run() {
  bootstrapPersistence();
  setTimeout(async () => {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const pages = await docRepo.getDocument("pages_registry");
    console.log("Pages:", pages);
  }, 1000);
}
run();
