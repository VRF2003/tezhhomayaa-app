import { getUsers, deleteUser } from "@/lib/iam/admin-actions";
import { EmptyState } from "@/lib/ui/enterprise/components/EmptyState";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Name</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Email</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Role ID</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "0" }}>
                  <EmptyState 
                    title="No Users Found" 
                    description="There are no users registered in the system."
                  />
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s" }} className="hover-row">
                  <td style={{ padding: "1.2rem 1.5rem", color: "#1a1a18", fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>{user.email}</td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>
                    <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.75rem", background: "#f0ede8", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                      {user.roleId}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "1rem",
                      fontSize: "0.65rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: user.isLocked ? "#fdf0f0" : user.isActive ? "#e8f0e8" : "#f1f3f4",
                      color: user.isLocked ? "#c5221f" : user.isActive ? "#137333" : "#3c4043",
                    }}>
                      {user.isLocked ? "Locked" : user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                    <form action={async () => {
                      "use server";
                      await deleteUser(user.id);
                    }}>
                      <button type="submit" className="delete-btn" style={{ 
                        background: "none", border: "none", color: "#9a9690", 
                        fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", 
                        cursor: "pointer", padding: 0, transition: "color 0.2s" 
                      }}>
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
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
