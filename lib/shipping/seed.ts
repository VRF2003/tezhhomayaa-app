import { Warehouse, DeliveryMethod, ShippingProfile } from "./types";

// ─────────────────────────────────────────────────────────────────
// WAREHOUSES
// ─────────────────────────────────────────────────────────────────

export const WAREHOUSES: Record<string, Warehouse> = {
  WH_MUMBAI: {
    id: "wh_mumbai_01",
    code: "WH_MUMBAI",
    name: "Mumbai Hub",
    locationCountry: "IN",
    status: "ACTIVE",
  },
  WH_DUBAI: {
    id: "wh_dubai_01",
    code: "WH_DUBAI",
    name: "Dubai Hub",
    locationCountry: "AE",
    status: "ACTIVE",
  },
  WH_SINGAPORE: {
    id: "wh_singapore_01",
    code: "WH_SINGAPORE",
    name: "Singapore Hub",
    locationCountry: "SG",
    status: "ACTIVE",
  },
  // Future Expansion Warehouses (Inactive to avoid routing logic changes later)
  WH_LONDON: {
    id: "wh_london_01",
    code: "WH_LONDON",
    name: "London Hub",
    locationCountry: "GB",
    status: "INACTIVE", 
  },
  WH_NEWYORK: {
    id: "wh_newyork_01",
    code: "WH_NEWYORK",
    name: "New York Hub",
    locationCountry: "US",
    status: "INACTIVE",
  },
};

// ─────────────────────────────────────────────────────────────────
// DELIVERY METHODS
// ─────────────────────────────────────────────────────────────────
// Instead of a flat list, we define templates that get resolved based on context

export const DELIVERY_METHODS: Record<string, DeliveryMethod> = {
  // INDIA
  MTH_IN_STANDARD: {
    id: "mth_in_std",
    code: "MTH_IN_STANDARD",
    name: "Standard Delivery",
    price: 150,
    currency: "INR",
    estimatedDelivery: "3–5 Business Days",
  },
  MTH_IN_EXPRESS: {
    id: "mth_in_exp",
    code: "MTH_IN_EXPRESS",
    name: "Express Delivery",
    price: 450,
    currency: "INR",
    estimatedDelivery: "1–2 Business Days",
  },

  // UAE
  MTH_AE_STANDARD: {
    id: "mth_ae_std",
    code: "MTH_AE_STANDARD",
    name: "Standard Delivery",
    price: 35,
    currency: "AED",
    estimatedDelivery: "2–4 Business Days",
  },
  MTH_AE_EXPRESS: {
    id: "mth_ae_exp",
    code: "MTH_AE_EXPRESS",
    name: "Express Delivery",
    price: 75,
    currency: "AED",
    estimatedDelivery: "Next Business Day",
  },

  // SINGAPORE
  MTH_SG_STANDARD: {
    id: "mth_sg_std",
    code: "MTH_SG_STANDARD",
    name: "Standard Delivery",
    price: 15,
    currency: "SGD",
    estimatedDelivery: "3–5 Business Days",
  },
  MTH_SG_EXPRESS: {
    id: "mth_sg_exp",
    code: "MTH_SG_EXPRESS",
    name: "Priority Delivery",
    price: 35,
    currency: "SGD",
    estimatedDelivery: "1–2 Business Days",
  },
};

// ─────────────────────────────────────────────────────────────────
// SHIPPING PROFILES
// ─────────────────────────────────────────────────────────────────

export const SHIPPING_PROFILES: ShippingProfile[] = [
  {
    id: "sp_in_domestic_01",
    code: "SP_IN_DOMESTIC",
    name: "India Domestic Fulfillment",
    marketCodes: ["IN"],
    zone: "DOMESTIC",
    warehouseId: WAREHOUSES.WH_MUMBAI.id,
    freeShippingThreshold: 5000,
    currency: "INR",
    defaultDeliveryMethodId: DELIVERY_METHODS.MTH_IN_STANDARD.id,
    availableDeliveryMethodIds: [
      DELIVERY_METHODS.MTH_IN_STANDARD.id,
      DELIVERY_METHODS.MTH_IN_EXPRESS.id,
    ],
    status: "ACTIVE",
    priority: 100,
  },
  {
    id: "sp_ae_gcc_01",
    code: "SP_AE_GCC",
    name: "UAE GCC Fulfillment",
    marketCodes: ["AE"],
    zone: "GCC",
    warehouseId: WAREHOUSES.WH_DUBAI.id,
    freeShippingThreshold: 500,
    currency: "AED",
    defaultDeliveryMethodId: DELIVERY_METHODS.MTH_AE_STANDARD.id,
    availableDeliveryMethodIds: [
      DELIVERY_METHODS.MTH_AE_STANDARD.id,
      DELIVERY_METHODS.MTH_AE_EXPRESS.id,
    ],
    status: "ACTIVE",
    priority: 100,
  },
  {
    id: "sp_sg_asiapacific_01",
    code: "SP_SG_ASIAPACIFIC",
    name: "Singapore Asia Pacific Fulfillment",
    marketCodes: ["SG"],
    zone: "ASIA_PACIFIC",
    warehouseId: WAREHOUSES.WH_SINGAPORE.id,
    freeShippingThreshold: 200,
    currency: "SGD",
    defaultDeliveryMethodId: DELIVERY_METHODS.MTH_SG_STANDARD.id,
    availableDeliveryMethodIds: [
      DELIVERY_METHODS.MTH_SG_STANDARD.id,
      DELIVERY_METHODS.MTH_SG_EXPRESS.id,
    ],
    status: "ACTIVE",
    priority: 100,
  },
];
