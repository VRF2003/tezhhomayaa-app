export type TaxCalculationMode = "INCLUSIVE" | "EXCLUSIVE";
export type TaxProfileStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export enum ProductTaxCategory {
  FASHION = "FASHION",
  ACCESSORIES = "ACCESSORIES",
  SERVICES = "SERVICES",
  GIFT_CARD = "GIFT_CARD",
  SHIPPING_SERVICE = "SHIPPING_SERVICE",
}

export interface TaxProfile {
  id: string;
  code: string;               // e.g., "TAX_IN_GST_18"
  marketCode: string;         // e.g., "IN"
  category: ProductTaxCategory;
  taxType: string;            // e.g., "GST", "VAT", "SALES_TAX"
  taxRate: number;            // Decimal percentage (e.g., 0.18 for 18%)
  calculationMode: TaxCalculationMode;
  status: TaxProfileStatus;
  priority: number;           // Higher priority overrides
  effectiveDate: string;      // ISO Timestamp
  expiryDate?: string;        // ISO Timestamp
  isDefault: boolean;
}

export interface TaxBreakdown {
  label: string;              // e.g., "CGST (9%)" or "Standard VAT (5%)"
  rate: number;               // e.g., 0.09
  amount: number;             // Calculated value
}

export interface ComplianceMetadata {
  legalEntity: string;        // e.g., "Tezhhomayaa India Pvt Ltd"
  taxRegistrationNumber?: string; // e.g., GSTIN or TRN
  appliedRules: string[];     // Array of strategy rules applied (e.g., ["INCLUSIVE_EXTRACTION", "GST_SPLIT"])
}

// ─────────────────────────────────────────────────────────────────
// API Contract Types

export interface TaxRequest {
  marketCode: string;
  cartSubtotal: number;
  shippingAmount: number;
  // Future expansions:
  // items: TaxLineItem[];
  // customerContext: CustomerContext;
}

export interface TaxResult {
  isSupported: boolean;
  marketCode?: string;
  totalTaxAmount?: number;
  merchandiseTaxAmount?: number;
  shippingTaxAmount?: number;
  
  // Auditable resolution paths
  calculationMode?: TaxCalculationMode;
  merchandiseProfileApplied?: string; 
  shippingProfileApplied?: string;

  breakdowns?: TaxBreakdown[];
  compliance?: ComplianceMetadata;
  
  error?: string; // Reason for unsupported state
}
