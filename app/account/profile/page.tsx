"use client";

import AccountLayout from "@/components/account/AccountLayout";

export default function ProfilePage() {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem 0",
    border: "none",
    borderBottom: "1px solid #ddd9d4",
    background: "transparent",
    fontFamily: "var(--font-cormorant, serif)",
    fontSize: "1.2rem",
    color: "#1a1a18",
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono, monospace)",
    fontSize: "0.55rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#9a9690",
    display: "block",
    marginBottom: "0.4rem",
  };

  return (
    <AccountLayout title="Profile">
      <div style={{ maxWidth: "600px" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First Name</label>
              <input type="text" defaultValue="Sarang" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last Name</label>
              <input type="text" defaultValue="Sharma" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" defaultValue="sarang@example.com" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" defaultValue="+1 (555) 000-0000" style={inputStyle} />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#1a1a18", margin: "0 0 1.5rem 0",
              textTransform: "uppercase"
            }}>
              Password
            </h3>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>New Password</label>
                <input type="password" placeholder="Leave blank to keep current" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h3 style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.15em", color: "#1a1a18", margin: "0 0 1.5rem 0",
              textTransform: "uppercase"
            }}>
              Communication Preferences
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                <input type="checkbox" id="pref_email" style={{ accentColor: "#1a1a18", marginTop: "0.3rem" }} defaultChecked />
                <div>
                  <label htmlFor="pref_email" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#1a1a18", lineHeight: 1 }}>
                    Email Newsletters
                  </label>
                  <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1rem", color: "#9a9690", margin: "0.2rem 0 0 0" }}>
                    Receive updates on new collections and editorial features.
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                <input type="checkbox" id="pref_sms" style={{ accentColor: "#1a1a18", marginTop: "0.3rem" }} />
                <div>
                  <label htmlFor="pref_sms" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.2rem", color: "#1a1a18", lineHeight: 1 }}>
                    SMS Alerts
                  </label>
                  <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1rem", color: "#9a9690", margin: "0.2rem 0 0 0" }}>
                    Get early access to private sales and bespoke events.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button type="button" style={{
            padding: "1rem 2.5rem",
            background: "#1a1a18", color: "#f7f5f2",
            fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.6rem",
            letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
            border: "1px solid #1a1a18", cursor: "pointer",
            transition: "background 0.4s ease, color 0.4s ease",
            marginTop: "2rem",
            alignSelf: "flex-start"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#f7f5f2"; }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
