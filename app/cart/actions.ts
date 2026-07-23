"use server";

import { PromotionService } from "@/lib/promotions/services/PromotionService";
import { PromotionRuleEngine, CartContext } from "@/lib/promotions/services/PromotionRuleEngine";
import { PricingRequest } from "@/lib/pricing/types";

export async function validateDiscountCodeAction(code: string | undefined, cartItems: { sku: string; quantity: number; unitPrice: number }[]) {
  const service = new PromotionService();
  const engine = new PromotionRuleEngine();
  
  const allPromos = await service.getAllPromotions();
  const activePromos = allPromos.filter(p => p.status === 'ACTIVE');

  // Filter valid promotions to evaluate
  // We want to evaluate all "AUTOMATIC" promotions (those without a code)
  // PLUS the specific promotion that matches the entered code (if provided)
  const promotionsToEvaluate = activePromos.filter(p => {
    if (!p.code) return true; // Automatic promotion
    if (code && p.code.toLowerCase() === code.toLowerCase()) return true; // Matches entered code
    return false; // Code doesn't match
  });

  const request: PricingRequest = {
    marketCode: 'DEFAULT',
    cartItems: cartItems
  };

  const context: CartContext = {
    isFirstOrder: false // In a real app, check user session
  };

  const { discountTotal, appliedPromotions } = engine.calculateBestDiscount(request, context, promotionsToEvaluate);

  if (appliedPromotions.length > 0) {
    return {
      success: true,
      discountTotal,
      appliedPromotionName: appliedPromotions[0].name,
      appliedCode: appliedPromotions[0].code,
      message: "Discount applied successfully"
    };
  }

  return {
    success: false,
    discountTotal: 0,
    message: code ? "Discount code invalid or criteria not met" : "No automatic discounts apply"
  };
}
