"use client";

import { useState } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

export default function CurrencySettingsPage() {
  const [baseCurrency, setBaseCurrency] = useState("INR");
  const [supported, setSupported] = useState<string[]>(SUPPORTED_CURRENCIES.map(c => c.code));
  const [rules, setRules] = useState([
    { country: "India", code: "INR" },
    { country: "United States", code: "USD" },
    { country: "Europe", code: "EUR" },
  ]);

  return (
    <div>
      <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
        Currency Settings
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#7a7874", marginBottom: "3rem" }}>
        Configure the base currency and supported exchange rates for dynamic geolocation conversion.
      </p>
      
      <div style={{
        background: "#ffffff",
        border: "1px solid #e8e4df",
        padding: "2.5rem",
        borderRadius: "2px",
      }}>
        
        <h2 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: "1.5rem" }}>Base Currency</h2>
        <p style={{ fontSize: "0.85rem", color: "#7a7874", marginBottom: "1rem" }}>
          All product prices in the database are stored in the base currency. Exchange rates will be calculated relative to this currency.
        </p>
        <select 
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          style={{ padding: "0.75rem", width: "100%", maxWidth: "300px", border: "1px solid #ddd9d4", background: "#faf9f7" }}
        >
          {SUPPORTED_CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
          ))}
        </select>

        <div style={{ margin: "3rem 0", height: "1px", background: "#e8e4df" }} />

        <h2 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: "1.5rem" }}>Supported Currencies</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
          {SUPPORTED_CURRENCIES.map(c => (
            <label key={c.code} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
              <input 
                type="checkbox" 
                checked={supported.includes(c.code)}
                onChange={(e) => {
                  if (e.target.checked) setSupported([...supported, c.code]);
                  else setSupported(supported.filter(s => s !== c.code));
                }}
              />
              {c.code}
            </label>
          ))}
        </div>

        <div style={{ margin: "3rem 0", height: "1px", background: "#e8e4df" }} />

        <h2 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: "1.5rem" }}>Default Country Rules</h2>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "1rem 0", borderBottom: "1px solid #e8e4df", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9a9690", fontWeight: 400 }}>Country / Region</th>
              <th style={{ padding: "1rem 0", borderBottom: "1px solid #e8e4df", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9a9690", fontWeight: 400 }}>Currency Code</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, i) => (
              <tr key={i}>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #e8e4df", fontSize: "0.95rem" }}>{rule.country}</td>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #e8e4df", fontSize: "0.95rem" }}>{rule.code}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "flex-end" }}>
          <button style={{
            padding: "0.75rem 2rem",
            background: "#1a1a18",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-dm-mono, monospace)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "0.75rem"
          }}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
