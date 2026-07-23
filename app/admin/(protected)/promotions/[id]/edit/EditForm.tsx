"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePromotionAction } from "../../actions";
import { Promotion } from "@/lib/promotions/models";

export default function EditPromotionForm({ promo }: { promo: Promotion }) {
  const router = useRouter();
  const [triggerType, setTriggerType] = useState(promo.trigger?.type || "MIN_CART_VALUE");
  const [rewardType, setRewardType] = useState(promo.reward?.type || "PERCENTAGE_DISCOUNT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("id", promo.id);
      await updatePromotionAction(formData);
      router.push(`/admin/promotions/${promo.id}`);
    } catch (error) {
      console.error("Failed to update promotion:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.25rem 0" }}>Edit Promotion</h1>
          <p style={{ fontSize: "0.85rem", color: "#6b6865", margin: 0 }}>Update rules and eligibility for {promo.name}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href={`/admin/promotions/${promo.id}`} style={{ textDecoration: "none" }}>
            <button type="button" style={{ 
              background: "#ffffff", color: "#6b6865", padding: "0.8rem 1.5rem", border: "1px solid #e8e4df", 
              fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px"
            }}>
              Cancel
            </button>
          </Link>
          <button type="submit" disabled={isSubmitting} style={{ 
            background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", 
            fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px",
            opacity: isSubmitting ? 0.7 : 1
          }}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Basic Information */}
          <section style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>Basic Information</h2>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Promotion Name</label>
                <input name="name" defaultValue={promo.name} required type="text" style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px" }} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Discount Code (Optional)</label>
                  <input name="code" defaultValue={promo.code} type="text" style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", fontFamily: "var(--font-dm-mono, monospace)", borderRadius: "2px" }} />
                  <p style={{ fontSize: "0.65rem", color: "#9a9690", marginTop: "0.5rem" }}>Leave empty to make this an automatic promotion.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Trigger */}
          <section style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>Trigger (When does this apply?)</h2>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Trigger Type</label>
                  <select 
                    name="triggerType"
                    value={triggerType}
                    onChange={e => setTriggerType(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px", backgroundColor: "#fff" }}>
                    <option value="MIN_CART_VALUE">Minimum Cart Value</option>
                    <option value="MIN_QUANTITY">Minimum Item Quantity</option>
                    <option value="SPECIFIC_PRODUCTS">Specific Products</option>
                    <option value="NO_TRIGGER">Always Active</option>
                  </select>
                </div>
                {triggerType !== 'NO_TRIGGER' && triggerType !== 'SPECIFIC_PRODUCTS' && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Trigger Value</label>
                    <input name="triggerValue" defaultValue={promo.trigger?.value} required type="number" style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px" }} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Reward */}
          <section style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>Reward (What do they get?)</h2>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Reward Type</label>
                  <select 
                    name="rewardType"
                    value={rewardType}
                    onChange={e => setRewardType(e.target.value)}
                    style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px", backgroundColor: "#fff" }}>
                    <option value="PERCENTAGE_DISCOUNT">Percentage Discount</option>
                    <option value="FLAT_DISCOUNT">Flat Amount Discount</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                    <option value="CHEAPEST_ITEM_FREE">Cheapest Item Free (BOGO)</option>
                    <option value="CHEAPEST_ITEM_PERCENTAGE">Cheapest Item % Off</option>
                  </select>
                </div>
                {(rewardType === 'PERCENTAGE_DISCOUNT' || rewardType === 'FLAT_DISCOUNT' || rewardType === 'CHEAPEST_ITEM_PERCENTAGE') && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Discount Value</label>
                    <input name="rewardValue" defaultValue={promo.reward?.value} required type="number" style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px" }} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Eligibility */}
          <section style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>Eligibility</h2>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#1a1a18" }}>
                <input name="firstOrderOnly" type="checkbox" defaultChecked={promo.eligibility?.firstOrderOnly} /> Valid for first-time orders only
              </label>
            </div>
          </section>

          {/* Validity */}
          <section style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>Validity</h2>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>Start Date</label>
                <input name="validFrom" defaultValue={promo.validFrom ? promo.validFrom.split('T')[0] : ''} type="date" style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b6865", marginBottom: "0.5rem" }}>End Date (Optional)</label>
                <input name="validUntil" defaultValue={promo.validUntil ? promo.validUntil.split('T')[0] : ''} type="date" style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.85rem", borderRadius: "2px" }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
