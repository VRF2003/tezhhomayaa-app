import React from "react";
import { CampaignService } from "@/lib/lep/services/CampaignService";
import { InMemoryCampaignRepository } from "@/lib/lep/repositories/InMemoryCampaignRepository";
import { InMemoryContentItemRepository } from "@/lib/lep/repositories/InMemoryContentItemRepository";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Campaign } from "@/lib/lep/campaigns/types";
import { CampaignSectionsEditor } from "@/components/admin/campaigns/CampaignSectionsEditor";
import { MarketTargetingPanel } from "@/components/admin/campaigns/MarketTargetingPanel";
import { saveCampaignAction, deleteCampaignAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CampaignEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const repo = new InMemoryCampaignRepository();
  const campaign = await repo.findById(id);

  if (!campaign) {
    return notFound();
  }

  return (
    <form action={saveCampaignAction}>
      <input type="hidden" name="id" value={campaign.id} />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/campaigns" style={{ color: "#9a9690", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Back to Campaigns
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Edit Campaign
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            {campaign.name} ({campaign.slug})
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" formAction={deleteCampaignAction} style={{ 
            background: "transparent", color: "#dc2626", padding: "0.8rem 1.5rem", border: "1px solid #fca5a5", 
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
          }}>
            Delete
          </button>
          <button style={{ 
            background: "transparent", color: "#1a1a18", padding: "0.8rem 1.5rem", border: "1px solid #1a1a18", 
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
          }}>
            Cancel
          </button>
          <button type="submit" style={{ 
            background: "#1a1a18", color: "#ffffff", padding: "0.8rem 1.5rem", border: "none", 
            fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" 
          }}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem" }}>
        {/* Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>General Information</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Campaign Name</label>
                <input type="text" name="name" defaultValue={campaign.name} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit" }} />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Campaign Slug</label>
                <input type="text" defaultValue={campaign.slug} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit", background: "#f9f9f9" }} readOnly />
                <p style={{ fontSize: "0.75rem", color: "#9a9690", marginTop: "0.4rem" }}>The unique identifier used internally.</p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Description</label>
                <textarea name="description" defaultValue={campaign.description} rows={3} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit" }} />
              </div>
            </div>
          </div>

          <CampaignSectionsEditor campaignId={campaign.id} initialSections={campaign.sections} />

        </div>

        {/* Sidebar Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Market Targeting</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <MarketTargetingPanel initialMarketId={campaign.marketId} initialRegionId={campaign.regionId} />

              <div style={{ padding: "0.75rem 1rem", background: "#f7f5f2", border: "1px solid #e8e4df", fontSize: "0.8rem", color: "#6b6865", lineHeight: 1.6 }}>
                <strong style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a9690" }}>Banner Hierarchy</strong>
                🎯 Country → always wins for that country<br/>
                📍 Region → wins for all countries in that region (unless a country banner exists)<br/>
                🌍 Global → fallback shown everywhere else
              </div>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Scheduling</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Valid From</label>
                <input type="datetime-local" name="validFrom" defaultValue={campaign.validFrom ? new Date(campaign.validFrom).toISOString().slice(0, 16) : ""} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit" }} />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>Valid Until</label>
                <input type="datetime-local" name="validUntil" defaultValue={campaign.validUntil ? new Date(campaign.validUntil).toISOString().slice(0, 16) : ""} style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit" }} />
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem", background: "#f7f5f2", border: "1px solid #e8e4df" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690" }}>Status</span>
              <select name="status" defaultValue={campaign.status} style={{ padding: "0.4rem 0.8rem", border: "1px solid #e8e4df", fontSize: "0.75rem", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
                <option value="PAUSED">Paused</option>
                <option value="EXPIRED">Expired</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690" }}>Created</span>
              <span style={{ fontSize: "0.85rem", color: "#6b6865" }}>{new Date(campaign.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690" }}>Last Updated</span>
              <span style={{ fontSize: "0.85rem", color: "#6b6865" }}>{new Date(campaign.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
