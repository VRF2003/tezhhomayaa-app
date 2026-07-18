import { ContentItem } from "../core/types";
import { IContentItemRepository } from "./IContentItemRepository";

// Content items for all campaigns.
// Add a new entry here whenever a campaign needs a content item.
let mockContentItems: ContentItem[] = [
  {
    id: "ci-indian-summer-hero",
    name: "Indian Summer Hero Banner",
    slug: "indian-summer-hero",
    contentType: "HERO",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2026-07-17T08:44:00.000Z",
    updatedAt: "2026-07-17T14:00:00.000Z",
    deletedAt: null,
    deletedBy: null,
    payload: {
      title: "Indian Summer",
      subtitle: "A Season of Luxury",
      description: "Discover the finest pieces curated for the Indian Summer season.",
      primaryCta: "Explore Collection",
      primaryCtaUrl: "/collections/indian-summer",
      desktopImage: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop",
      mobileImage: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1000&auto=format&fit=crop"
    }
  }
];

export class InMemoryContentItemRepository implements IContentItemRepository {
  async findById(id: string): Promise<ContentItem | null> {
    const item = mockContentItems.find(c => c.id === id);
    if (!item || item.deletedAt) return null;
    return { ...item };
  }

  async findAll(): Promise<ContentItem[]> {
    return mockContentItems.filter(c => !c.deletedAt).map(c => ({ ...c }));
  }

  async create(item: ContentItem): Promise<void> {
    mockContentItems.push({ ...item });
  }

  async update(item: ContentItem): Promise<void> {
    const index = mockContentItems.findIndex(c => c.id === item.id);
    if (index >= 0) {
      mockContentItems[index] = { ...item };
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const index = mockContentItems.findIndex(c => c.id === id);
    if (index >= 0) {
      mockContentItems[index].deletedAt = new Date().toISOString();
      mockContentItems[index].deletedBy = deletedBy;
    }
  }
}
