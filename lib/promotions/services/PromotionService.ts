import { Promotion, PromotionStatus } from "../models";
import { FirestorePromotionRepository } from "../repositories/FirestorePromotionRepository";
import { randomUUID } from "crypto";

export class PromotionService {
  constructor(private repository: FirestorePromotionRepository = new FirestorePromotionRepository()) {}

  public async getAllPromotions(): Promise<Promotion[]> {
    const promos = await this.repository.findAll();
    return promos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getPromotion(id: string): Promise<Promotion | null> {
    return this.repository.findById(id);
  }

  public async createPromotion(promotion: Omit<Promotion, "id" | "createdAt" | "updatedAt">): Promise<Promotion> {
    const newPromo: Promotion = {
      ...promotion,
      id: `promo_${randomUUID().replace(/-/g, '').substring(0, 10)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.repository.save(newPromo);
    return newPromo;
  }

  public async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    const existing = await this.getPromotion(id);
    if (!existing) throw new Error(`Promotion ${id} not found`);

    const updated: Promotion = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(updated);
    return updated;
  }

  public async changeStatus(id: string, status: PromotionStatus, userId: string): Promise<Promotion> {
    const existing = await this.getPromotion(id);
    if (!existing) throw new Error(`Promotion ${id} not found`);

    // Basic state transition validation
    if (existing.status === 'ARCHIVED' && status !== 'ARCHIVED') {
      throw new Error("Cannot change status of an archived promotion.");
    }

    const updated: Promotion = {
      ...existing,
      status,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    };

    await this.repository.save(updated);
    return updated;
  }

  public async duplicatePromotion(id: string, userId: string): Promise<Promotion> {
    const existing = await this.getPromotion(id);
    if (!existing) throw new Error(`Promotion ${id} not found`);

    const duplicate: Promotion = {
      ...existing,
      id: `promo_${randomUUID().replace(/-/g, '').substring(0, 10)}`,
      name: `${existing.name} (Copy)`,
      status: 'DRAFT',
      code: existing.code ? `${existing.code}_COPY` : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      updatedBy: userId,
    };

    await this.repository.save(duplicate);
    return duplicate;
  }

  public async deletePromotion(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
