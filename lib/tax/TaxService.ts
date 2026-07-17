import { 
  TaxRequest, 
  TaxResult, 
  TaxProfile, 
  ProductTaxCategory,
  TaxBreakdown,
  ComplianceMetadata
} from "./types";
import { TAX_PROFILES } from "./seed";
import { MarketService } from "../market/MarketService";

export class TaxService {
  /**
   * Resolves the complete tax breakdown for a given checkout request.
   * This is the single source of truth for taxation logic.
   */
  static resolveTax(request: TaxRequest): TaxResult {
    // 1. Verify Market
    const market = MarketService.getMarketByCode(request.marketCode);
    if (!market || !market.enabled) {
      return {
        isSupported: false,
        error: `Market ${request.marketCode} is not recognized or not enabled.`,
      };
    }

    // 2. Resolve Tax Profiles
    const merchandiseProfile = this.getTaxProfileForMarket(request.marketCode, ProductTaxCategory.FASHION);
    const shippingProfile = this.getTaxProfileForMarket(request.marketCode, ProductTaxCategory.SHIPPING_SERVICE);

    if (!merchandiseProfile || merchandiseProfile.status !== "ACTIVE") {
      return {
        isSupported: false,
        marketCode: request.marketCode,
        error: `Taxation logic is currently unsupported for ${market.marketName}.`,
      };
    }

    // 3. Calculate Taxes based on Calculation Mode (Strategy Pattern orchestration)
    const merchandiseTax = this.calculateTaxAmount(request.cartSubtotal, merchandiseProfile);
    const shippingTax = shippingProfile ? this.calculateTaxAmount(request.shippingAmount, shippingProfile) : 0;
    
    const totalTaxAmount = merchandiseTax + shippingTax;

    // 4. Generate Breakdowns
    const breakdowns: TaxBreakdown[] = [];
    if (merchandiseTax > 0) {
      breakdowns.push({
        label: `Merchandise ${merchandiseProfile.taxType} (${merchandiseProfile.taxRate * 100}%)`,
        rate: merchandiseProfile.taxRate,
        amount: merchandiseTax,
      });
    }
    if (shippingTax > 0 && shippingProfile) {
      breakdowns.push({
        label: `Shipping ${shippingProfile.taxType} (${shippingProfile.taxRate * 100}%)`,
        rate: shippingProfile.taxRate,
        amount: shippingTax,
      });
    }

    // 5. Build Compliance Metadata
    const compliance: ComplianceMetadata = {
      legalEntity: `Tezhhomayaa ${market.marketName} Ltd`,
      appliedRules: [
        `MODE_${merchandiseProfile.calculationMode}`,
        `PROFILE_${merchandiseProfile.code}`,
      ],
    };

    // 6. Return Consolidated Result
    return {
      isSupported: true,
      marketCode: request.marketCode,
      totalTaxAmount: this.round(totalTaxAmount),
      merchandiseTaxAmount: this.round(merchandiseTax),
      shippingTaxAmount: this.round(shippingTax),
      calculationMode: merchandiseProfile.calculationMode, // assuming uniform mode for simplicity
      merchandiseProfileApplied: merchandiseProfile.code,
      shippingProfileApplied: shippingProfile?.code,
      breakdowns,
      compliance,
    };
  }

  /**
   * Internal: Finds the active tax profile with the highest priority.
   */
  private static getTaxProfileForMarket(marketCode: string, category: ProductTaxCategory): TaxProfile | null {
    const normalizedCode = marketCode.toUpperCase();
    const matchingProfiles = TAX_PROFILES.filter(
      (p) => p.status === "ACTIVE" && p.marketCode === normalizedCode && p.category === category
    );

    if (matchingProfiles.length === 0) return null;

    matchingProfiles.sort((a, b) => b.priority - a.priority);
    return matchingProfiles[0];
  }

  /**
   * Orchestrates calculation based on INCLUSIVE or EXCLUSIVE strategy.
   */
  private static calculateTaxAmount(baseAmount: number, profile: TaxProfile): number {
    if (baseAmount <= 0) return 0;

    if (profile.calculationMode === "INCLUSIVE") {
      // VAT/GST Extraction Formula: Tax = Amount - (Amount / (1 + Rate))
      return baseAmount - (baseAmount / (1 + profile.taxRate));
    } else if (profile.calculationMode === "EXCLUSIVE") {
      // Sales Tax Addition Formula: Tax = Amount * Rate
      return baseAmount * profile.taxRate;
    }
    return 0;
  }

  /**
   * Utility for currency rounding (e.g. 2 decimal places)
   */
  private static round(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
