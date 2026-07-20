import { getRoles, deleteRole } from "@/lib/iam/admin-actions";
import { EmptyState } from "@/lib/ui/enterprise/components/EmptyState";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div style={{ paddingBottom: "4rem", animation: "fadeIn 0.5s ease" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e8e4df", borderRadius: "2px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e8e4df", background: "#f7f5f2" }}>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Name</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Description</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500 }}>Permissions</th>
              <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b6865", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "0" }}>
                  <EmptyState 
                    title="No Roles Found" 
                    description="There are no roles registered in the system."
                  />
                </td>
              </tr>
            ) : (
              roles.map((role: any) => (
                <tr key={role.id} style={{ borderBottom: "1px solid #e8e4df", transition: "background 0.2s" }} className="hover-row">
                  <td style={{ padding: "1.2rem 1.5rem", color: "#1a1a18", fontWeight: 500 }}>{role.name}</td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>{role.description}</td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b6865" }}>
                    <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.75rem", background: "#f0ede8", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                      {role.permissions.length} perms
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                    <form action={async () => {
                      "use server";
                      await deleteRole(role.id);
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
