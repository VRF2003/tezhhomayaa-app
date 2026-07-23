export type PromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y' | 'AUTOMATIC' | 'GIFT_CARD';
export type PromotionStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED';

// -----------------------------------------
// NEW ENGINE: Eligibility, Trigger, Reward
// -----------------------------------------

export interface PromotionEligibility {
  customerGroups?: string[]; // VIP, Newsletter, etc.
  markets?: string[];
  firstOrderOnly: boolean;
  minPastOrders?: number;
}

export type TriggerType = 'MIN_CART_VALUE' | 'MIN_QUANTITY' | 'SPECIFIC_PRODUCTS' | 'SPECIFIC_COLLECTIONS' | 'NO_TRIGGER';
export interface PromotionTrigger {
  type: TriggerType;
  value?: number; // e.g., 5000 (₹) or 3 (qty)
  targetIds?: string[]; // Product IDs or Collection IDs
}

export type RewardType = 'PERCENTAGE_DISCOUNT' | 'FLAT_DISCOUNT' | 'FREE_SHIPPING' | 'CHEAPEST_ITEM_FREE' | 'CHEAPEST_ITEM_PERCENTAGE' | 'SPECIFIC_ITEM_FREE';
export interface PromotionReward {
  type: RewardType;
  value?: number; // e.g., 15 (%), 500 (₹), or 50 (%) for cheapest item 50% off
  targetIds?: string[]; // If specific items are rewarded
}

// -----------------------------------------
// ASSIGNMENT & COMMISSION
// -----------------------------------------

export interface CommissionRule {
  commissionPercent: number;
  revenueGenerated: number;
  ordersInfluenced: number;
}

export interface PromotionAssignment {
  participantId: string; // e.g., Creator ID, Employee ID, VIP ID
  participantName: string;
  assignmentType: 'INFLUENCER' | 'AFFILIATE' | 'VIP' | 'EMPLOYEE' | 'PARTNER';
}

// -----------------------------------------
// AGGREGATE ROOT
// -----------------------------------------

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  internalNotes?: string;
  code?: string; // Optional for Automatic promotions
  
  // Legacy type/value fields, keeping for backward compatibility in UI temporarily
  type: PromotionType;
  discountValue: number;
  
  status: PromotionStatus;
  
  // New Engine core
  eligibility: PromotionEligibility;
  trigger: PromotionTrigger;
  reward: PromotionReward;
  
  // Unified assignments (Influencer, VIP, Partner)
  assignment?: PromotionAssignment;
  commissionRule?: CommissionRule;
  
  // Validity
  validFrom: string | null;
  validUntil: string | null;
  timezone: string;
  
  // Audit
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// -----------------------------------------
// GIFT CARD
// -----------------------------------------

export interface GiftCard {
  id: string;
  code: string;
  initialBalance: number;
  remainingBalance: number;
  currency: string;
  expiration: string | null;
  status: 'ACTIVE' | 'DEPLETED' | 'EXPIRED' | 'REVOKED';
  transactions: Array<{
    date: string;
    amount: number;
    orderId?: string;
    type: 'CREDIT' | 'DEBIT';
  }>;
}
