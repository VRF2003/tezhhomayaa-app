export class SynonymService {
  // Simulates managing synonyms which are typically injected into provider settings
  private static synonyms: Record<string, string[]> = {
    "sneakers": ["shoes", "trainers", "kicks"],
    "t-shirt": ["tee", "shirt", "tshirt"],
    "pants": ["trousers", "jeans", "bottoms"]
  };

  static getSynonyms(): Record<string, string[]> {
    return this.synonyms;
  }

  static addSynonym(word: string, synonyms: string[]): void {
    if (!this.synonyms[word]) {
      this.synonyms[word] = [];
    }
    this.synonyms[word].push(...synonyms);
  }
}
