import React from "react";
import { CampaignService } from "@/lib/lep/services/CampaignService";
import { FirestoreCampaignRepository } from "@/lib/lep/repositories/FirestoreCampaignRepository";
import { FirestoreContentItemRepository } from "@/lib/lep/repositories/FirestoreContentItemRepository";
import { MARKETS } from "@/lib/market/MarketService";
import Link from "next/link";
import { createCampaignAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CampaignListAdminPage() {
  const campaignService = new CampaignService(
    new FirestoreCampaignRepository(),
    new FirestoreContentItemRepository()
  );

  // In a real app we would use campaignService.getAll() which we should add, 
  // but for now let's just fetch them via repo for the admin dashboard listing
  const repo = new FirestoreCampaignRepository();
  const rawCampaigns = await repo.findAll();

  // Evaluate health for all to display badges
  const campaigns = await Promise.all(
    rawCampaigns.map(async (c) => {
      const health = await campaignService.validateHealth(c);
      return { ...c, health };
    })
  );

  // Sort newest first
  campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-800 border-green-200";
      case "SCHEDULED": return "bg-blue-100 text-blue-800 border-blue-200";
      case "DRAFT": return "bg-gray-100 text-gray-800 border-gray-200";
      case "PAUSED": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EXPIRED": return "bg-red-100 text-red-800 border-red-200";
      case "ARCHIVED": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthIcon = (healthStatus: string) => {
    switch (healthStatus) {
      case "HEALTHY": return <span style={{ color: "#22c55e" }}>●</span>;
      case "WARNING": return <span style={{ color: "#eab308" }}>▲</span>;
      case "INVALID": return <span style={{ color: "#ef4444" }}>✖</span>;
      default: return null;
    }
  };

  return (
    <div style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <form action={createCampaignAction}>
          <button type="submit" style={{ 
            background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", 
            fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px"
          }}>
            Create Campaign
          </button>
        </form>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e8e4df" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e8e4df", background: "#fafaf8" }}>
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            style={{ 
              width: "100%", maxWidth: "400px", padding: "0.8rem 1rem", border: "1px solid #e8e4df", 
              fontSize: "0.85rem", fontFamily: "inherit" 
            }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Campaign</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Market Targeting</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9690", fontWeight: 500 }}>Scheduling</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(camp => (
              <tr key={camp.id} style={{ borderBottom: "1px solid #e8e4df" }} className="hover:bg-[#fafaf8] transition-colors">
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <div title={camp.health.messages.join("\n")} style={{ cursor: "help" }}>
                      {getHealthIcon(camp.health.status)}
                    </div>
                    <div>
                      <Link href={`/admin/campaigns/${camp.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ fontSize: "0.95rem", color: "#1a1a18", fontWeight: 400, marginBottom: "0.2rem", cursor: "pointer", textDecoration: "none" }}>
                          {camp.name}
                        </div>
                      </Link>
                      <div style={{ fontSize: "0.7rem", color: "#9a9690", fontFamily: "var(--font-dm-mono, monospace)" }}>{camp.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  <span style={{ 
                    fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", 
                    textTransform: "uppercase", background: "#f7f5f2", color: "#1a1a18", borderRadius: "1rem" 
                  }}>
                    {camp.status}
                  </span>
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  <div style={{ fontSize: "0.85rem", color: "#6b6865" }}>
                    {camp.marketId === "GLOBAL" ? (
                      <span>🌍 Global</span>
                    ) : camp.marketId === "REGION" ? (
                      <span>📍 Region: {camp.regionId || "—"}</span>
                    ) : (
                      <span>🎯 {MARKETS.find(m => m.id === camp.marketId)?.country || camp.marketId}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1.2rem 1.5rem" }}>
                  <div style={{ fontSize: "0.85rem", color: "#6b6865" }}>
                    {camp.validFrom ? (
                      <>
                        {new Date(camp.validFrom).toLocaleDateString()}
                        {camp.validUntil ? ` - ${new Date(camp.validUntil).toLocaleDateString()}` : " onwards"}
                      </>
                    ) : (
                      "Immediate"
                    )}
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
