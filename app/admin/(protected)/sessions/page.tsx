import { getSessions, forceLogoutSession } from "@/lib/iam/admin-actions";
import { EmptyState } from "@/lib/ui/enterprise/components/EmptyState";

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>User ID</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>IP</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Device</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "0" }}>
                  <EmptyState 
                    title="No Active Sessions Found" 
                    description="There are no active user sessions."
                  />
                </td>
              </tr>
            ) : (
              sessions.map((session: any) => {
                const isActive = !session.revokedAt && new Date(session.expiresAt) > new Date();
                
                return (
                  <tr key={session.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s" }} className="hover-row">
                    <td style={{ padding: "1.2rem 1.5rem", color: "#1a1a18", fontWeight: 500, fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.75rem" }}>{session.userId}</td>
                    <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865", fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.75rem" }}>{session.ip}</td>
                    <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>{session.device} | {session.browser}</td>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "1rem",
                        fontSize: "0.65rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        background: isActive ? "#e8f0e8" : "#fdf0f0",
                        color: isActive ? "#137333" : "#c5221f",
                      }}>
                        {isActive ? "Active" : "Revoked/Expired"}
                      </span>
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                      {isActive && (
                        <form action={async () => {
                          "use server";
                          await forceLogoutSession(session.id);
                        }}>
                          <button type="submit" className="delete-btn" style={{ 
                            background: "none", border: "none", color: "#9a9690", 
                            fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", 
                            cursor: "pointer", padding: 0, transition: "color 0.2s" 
                          }}>
                            Force Logout
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-row:hover { background: #fafaf8 !important; }
        .delete-btn:hover { color: #c5221f !important; }
      `}} />
    </div>
  );
}
