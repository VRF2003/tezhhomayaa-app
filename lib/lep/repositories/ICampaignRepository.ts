import { Campaign } from "../campaigns/types";

export interface ICampaignRepository {
  findById(id: string): Promise<Campaign | null>;
  findAll(): Promise<Campaign[]>;
  create(campaign: Campaign): Promise<void>;
  update(campaign: Campaign): Promise<void>;
  softDelete(id: string, deletedBy: string): Promise<void>;
}
