export default function ContentOverviewPage() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 2rem", letterSpacing: "0.02em" }}>
        Content Management
      </h1>
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "4rem", borderRadius: "2px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#6b6865", letterSpacing: "0.04em", margin: 0, fontStyle: "italic" }}>
          Select a content area from the sidebar to begin editing.
        </p>
      </div>
    </div>
  );
}
