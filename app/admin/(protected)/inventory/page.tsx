export default function InventoryPage() {
  return (
    <div>
      <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
        Inventory
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#7a7874", marginBottom: "3rem" }}>
        Track stock levels and warehouses.
      </p>
      
      <div style={{
        background: "#ffffff",
        border: "1px solid #e8e4df",
        padding: "3rem",
        textAlign: "center",
        borderRadius: "2px",
      }}>
        <p style={{ color: "#9a9690", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module coming soon
        </p>
      </div>
    </div>
  );
}
