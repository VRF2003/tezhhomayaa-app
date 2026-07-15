"use client";

import AccountLayout from "@/components/account/AccountLayout";

export default function AddressesPage() {
  const addresses = [
    {
      id: "addr_1",
      type: "Home",
      isDefault: true,
      name: "Sarang Sharma",
      street: "123 Quiet Luxury Lane",
      city: "New York",
      state: "NY",
      zip: "10012",
      country: "United States"
    },
    {
      id: "addr_2",
      type: "Office",
      isDefault: false,
      name: "Sarang Sharma",
      street: "456 Minimalist Ave, Suite 200",
      city: "New York",
      state: "NY",
      zip: "10014",
      country: "United States"
    }
  ];

  const AddNewAddressAction = (
    <button style={{
      fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
      letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18",
      background: "transparent", border: "1px solid #1a1a18", padding: "0.8rem 1.5rem",
      cursor: "pointer", transition: "background 0.3s ease, color 0.3s ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#f7f5f2"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
    >
      Add New Address
    </button>
  );

  return (
    <AccountLayout title="Addresses" headerAction={AddNewAddressAction}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
        
        {addresses.map(addr => (
          <div key={addr.id} style={{
            border: "1px solid #e8e6e1",
            padding: "2rem",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
              <h3 style={{
                fontFamily: "var(--font-cormorant, serif)", fontSize: "1.3rem",
                color: "#1a1a18", margin: 0, fontWeight: 400
              }}>
                {addr.type}
              </h3>
              {addr.isDefault && (
                <span style={{
                  fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.5rem",
                  letterSpacing: "0.15em", color: "#9a9690", textTransform: "uppercase"
                }}>
                  Default
                </span>
              )}
            </div>
            
            <address style={{
              fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem",
              color: "#4a4845", fontStyle: "normal", lineHeight: 1.6, flex: 1,
              marginBottom: "2rem"
            }}>
              {addr.name}<br />
              {addr.street}<br />
              {addr.city}, {addr.state} {addr.zip}<br />
              {addr.country}
            </address>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
                letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18",
                background: "transparent", border: "none", borderBottom: "1px solid #1a1a18",
                padding: "0 0 0.2rem 0", cursor: "pointer", transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                Edit
              </button>
              <button style={{
                fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.55rem",
                letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a18",
                background: "transparent", border: "none", borderBottom: "1px solid #1a1a18",
                padding: "0 0 0.2rem 0", cursor: "pointer", transition: "opacity 0.3s ease",
                opacity: 0.5
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.5"}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AccountLayout>
  );
}
