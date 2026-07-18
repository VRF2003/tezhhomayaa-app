import { Campaign } from "../campaigns/types";
import { ICampaignRepository } from "./ICampaignRepository";

// Only real, user-created campaigns live here.
// No example/seed data.
let mockCampaigns: Campaign[] = [
  {
    id: "camp-indian-summer",
    name: "Indian Summer",
    slug: "indian-summer",
    description: "",
    status: "PUBLISHED",
    campaignType: "PROMOTIONAL",
    marketId: "GLOBAL",
    validFrom: "2026-07-17T00:00:00.000Z",
    validUntil: "2026-07-30T23:59:59.000Z",
    createdBy: "admin",
    updatedBy: "admin",
    publishedBy: "admin",
    publishedAt: "2026-07-17T14:00:00.000Z",
    version: 1,
    createdAt: "2026-07-17T08:44:00.000Z",
    updatedAt: "2026-07-17T14:00:00.000Z",
    deletedAt: null,
    deletedBy: null,
    sections: [
      {
        id: "sec-indian-summer-hero",
        campaignId: "camp-indian-summer",
        slug: "home-hero-banner",
        sectionType: "HERO_BANNER",
        contentItemId: "ci-indian-summer-hero"
      }
    ]
  }
];

export class InMemoryCampaignRepository implements ICampaignRepository {
  async findById(id: string): Promise<Campaign | null> {
    const campaign = mockCampaigns.find(c => c.id === id);
    if (!campaign || campaign.deletedAt) return null;
    return JSON.parse(JSON.stringify(campaign)); // deep clone
  }

  async findAll(): Promise<Campaign[]> {
    return mockCampaigns.filter(c => !c.deletedAt).map(c => JSON.parse(JSON.stringify(c)));
  }

  async create(campaign: Campaign): Promise<void> {
    mockCampaigns.push(JSON.parse(JSON.stringify(campaign)));
  }

  async update(campaign: Campaign): Promise<void> {
    const index = mockCampaigns.findIndex(c => c.id === campaign.id);
    if (index >= 0) {
      mockCampaigns[index] = JSON.parse(JSON.stringify(campaign));
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const index = mockCampaigns.findIndex(c => c.id === id);
    if (index >= 0) {
      mockCampaigns[index].deletedAt = new Date().toISOString();
      mockCampaigns[index].deletedBy = deletedBy;
    }
  }
}
