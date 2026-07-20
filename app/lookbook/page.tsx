import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import LookbookClient from "./LookbookClient";
import { Observability } from "@/lib/infrastructure/observability";

export const metadata = {
  title: "Lookbook | Tezhhomayaa",
  description: "Discover the design collections of Tezhhomayaa.",
};

export default async function LookbookPage() {
  let slides = [];
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("lookbook");
    slides = (data as any) || [];
  } catch (error) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")('Failed to read lookbook data:', error);
  }

  return (
    <main style={{ background: "#1a1a18" }}>
      <LookbookClient initialSlides={slides} />
    </main>
  );
}
