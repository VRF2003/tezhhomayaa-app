# Tax Engine Core

This domain (`lib/tax`) contains the core backend implementation of Phase 4.2 of the Tezhhomayaa Enterprise Tax & Compliance Platform.

## Architecture

This module implements the strict specifications from `docs/TAX_ENGINE.md`.
It operates as the definitive single source of truth for all global tax calculations, compliance tracking, and invoice breakdowns.

### Core Models (`types.ts`)
1. **TaxRequest:** The primary input contract, designed to accept `cartSubtotal` and `shippingAmount` from upstream engines.
2. **TaxProfile:** Defines the specific legal regime for a region (e.g., India GST at 18%). Includes `calculationMode` (`INCLUSIVE` or `EXCLUSIVE`) to dynamically determine mathematical operations.
3. **ProductTaxCategory:** Classifies items to apply specific tax rules (e.g., `FASHION` vs `SHIPPING_SERVICE`).
4. **TaxResult:** A consolidated return payload encompassing the total liability, auditable breakdowns, and compliance metadata required by Checkout and ERP systems.

### Seeding (`seed.ts`)
We have seeded foundational compliance data for:
- **India:** GST (18%) for Fashion and Shipping (Inclusive).
- **UAE:** VAT (5%) for Fashion and Shipping (Inclusive).
- **Singapore:** GST (9%) for Fashion and Shipping (Inclusive).

### Service (`TaxService.ts`)
The `TaxService` resolves the exact liability by orchestrating mathematical strategies based on the `calculationMode`.
- **INCLUSIVE Extraction:** `Tax = Amount - (Amount / (1 + Rate))` (e.g., VAT/GST).
- **EXCLUSIVE Addition:** `Tax = Amount * Rate` (e.g., US Sales Tax).

## Dependencies & Flow
The Tax Engine is strictly downstream of the Market, Pricing, and Shipping Engines. 
**Market → Pricing → Shipping → Tax Engine.**
It *consumes* their values but *never* modifies them.

## AI Development Rules
> [!CAUTION]
> 1. **Never** calculate taxes in the UI.
> 2. **Never** hardcode tax percentages (e.g., `0.05` for UAE).
> 3. **Always** invoke `TaxService.resolveTax()` on the server to determine liabilities.
> 4. **Never** guess taxes for unsupported markets; rely on the service returning `isSupported: false`.
