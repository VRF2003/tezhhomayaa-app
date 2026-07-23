import { Promotion } from "../models";
import { DatabaseFactory } from "../../infrastructure/persistence/core/DatabaseFactory";

export class FirestorePromotionRepository {
  private get db() {
    return DatabaseFactory.getDriver();
  }

  public async findAll(): Promise<Promotion[]> {
    return this.db.query("promotions", {});
  }

  public async findById(id: string): Promise<Promotion | null> {
    return this.db.read("promotions", id);
  }

  public async save(promotion: Promotion): Promise<void> {
    await this.db.write("promotions", promotion.id, promotion);
  }

  public async delete(id: string): Promise<void> {
    await this.db.delete("promotions", id);
  }
}
