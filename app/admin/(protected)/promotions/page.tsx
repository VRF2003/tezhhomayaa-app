import React from "react";
import Link from "next/link";
import { PromotionService } from "@/lib/promotions/services/PromotionService";
import { changePromotionStatusAction, deletePromotionAction, duplicatePromotionAction, seedDummyPromotionsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PromotionsListAdminPage() {
  const service = new PromotionService();
  let promotions = await service.getAllPromotions();

  // Temporary helper to seed database if empty during development
  if (promotions.length === 0) {
    await seedDummyPromotionsAction();
    promotions = await service.getAllPromotions();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", textTransform: "uppercase", background: "#f0fdf4", color: "#166534", borderRadius: "1rem", border: "1px solid #bbf7d0" }}>Active</span>;
      case "SCHEDULED": return <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", textTransform: "uppercase", background: "#eff6ff", color: "#1e40af", borderRadius: "1rem", border: "1px solid #bfdbfe" }}>Scheduled</span>;
      case "PAUSED": return <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", textTransform: "uppercase", background: "#fefce8", color: "#854d0e", borderRadius: "1rem", border: "1px solid #fef08a" }}>Paused</span>;
      case "EXPIRED": return <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", textTransform: "uppercase", background: "#fef2f2", color: "#991b1b", borderRadius: "1rem", border: "1px solid #fecaca" }}>Expired</span>;
      default: return <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", textTransform: "uppercase", background: "#f7f5f2", color: "#1a1a18", borderRadius: "1rem" }}>{status}</span>;
    }
  };

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
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <Link href="/admin/promotions/new" style={{ textDecoration: "none" }}>
          <button style={{ 
            background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", 
            fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px"
          }}>
            Create Promotion
          </button>
        </Link>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8", display: "flex", gap: "1rem" }}>
          <input 
            type="text" 
            placeholder="Search promotions, codes, campaigns..." 
            style={{ 
              width: "100%", maxWidth: "400px", padding: "0.8rem 1rem", border: "1px solid #e8e4df", 
              fontSize: "0.85rem", fontFamily: "inherit" 
            }}
          />
          <button style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "0.8rem 1rem", fontSize: "0.75rem", cursor: "pointer", color: "#6b6865" }}>
            Filter
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Promotion</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Code</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Reward / Trigger</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Assignment</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id} style={{ borderBottom: "1px solid #e8e4df" }} className="hover:bg-[#fafaf8] transition-colors group">
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  <Link href={`/admin/promotions/${promo.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ fontSize: "0.95rem", color: "#1a1a18", fontWeight: 500, marginBottom: "0.2rem", cursor: "pointer", textDecoration: "none" }}>
                      {promo.name}
                    </div>
                  </Link>
                  <div style={{ fontSize: "0.75rem", color: "#6b6865" }}>
                    {promo.validFrom ? new Date(promo.validFrom).toLocaleDateString() : "Immediate"} - {promo.validUntil ? new Date(promo.validUntil).toLocaleDateString() : "No Expiry"}
                  </div>
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  {promo.code ? (
                    <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-dm-mono, monospace)", color: "#1a1a18", background: "#f5f2ec", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                      {promo.code}
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "#9a9690", fontStyle: "italic" }}>Automatic</span>
                  )}
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  <div style={{ fontSize: "0.9rem", color: "#1a1a18", fontWeight: 500 }}>{formatReward(promo.reward)}</div>
                  <div style={{ fontSize: "0.7rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.15rem" }}>
                    {promo.trigger?.type ? promo.trigger.type.replace(/_/g, ' ') : promo.type}
                  </div>
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  {getStatusBadge(promo.status)}
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  {promo.assignment ? (
                    <div>
                      <div style={{ fontSize: "0.85rem", color: "#1a1a18" }}>{promo.assignment.participantName}</div>
                      <div style={{ fontSize: "0.65rem", color: "#9a9690", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.15rem" }}>{promo.assignment.assignmentType}</div>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "#9a9690" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", opacity: 0 }} className="group-hover:opacity-100 transition-opacity">
                    <form action={duplicatePromotionAction}>
                      <input type="hidden" name="id" value={promo.id} />
                      <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#6b6865" }}>Duplicate</button>
                    </form>
                    {promo.status === 'ACTIVE' ? (
                      <form action={changePromotionStatusAction}>
                        <input type="hidden" name="id" value={promo.id} />
                        <input type="hidden" name="status" value="PAUSED" />
                        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#d97706" }}>Pause</button>
                      </form>
                    ) : (
                      <form action={changePromotionStatusAction}>
                        <input type="hidden" name="id" value={promo.id} />
                        <input type="hidden" name="status" value="ACTIVE" />
                        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#166534" }}>Activate</button>
                      </form>
                    )}
                    <form action={deletePromotionAction}>
                      <input type="hidden" name="id" value={promo.id} />
                      <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#dc2626" }}>Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
