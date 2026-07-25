"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store";
import { PromotionRuleEngine } from "@/lib/promotions/services/PromotionRuleEngine";
import { useCurrency } from "@/components/CurrencyProvider";

export function PrivateConciergeToast({ activePromotions }: { activePromotions: any[] }) {
  const { items } = useCart();
  const { formatPrice } = useCurrency();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastCartCount, setLastCartCount] = useState(0);

  useEffect(() => {
    if (!activePromotions || activePromotions.length === 0) return;

    const currentCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // If they remove items, immediately hide any showing toasts and do not re-evaluate
    if (currentCount < lastCartCount) {
      setLastCartCount(currentCount);
      setIsVisible(false);
      return;
    }

    if (items.length === 0) return;

    // If the count hasn't changed, do nothing
    if (currentCount === lastCartCount) {
      return;
    }
    
    setLastCartCount(currentCount);

    const engine = new PromotionRuleEngine();
    
    // Create a mock request object from current cart
    const request = {
      cartItems: items.map(i => ({
        productId: i.product.id,
        variantId: i.product.variants?.[0]?.sku || "",
        sku: i.product.variants?.[0]?.sku || "",
        unitPrice: Number(i.product.variants?.[0]?.price) || 0,
        quantity: i.quantity,
        category: i.product.category,
        tags: i.product.tags || []
      })),
      currency: "INR",
      customer: { id: "guest", tags: [] }
    };

    const context = {
      cartSubtotal: 0,
      customerTags: [],
      firstOrder: false,
      couponCodes: [],
      totalQuantity: currentCount
    };

    // Calculate progress
    const progressList = engine.calculatePromotionProgress(
      request as any, 
      context as any, 
      activePromotions,
      (val) => formatPrice(val)
    );

    // Find the closest promotion that is nearly unlocked
    // For quantity, if they are 1 item away, show it regardless of %. Otherwise, use 80%.
    const thresholdProgs = progressList
      .filter(p => (p.progressPercent >= 80 && p.progressPercent < 100) || (p.requiredVal && p.requiredVal - p.currentVal === 1 && p.currentVal > 0))
      .sort((a, b) => b.progressPercent - a.progressPercent);

    if (thresholdProgs.length > 0) {
      setToastMessage(thresholdProgs[0].message);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Check if one just hit 100%
      const unlocked = progressList.filter(p => p.isUnlocked);
      if (unlocked.length > 0) {
        // Sort by required value descending (hardest to unlock takes priority)
        unlocked.sort((a, b) => (b.requiredVal || 0) - (a.requiredVal || 0));
        setToastMessage(unlocked[0].message);
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [items, activePromotions, formatPrice, lastCartCount]);

  return (
    <AnimatePresence>
      {isVisible && toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            position: "fixed",
            bottom: "30px",
            left: "30px",
            zIndex: 9999,
            background: "rgba(26, 26, 24, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "1.2rem 1.8rem",
            maxWidth: "360px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
          }}
        >
          <p style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "1.1rem",
            color: "#f7f5f2",
            margin: 0,
            lineHeight: 1.4,
            fontWeight: 300,
            letterSpacing: "0.02em"
          }}>
            {toastMessage}
          </p>
          <p className="text-[0.65rem] tracking-wider text-gray-500 font-dm-mono uppercase mt-2 mb-4">
            Unlock at {formatPrice(activePromotions[0].conditions.cartMinimum)}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
