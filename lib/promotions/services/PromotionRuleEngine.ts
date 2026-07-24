import { Promotion } from "../models";
import { PricingRequest } from "../../pricing/types";

export interface CartContext {
  userId?: string;
  customerGroups?: string[];
  isFirstOrder?: boolean;
  pastOrdersCount?: number;
}

export class PromotionRuleEngine {
  
  /**
   * Resolves conflicts among eligible promotions and calculates the total discount.
   */
  public calculateBestDiscount(
    request: PricingRequest, 
    context: CartContext, 
    activePromotions: Promotion[]
  ): { discountTotal: number; appliedPromotions: Promotion[] } {
    
    // 1. Filter by eligibility and triggers
    const validPromotions = activePromotions.filter(promo => 
      this.evaluateEligibility(context, request, promo) && 
      this.evaluateTrigger(request, promo)
    );

    if (validPromotions.length === 0) {
      return { discountTotal: 0, appliedPromotions: [] };
    }

    // 2. Calculate rewards for all valid promotions and find the best one
    let bestDiscount = 0;
    let bestPromotion: Promotion | null = null;
    
    for (const promo of validPromotions) {
      const discount = this.calculateReward(request, promo);
      if (discount > bestDiscount) {
        bestDiscount = discount;
        bestPromotion = promo;
      }
    }

    if (bestDiscount > 0 && bestPromotion) {
      return { discountTotal: bestDiscount, appliedPromotions: [bestPromotion] };
    }

    return { discountTotal: 0, appliedPromotions: [] };
  }

  private evaluateEligibility(context: CartContext, request: PricingRequest, promo: Promotion): boolean {
    const { eligibility } = promo;
    
    if (eligibility.firstOrderOnly && !context.isFirstOrder) {
      return false;
    }
    
    if (eligibility.minPastOrders && (context.pastOrdersCount || 0) < eligibility.minPastOrders) {
      return false;
    }

    if (eligibility.customerGroups && eligibility.customerGroups.length > 0) {
      const hasGroup = context.customerGroups?.some(g => eligibility.customerGroups?.includes(g));
      if (!hasGroup) return false;
    }

    if (eligibility.markets && eligibility.markets.length > 0) {
      if (!eligibility.markets.includes(request.marketCode)) return false;
    }

    return true;
  }

  private evaluateTrigger(request: PricingRequest, promo: Promotion): boolean {
    const { trigger } = promo;
    
    if (trigger.type === 'NO_TRIGGER') return true;

    if (trigger.type === 'MIN_CART_VALUE') {
      const subtotal = request.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      return subtotal >= (trigger.value || 0);
    }

    if (trigger.type === 'MIN_QUANTITY') {
      let eligibleQty = 0;
      if (trigger.targetIds && trigger.targetIds.length > 0) {
        eligibleQty = request.cartItems
          .filter(item => trigger.targetIds?.includes(item.sku))
          .reduce((sum, item) => sum + item.quantity, 0);
      } else {
        eligibleQty = request.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      }
      return eligibleQty >= (trigger.value || 0);
    }

    if (trigger.type === 'SPECIFIC_PRODUCTS' && trigger.targetIds) {
      return request.cartItems.some(item => trigger.targetIds?.includes(item.sku));
    }

    // specific collections requires product metadata expansion (mocked true for now)
    if (trigger.type === 'SPECIFIC_COLLECTIONS') {
      return true;
    }

    return false;
  }

  private calculateReward(request: PricingRequest, promo: Promotion): number {
    const { reward, trigger } = promo;
    const subtotal = request.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    if (reward.type === 'PERCENTAGE_DISCOUNT') {
      let eligibleTotal = subtotal;
      if (reward.targetIds && reward.targetIds.length > 0) {
        eligibleTotal = request.cartItems
          .filter(item => reward.targetIds?.includes(item.sku))
          .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      }
      return eligibleTotal * ((reward.value || 0) / 100);
    }

    if (reward.type === 'FLAT_DISCOUNT') {
      return reward.value || 0; // Flat discount off total cart
    }

    if (reward.type === 'FREE_SHIPPING') {
      // Mock shipping cost for now
      return 0; // The checkout engine would intercept this
    }

    if (reward.type === 'CHEAPEST_ITEM_FREE' || reward.type === 'CHEAPEST_ITEM_PERCENTAGE') {
      // Flatten cart items to array of individual items for sorting
      const individualItems: { sku: string; price: number }[] = [];
      
      request.cartItems.forEach(item => {
        // Only include targeted items if targetIds exist, else all items
        if (!reward.targetIds || reward.targetIds.length === 0 || reward.targetIds.includes(item.sku)) {
          for (let i = 0; i < item.quantity; i++) {
            individualItems.push({ sku: item.sku, price: item.unitPrice });
          }
        }
      });

      if (individualItems.length === 0) return 0;

      // Sort by price descending
      individualItems.sort((a, b) => b.price - a.price);
      
      // The cheapest items are at the end of the array
      
      if (reward.type === 'CHEAPEST_ITEM_PERCENTAGE') {
        const cheapest = individualItems[individualItems.length - 1];
        return cheapest.price * ((reward.value || 0) / 100);
      }

      if (reward.type === 'CHEAPEST_ITEM_FREE') {
        let freeItemsCount = 1;
        if (trigger.type === 'MIN_QUANTITY') {
          const x = trigger.value || 1;
          const y = reward.value || 1;
          const groupSize = x + y;
          const timesMet = Math.floor(individualItems.length / groupSize);
          freeItemsCount = timesMet * y;
        } else if (trigger.type === 'MIN_CART_VALUE') {
          const timesMet = Math.floor(subtotal / (trigger.value || 1));
          freeItemsCount = timesMet * (reward.value || 1);
        } else {
          freeItemsCount = reward.value || 1;
        }

        if (freeItemsCount === 0) return 0;
        if (freeItemsCount > individualItems.length) freeItemsCount = individualItems.length;

        let discount = 0;
        for (let i = individualItems.length - freeItemsCount; i < individualItems.length; i++) {
          discount += individualItems[i].price;
        }
        return discount;
      }
    }

    if (reward.type === 'SPECIFIC_ITEM_FREE') {
      if (!reward.targetIds || reward.targetIds.length === 0) return 0;
      
      const targetedItems = request.cartItems.filter(item => reward.targetIds!.includes(item.sku));
      if (targetedItems.length === 0) return 0;
      
      targetedItems.sort((a, b) => b.unitPrice - a.unitPrice);
      return targetedItems[0].unitPrice; // Free 1 unit of the highest priced matched item
    }

    return 0;
  }

  public calculatePromotionProgress(
    request: PricingRequest,
    context: CartContext,
    activePromotions: Promotion[],
    formatter: (val: number) => string
  ): PromotionProgress[] {
    const results: PromotionProgress[] = [];

    for (const promo of activePromotions) {
      if (!this.evaluateEligibility(context, request, promo)) continue;
      
      const { trigger, reward } = promo;
      if (trigger.type === 'NO_TRIGGER') continue;

      let currentVal = 0;
      let requiredVal = trigger.value || 0;
      let missingMsg = "";
      
      if (trigger.type === 'MIN_CART_VALUE') {
        currentVal = request.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const missing = requiredVal - currentVal;
        missingMsg = `Add ${formatter(missing)}`;
      } else if (trigger.type === 'MIN_QUANTITY') {
        if (trigger.targetIds && trigger.targetIds.length > 0) {
          currentVal = request.cartItems
            .filter(item => trigger.targetIds?.includes(item.sku))
            .reduce((sum, item) => sum + item.quantity, 0);
        } else {
          currentVal = request.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        }
        const missing = requiredVal - currentVal;
        missingMsg = `Add ${missing} more ${missing === 1 ? 'item' : 'items'}`;
      } else {
        continue;
      }

      if (requiredVal === 0) continue;
      
      const progressPercent = Math.min((currentVal / requiredVal) * 100, 100);
      const isUnlocked = progressPercent === 100;

      let rewardMsg = "";
      if (reward.type === 'PERCENTAGE_DISCOUNT') {
        rewardMsg = `an exclusive ${reward.value}% courtesy`;
      } else if (reward.type === 'FLAT_DISCOUNT') {
        rewardMsg = `a private ${formatter(reward.value || 0)} privilege`;
      } else if (reward.type === 'FREE_SHIPPING') {
        rewardMsg = `complimentary shipping`;
      } else if (reward.type === 'CHEAPEST_ITEM_FREE' || reward.type === 'SPECIFIC_ITEM_FREE') {
        rewardMsg = `${reward.value || 1} curated ${reward.value === 1 ? 'piece' : 'pieces'} with our compliments`;
      }

      let message = "";
      if (isUnlocked) {
        message = `${promo.name} unlocked: Enjoy ${rewardMsg}.${promo.code ? ` Use code ${promo.code} at checkout.` : ''}`;
      } else {
        message = `${promo.name}: ${missingMsg} to receive ${rewardMsg}.`;
      }

      results.push({
        promoId: promo.id,
        isUnlocked,
        progressPercent,
        message,
        currentVal,
        requiredVal
      });
    }

    return results;
  }
}

export interface PromotionProgress {
  promoId: string;
  isUnlocked: boolean;
  progressPercent: number;
  message: string;
  currentVal: number;
  requiredVal: number;
}
