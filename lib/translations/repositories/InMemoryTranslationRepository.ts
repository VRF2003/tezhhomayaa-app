import { TranslationSet } from "../core/types";
import { ITranslationRepository } from "./ITranslationRepository";

const mockTranslationSets: TranslationSet[] = [
  // 1. Global English (Base)
  {
    id: "ts-global-en",
    name: "Global English Base",
    status: "PUBLISHED",
    priority: 10,
    entries: [
      { id: "e1", namespace: "common", translationKey: "welcome", languageCode: "en", marketId: "GLOBAL", value: "Welcome to Tezhhomayaa", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null },
      { id: "e2", namespace: "common", translationKey: "greeting", languageCode: "en", marketId: "GLOBAL", value: "Hello {name}", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 2. Language Override (French Global)
  {
    id: "ts-global-fr",
    name: "Global French Base",
    status: "PUBLISHED",
    priority: 10,
    entries: [
      { id: "e3", namespace: "common", translationKey: "welcome", languageCode: "fr", marketId: "GLOBAL", value: "Bienvenue chez Tezhhomayaa", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 3. Market Override (English in UAE)
  {
    id: "ts-ae-en",
    name: "UAE English Overrides",
    status: "PUBLISHED",
    priority: 100,
    entries: [
      { id: "e4", namespace: "common", translationKey: "welcome", languageCode: "en", marketId: "mkt_ae", value: "Welcome to Tezhhomayaa Dubai", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 4. Region Fallback (Arabic in Middle East)
  {
    id: "ts-me-ar",
    name: "Middle East Arabic Base",
    status: "PUBLISHED",
    priority: 50,
    entries: [
      { id: "e5", namespace: "common", translationKey: "welcome", languageCode: "ar", marketId: "REGION", regionId: "Middle East", value: "مرحباً بكم في تيجومايا", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 7. Namespace resolution (checkout vs common)
  {
    id: "ts-checkout-en",
    name: "Checkout Strings English",
    status: "PUBLISHED",
    priority: 10,
    entries: [
      { id: "e6", namespace: "checkout", translationKey: "total", languageCode: "en", marketId: "GLOBAL", value: "Order Total", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 8. Scheduled translation (Ramadan Campaign)
  {
    id: "ts-ramadan-future",
    name: "Ramadan Campaign 2026",
    status: "PUBLISHED",
    priority: 200,
    validFrom: "2026-03-01T00:00:00.000Z",
    validUntil: "2026-04-01T23:59:59.000Z",
    entries: [
      { id: "e7", namespace: "common", translationKey: "welcome", languageCode: "ar", marketId: "REGION", regionId: "Middle East", value: "رمضان كريم من تيجومايا", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 9. Expired translation
  {
    id: "ts-expired",
    name: "Expired NYE Campaign",
    status: "PUBLISHED",
    priority: 500,
    validFrom: "2020-12-01T00:00:00.000Z",
    validUntil: "2020-12-31T23:59:59.000Z",
    entries: [
      { id: "e8", namespace: "common", translationKey: "welcome", languageCode: "en", marketId: "GLOBAL", value: "Happy New Year!", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  },
  // 10. Priority Conflict (Tie Breaker)
  {
    id: "ts-global-en-alt",
    name: "Global English Tie Breaker",
    status: "PUBLISHED",
    priority: 10,
    publishedAt: new Date().toISOString(), // Newer, so it wins
    entries: [
      { id: "e9", namespace: "common", translationKey: "welcome", languageCode: "en", marketId: "GLOBAL", value: "Welcome to Tezhhomayaa (Updated)", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "admin", updatedBy: "admin", deletedAt: null, deletedBy: null }
    ],
    createdBy: "admin", updatedBy: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null, deletedBy: null
  }
];

export class InMemoryTranslationRepository implements ITranslationRepository {
  async findById(id: string): Promise<TranslationSet | null> {
    const set = mockTranslationSets.find(c => c.id === id);
    if (!set || set.deletedAt) return null;
    return JSON.parse(JSON.stringify(set));
  }

  async findAll(): Promise<TranslationSet[]> {
    return mockTranslationSets
      .filter(c => !c.deletedAt)
      .map(c => JSON.parse(JSON.stringify(c)));
  }

  async findByNamespace(namespace: string): Promise<TranslationSet[]> {
    // Return sets that contain at least one entry in this namespace
    return mockTranslationSets
      .filter(c => !c.deletedAt && c.entries.some(e => e.namespace === namespace))
      .map(c => JSON.parse(JSON.stringify(c)));
  }

  async create(set: TranslationSet): Promise<void> {
    mockTranslationSets.push(JSON.parse(JSON.stringify(set)));
  }

  async update(set: TranslationSet): Promise<void> {
    const index = mockTranslationSets.findIndex(c => c.id === set.id);
    if (index >= 0) {
      mockTranslationSets[index] = JSON.parse(JSON.stringify(set));
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const index = mockTranslationSets.findIndex(c => c.id === id);
    if (index >= 0) {
      mockTranslationSets[index].deletedAt = new Date().toISOString();
      mockTranslationSets[index].deletedBy = deletedBy;
    }
  }
}
