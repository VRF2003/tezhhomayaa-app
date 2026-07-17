import { TaxProfile, ProductTaxCategory } from "./types";

// ─────────────────────────────────────────────────────────────────
// TAX PROFILES SEED
// ─────────────────────────────────────────────────────────────────

export const TAX_PROFILES: TaxProfile[] = [
  // ─── INDIA (GST) ────────────────────────────────────────────────
  {
    id: "tp_in_fashion_gst18",
    code: "TAX_IN_FASHION_GST18",
    marketCode: "IN",
    category: ProductTaxCategory.FASHION,
    taxType: "GST",
    taxRate: 0.18,
    calculationMode: "INCLUSIVE",
    status: "ACTIVE",
    priority: 100,
    effectiveDate: "2024-01-01T00:00:00Z",
    isDefault: true,
  },
  {
    id: "tp_in_shipping_gst18",
    code: "TAX_IN_SHIPPING_GST18",
    marketCode: "IN",
    category: ProductTaxCategory.SHIPPING_SERVICE,
    taxType: "GST",
    taxRate: 0.18,
    calculationMode: "INCLUSIVE",
    status: "ACTIVE",
    priority: 100,
    effectiveDate: "2024-01-01T00:00:00Z",
    isDefault: true,
  },

  // ─── UAE (VAT) ──────────────────────────────────────────────────
  {
    id: "tp_ae_fashion_vat5",
    code: "TAX_AE_FASHION_VAT5",
    marketCode: "AE",
    category: ProductTaxCategory.FASHION,
    taxType: "VAT",
    taxRate: 0.05,
    calculationMode: "INCLUSIVE",
    status: "ACTIVE",
    priority: 100,
    effectiveDate: "2024-01-01T00:00:00Z",
    isDefault: true,
  },
  {
    id: "tp_ae_shipping_vat5",
    code: "TAX_AE_SHIPPING_VAT5",
    marketCode: "AE",
    category: ProductTaxCategory.SHIPPING_SERVICE,
    taxType: "VAT",
    taxRate: 0.05,
    calculationMode: "INCLUSIVE",
    status: "ACTIVE",
    priority: 100,
    effectiveDate: "2024-01-01T00:00:00Z",
    isDefault: true,
  },

  // ─── SINGAPORE (GST) ────────────────────────────────────────────
  {
    id: "tp_sg_fashion_gst9",
    code: "TAX_SG_FASHION_GST9",
    marketCode: "SG",
    category: ProductTaxCategory.FASHION,
    taxType: "GST",
    taxRate: 0.09,
    calculationMode: "INCLUSIVE",
    status: "ACTIVE",
    priority: 100,
    effectiveDate: "2024-01-01T00:00:00Z",
    isDefault: true,
  },
  {
    id: "tp_sg_shipping_gst9",
    code: "TAX_SG_SHIPPING_GST9",
    marketCode: "SG",
    category: ProductTaxCategory.SHIPPING_SERVICE,
    taxType: "GST",
    taxRate: 0.09,
    calculationMode: "INCLUSIVE",
    status: "ACTIVE",
    priority: 100,
    effectiveDate: "2024-01-01T00:00:00Z",
    isDefault: true,
  },
];
