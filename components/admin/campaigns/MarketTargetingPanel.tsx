"use client";

import React, { useState } from "react";
import { MARKETS } from "@/lib/market/MarketService";

interface Props {
  initialMarketId: string;
  initialRegionId?: string | null;
}

const REGIONS = ["Middle East", "Europe", "Asia Pacific", "North America", "South America", "Africa"];

export function MarketTargetingPanel({ initialMarketId, initialRegionId }: Props) {
  const [marketId, setMarketId] = useState(initialMarketId || "GLOBAL");
  const [regionId, setRegionId] = useState(initialRegionId || "");

  const selectedMarket = MARKETS.find(m => m.id === marketId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>
          Market Targeting
        </label>

        {/* Hidden input so form always submits current value */}
        <input type="hidden" name="marketId" value={marketId} />
        <input type="hidden" name="regionId" value={regionId} />

        <select
          value={marketId}
          onChange={e => { setMarketId(e.target.value); setRegionId(""); }}
          style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit", appearance: "none" }}
        >
          <optgroup label="— Scope —">
            <option value="GLOBAL">🌍 Global Fallback (all markets)</option>
            <option value="REGION">📍 Region Specific</option>
          </optgroup>
          <optgroup label="— Middle East —">
            {MARKETS.filter(m => m.region === "Middle East").map(m => (
              <option key={m.id} value={m.id}>{m.country} ({m.currencyCode})</option>
            ))}
          </optgroup>
          <optgroup label="— Europe —">
            {MARKETS.filter(m => m.region === "Europe").map(m => (
              <option key={m.id} value={m.id}>{m.country} ({m.currencyCode})</option>
            ))}
          </optgroup>
          <optgroup label="— Asia Pacific —">
            {MARKETS.filter(m => m.region === "Asia Pacific").map(m => (
              <option key={m.id} value={m.id}>{m.country} ({m.currencyCode})</option>
            ))}
          </optgroup>
          <optgroup label="— North America —">
            {MARKETS.filter(m => m.region === "North America").map(m => (
              <option key={m.id} value={m.id}>{m.country} ({m.currencyCode})</option>
            ))}
          </optgroup>
          <optgroup label="— Other —">
            {MARKETS.filter(m => !["Middle East","Europe","Asia Pacific","North America"].includes(m.region)).map(m => (
              <option key={m.id} value={m.id}>{m.country} ({m.currencyCode})</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Region picker if REGION scope selected */}
      {marketId === "REGION" && (
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9690", marginBottom: "0.5rem" }}>
            Select Region
          </label>
          <select
            value={regionId}
            onChange={e => setRegionId(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #e8e4df", fontSize: "0.9rem", fontFamily: "inherit", appearance: "none" }}
          >
            <option value="">— Choose a region —</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      )}

      {/* Visual confirmation badge */}
      <div style={{
        padding: "0.75rem 1rem",
        background: marketId === "GLOBAL" ? "#f0fdf4" : marketId === "REGION" ? "#eff6ff" : "#fef9ec",
        border: `1px solid ${marketId === "GLOBAL" ? "#bbf7d0" : marketId === "REGION" ? "#bfdbfe" : "#fde68a"}`,
        fontSize: "0.8rem",
        color: "#374151"
      }}>
        {marketId === "GLOBAL" && "✅ This campaign will show globally to all markets."}
        {marketId === "REGION" && (regionId
          ? `📍 This campaign will show only to the ${regionId} region.`
          : "⚠️ Please select a region above."
        )}
        {marketId !== "GLOBAL" && marketId !== "REGION" && selectedMarket && (
          `🎯 This campaign will show only in ${selectedMarket.country} (${selectedMarket.currencyCode}).`
        )}
      </div>
    </div>
  );
}
