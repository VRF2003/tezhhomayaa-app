import { getPermissions } from "@/lib/iam/admin-actions";

export default async function PermissionsPage() {
  const permissions = await getPermissions();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>Permissions Matrix</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8e4df" }}>
            <th style={{ padding: "1rem", fontWeight: 500 }}>ID</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Action</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Resource</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Scope</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm: any) => (
            <tr key={perm.id} style={{ borderBottom: "1px solid #e8e4df" }}>
              <td style={{ padding: "1rem", fontFamily: "monospace" }}>{perm.id}</td>
              <td style={{ padding: "1rem" }}>{perm.action}</td>
              <td style={{ padding: "1rem" }}>{perm.resource}</td>
              <td style={{ padding: "1rem" }}>{perm.scope}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
