import { getSessions, forceLogoutSession } from "@/lib/iam/admin-actions";

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>Active Sessions</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8e4df" }}>
            <th style={{ padding: "1rem", fontWeight: 500 }}>User ID</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>IP</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Device</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Status</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session: any) => {
            const isActive = !session.revokedAt && new Date(session.expiresAt) > new Date();
            
            return (
              <tr key={session.id} style={{ borderBottom: "1px solid #e8e4df" }}>
                <td style={{ padding: "1rem" }}>{session.userId}</td>
                <td style={{ padding: "1rem" }}>{session.ip}</td>
                <td style={{ padding: "1rem" }}>{session.device} | {session.browser}</td>
                <td style={{ padding: "1rem" }}>
                  {isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Revoked/Expired</span>
                  )}
                </td>
                <td style={{ padding: "1rem" }}>
                  {isActive && (
                    <form action={async () => {
                      "use server";
                      await forceLogoutSession(session.id);
                    }}>
                      <button type="submit" style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Force Logout</button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
