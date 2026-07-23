import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PromotionService } from "@/lib/promotions/services/PromotionService";
import { changePromotionStatusAction, deletePromotionAndRedirectAction } from "../actions";

export default async function PromotionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new PromotionService();
  const promo = await service.getPromotion(id);

  if (!promo) {
    notFound();
  }

  const formatReward = (reward: any) => {
    if (!reward) return "Legacy Format";
    switch (reward.type) {
      case "PERCENTAGE_DISCOUNT": return `${reward.value}% Off`;
      case "FLAT_DISCOUNT": return `₹${reward.value} Off`;
      case "FREE_SHIPPING": return `Free Shipping`;
      case "CHEAPEST_ITEM_FREE": return `Cheapest Free`;
      case "CHEAPEST_ITEM_PERCENTAGE": return `Cheapest ${reward.value}% Off`;
      case "SPECIFIC_ITEM_FREE": return `Specific Free`;
      default: return reward.type;
    }
  };

  return (
    <div style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/promotions" style={{ textDecoration: "none", fontSize: "0.75rem", color: "#9a9690", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", display: "inline-block" }}>
          ← Back to Promotions
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 400, color: "#1a1a18", margin: 0 }}>
                {promo.name}
              </h1>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", textTransform: "uppercase", background: promo.status === 'ACTIVE' ? "#f0fdf4" : "#fefce8", color: promo.status === 'ACTIVE' ? "#166534" : "#854d0e", borderRadius: "1rem", border: promo.status === 'ACTIVE' ? "1px solid #bbf7d0" : "1px solid #fef08a" }}>
                {promo.status}
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#6b6865", margin: 0, fontFamily: "var(--font-dm-mono, monospace)" }}>
              {promo.code || "Automatic Promotion"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <form action={deletePromotionAndRedirectAction}>
              <input type="hidden" name="id" value={promo.id} />
              <button type="submit" style={{ background: "#ffffff", color: "#dc2626", padding: "0.8rem 1.5rem", border: "1px solid #fca5a5", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                Delete
              </button>
            </form>
            
            {promo.status === 'ACTIVE' ? (
              <form action={changePromotionStatusAction}>
                <input type="hidden" name="id" value={promo.id} />
                <input type="hidden" name="status" value="PAUSED" />
                <button type="submit" style={{ background: "#ffffff", color: "#d97706", padding: "0.8rem 1.5rem", border: "1px solid #fcd34d", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                  Pause Promotion
                </button>
              </form>
            ) : (
              <form action={changePromotionStatusAction}>
                <input type="hidden" name="id" value={promo.id} />
                <input type="hidden" name="status" value="ACTIVE" />
                <button type="submit" style={{ background: "#ffffff", color: "#166534", padding: "0.8rem 1.5rem", border: "1px solid #bbf7d0", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                  Activate Promotion
                </button>
              </form>
            )}
            
            <Link href={`/admin/promotions/${promo.id}/edit`} style={{ textDecoration: "none" }}>
              <button style={{ background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                Edit Details
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a18", margin: 0, fontWeight: 500 }}>Configuration</h2>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>Reward</div>
                <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>{formatReward(promo.reward)}</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "#e8e4df" }} />
              <div>
                <div style={{ fontSize: "0.65rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>Trigger</div>
                <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>{promo.trigger?.type ? promo.trigger.type.replace(/_/g, ' ') : promo.type} {(promo.trigger?.value ?? 0) > 0 ? `(${promo.trigger?.value})` : ""}</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "#e8e4df" }} />
              <div>
                <div style={{ fontSize: "0.65rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>Eligibility</div>
                <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>{promo.eligibility?.firstOrderOnly ? "First Order Only" : "All Users"}</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "#e8e4df" }} />
              <div>
                <div style={{ fontSize: "0.65rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>Valid From - To</div>
                <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>
                  {promo.validFrom ? new Date(promo.validFrom).toLocaleDateString() : "Immediate"} - {promo.validUntil ? new Date(promo.validUntil).toLocaleDateString() : "No Expiry"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
