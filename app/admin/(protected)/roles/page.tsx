import { getRoles, deleteRole } from "@/lib/iam/admin-actions";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>Roles</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8e4df" }}>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Name</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Description</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Permissions</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role: any) => (
            <tr key={role.id} style={{ borderBottom: "1px solid #e8e4df" }}>
              <td style={{ padding: "1rem" }}>{role.name}</td>
              <td style={{ padding: "1rem" }}>{role.description}</td>
              <td style={{ padding: "1rem" }}>{role.permissions.length} perms</td>
              <td style={{ padding: "1rem" }}>
                <form action={async () => {
                  "use server";
                  await deleteRole(role.id);
                }}>
                  <button type="submit" style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
