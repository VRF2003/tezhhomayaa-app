// ─── Commerce Experience Types ────────────────────────────────────────────────

export interface CommerceAddToBagSettings {
  buttonLabel: string;             // "Add to Bag"
  addingLabel: string;             // "Adding..."
  addedLabel: string;              // "Added"
  outOfStockLabel: string;         // "Out of Stock"
  selectSizeLabel: string;         // "Select Size"
  sizeLabelPrefix: string;         // "Size:"
  notifyMeLabel: string;           // "Notify Me"
  wishlistLabel: string;           // "Save to Wishlist"
  wishlistAddedLabel: string;      // "Saved"
}

export interface CommerceMiniCartSettings {
  drawerTitle: string;             // "Bag"
  emptyStateText: string;          // "Your bag is empty."
  emptyStateCta: string;           // "Continue Browsing"
  emptyStateCtaUrl: string;        // "/"
  subtotalLabel: string;           // "Subtotal"
  itemSingularLabel: string;       // "piece"
  itemPluralLabel: string;         // "pieces"
  sizeLabelPrefix: string;         // "Size:"
  removeLabel: string;             // "Remove"
  viewCartLabel: string;           // "View Bag & Checkout"
  continueBrowsingLabel: string;   // "Continue Browsing"
  shippingMessage: string;         // "Free shipping on orders above ..."
  trustBadgeEnabled: boolean;
  trustBadgeText: string;
}

export interface CommerceCartSettings {
  pageTitle: string;               // "Your Bag"
  headerImageEnabled?: boolean;
  headerImageUrl?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerHeight?: string;
  headerOverlayOpacity?: number;
  headerTextColor?: string;
  itemSingularLabel: string;       // "piece"
  itemPluralLabel: string;         // "pieces"
  emptyStateText: string;          // "Your bag is empty."
  emptyStateCta: string;           // "Continue Browsing"
  emptyStateCtaUrl: string;        // "/"
  sizeLabelPrefix: string;         // "Size:"
  removeLabel: string;             // "Remove"
  clearCartLabel: string;          // "Clear Bag"
  orderSummaryTitle: string;       // "Order Summary"
  subtotalLabel: string;           // "Subtotal"
  shippingLabel: string;           // "Shipping"
  shippingValue: string;           // "Free" | "Calculated at checkout"
  totalLabel: string;              // "Total"
  checkoutButtonLabel: string;     // "Proceed to Checkout"
  continueBrowsingLabel: string;   // "Continue Browsing"
  continueBrowsingUrl: string;     // "/"
  shippingMessage: string;         // "Free shipping on orders above..."
  shippingMessageEnabled: boolean;
  giftPackagingMessage: string;
  giftPackagingEnabled: boolean;
}

export interface CommerceCheckoutSettings {
  checkoutHeading: string;         // "Checkout"
  placeOrderLabel: string;         // "Place Order"
  backToCartLabel: string;         // "Back to Cart"
  paymentHeading: string;          // "Payment"
  shippingHeading: string;         // "Shipping Information"
  orderReviewHeading: string;      // "Review Your Order"
  noteLabel: string;               // "Add a note"
  notePlaceholder: string;         // "Special instructions..."
  termsText: string;
  termsLinkLabel: string;
  termsLinkUrl: string;
}

export interface CommerceShippingMessages {
  freeShippingThreshold: number;
  freeShippingMessage: string;     // "Free shipping on orders above {threshold}"
  freeShippingUnlocked: string;    // "You've unlocked free shipping!"
  progressBarEnabled: boolean;
  progressBarColor: string;
  standardShippingLabel: string;
  expressShippingLabel: string;
  freeShippingLabel: string;
  deliveryEstimateText: string;
}

export interface CommerceEmptyCartSettings {
  heading: string;                 // "Your Bag is Empty"
  subheading: string;              // "Discover our latest collection"
  ctaLabel: string;                // "Explore Collection"
  ctaUrl: string;                  // "/"
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  showRecentlyViewed: boolean;
  illustrationEnabled: boolean;
  illustrationText: string;        // "◈"
}

export interface CommerceRecommendedSettings {
  enabled: boolean;
  heading: string;                 // "You May Also Like"
  subheading: string;
  displayCount: number;            // 4
  source: "related" | "bestsellers" | "manual";
  manualProductIds: string[];
  showOnCart: boolean;
  showOnMiniCart: boolean;
  showOnEmptyCart: boolean;
}

export interface CommerceCartFooterSettings {
  trustMessagesEnabled: boolean;
  trustMessages: { icon: string; text: string; enabled: boolean }[];
  securePaymentText: string;
  acceptedPaymentText: string;
  returnPolicyText: string;
  returnPolicyUrl: string;
  privacyText: string;
  copyrightText: string;
}

export interface CommerceStyleSettings {
  // Bag Button
  addToBagBg: string;
  addToBagColor: string;
  addToBagBorderRadius: string;
  addToBagFontSize: string;
  addToBagLetterSpacing: string;
  // Cart
  cartBg: string;
  cartTextColor: string;
  cartBorderColor: string;
  summaryBg: string;
  checkoutButtonBg: string;
  checkoutButtonColor: string;
  // Mini Cart
  miniCartBg: string;
  miniCartWidth: string;
  // Typography
  headingFont: string;
  bodyFont: string;
}

export interface CommerceData {
  addToBag: CommerceAddToBagSettings;
  miniCart: CommerceMiniCartSettings;
  cart: CommerceCartSettings;
  checkout: CommerceCheckoutSettings;
  shipping: CommerceShippingMessages;
  emptyCart: CommerceEmptyCartSettings;
  recommended: CommerceRecommendedSettings;
  cartFooter: CommerceCartFooterSettings;
  style: CommerceStyleSettings;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultCommerceData: CommerceData = {
  addToBag: {
    buttonLabel: "Add to Bag",
    addingLabel: "Adding...",
    addedLabel: "Added",
    outOfStockLabel: "Out of Stock",
    selectSizeLabel: "Select a Size",
    sizeLabelPrefix: "Size:",
    notifyMeLabel: "Notify Me",
    wishlistLabel: "Save to Wishlist",
    wishlistAddedLabel: "Saved",
  },
  miniCart: {
    drawerTitle: "Bag",
    emptyStateText: "Your bag is empty.",
    emptyStateCta: "Continue Browsing",
    emptyStateCtaUrl: "/",
    subtotalLabel: "Subtotal",
    itemSingularLabel: "piece",
    itemPluralLabel: "pieces",
    sizeLabelPrefix: "Size:",
    removeLabel: "Remove",
    viewCartLabel: "View Bag & Checkout",
    continueBrowsingLabel: "Continue Browsing",
    shippingMessage: "Free shipping on orders above {threshold}",
    trustBadgeEnabled: true,
    trustBadgeText: "Complimentary gift packaging",
  },
  cart: {
    pageTitle: "Your Bag",
    headerImageEnabled: false,
    headerImageUrl: "",
    headerTitle: "Your Bag",
    headerSubtitle: "",
    headerHeight: "35vh",
    headerOverlayOpacity: 0.2,
    headerTextColor: "#ffffff",
    itemSingularLabel: "piece",
    itemPluralLabel: "pieces",
    emptyStateText: "Your bag is empty.",
    emptyStateCta: "Continue Browsing",
    emptyStateCtaUrl: "/",
    sizeLabelPrefix: "Size:",
    removeLabel: "Remove",
    clearCartLabel: "Clear Bag",
    orderSummaryTitle: "Order Summary",
    subtotalLabel: "Subtotal",
    shippingLabel: "Shipping",
    shippingValue: "Calculated at checkout",
    totalLabel: "Total",
    checkoutButtonLabel: "Proceed to Checkout",
    continueBrowsingLabel: "Continue Browsing",
    continueBrowsingUrl: "/",
    shippingMessage: "Free shipping on orders above {threshold}",
    shippingMessageEnabled: true,
    giftPackagingMessage: "Complimentary gift packaging",
    giftPackagingEnabled: true,
  },
  checkout: {
    checkoutHeading: "Checkout",
    placeOrderLabel: "Place Order",
    backToCartLabel: "Back to Cart",
    paymentHeading: "Payment",
    shippingHeading: "Shipping Information",
    orderReviewHeading: "Review Your Order",
    noteLabel: "Add a note to your order",
    notePlaceholder: "Special instructions for your order...",
    termsText: "By placing your order you agree to our",
    termsLinkLabel: "Terms & Conditions",
    termsLinkUrl: "/terms",
  },
  shipping: {
    freeShippingThreshold: 5000,
    freeShippingMessage: "Free shipping on orders above {threshold}",
    freeShippingUnlocked: "You've unlocked free shipping!",
    progressBarEnabled: true,
    progressBarColor: "#1a1a18",
    standardShippingLabel: "Standard Shipping",
    expressShippingLabel: "Express Shipping",
    freeShippingLabel: "Free Shipping",
    deliveryEstimateText: "Estimated delivery: 3–7 business days",
  },
  emptyCart: {
    heading: "Your Bag is Empty",
    subheading: "Discover our latest collection.",
    ctaLabel: "Explore Collection",
    ctaUrl: "/",
    secondaryCtaLabel: "Return Home",
    secondaryCtaUrl: "/",
    showRecentlyViewed: false,
    illustrationEnabled: true,
    illustrationText: "◈",
  },
  recommended: {
    enabled: true,
    heading: "You May Also Like",
    subheading: "",
    displayCount: 4,
    source: "related",
    manualProductIds: [],
    showOnCart: true,
    showOnMiniCart: false,
    showOnEmptyCart: true,
  },
  cartFooter: {
    trustMessagesEnabled: true,
    trustMessages: [
      { icon: "🔒", text: "Secure Checkout", enabled: true },
      { icon: "✦", text: "Complimentary Gift Packaging", enabled: true },
      { icon: "◎", text: "Free Returns within 14 Days", enabled: true },
    ],
    securePaymentText: "All transactions are encrypted and secure.",
    acceptedPaymentText: "We accept all major payment methods.",
    returnPolicyText: "Free returns within 14 days.",
    returnPolicyUrl: "/returns",
    privacyText: "Your data is safe with us.",
    copyrightText: "© TEZHHOMAYAA",
  },
  style: {
    addToBagBg: "#1a1a18",
    addToBagColor: "#f7f5f2",
    addToBagBorderRadius: "0px",
    addToBagFontSize: "0.55rem",
    addToBagLetterSpacing: "0.2em",
    cartBg: "#faf9f7",
    cartTextColor: "#1a1a18",
    cartBorderColor: "#ddd9d4",
    summaryBg: "#f0ede8",
    checkoutButtonBg: "#1a1a18",
    checkoutButtonColor: "#f7f5f2",
    miniCartBg: "#faf9f7",
    miniCartWidth: "440px",
    headingFont: "var(--font-cormorant, serif)",
    bodyFont: "var(--font-dm-mono, monospace)",
  },
};
