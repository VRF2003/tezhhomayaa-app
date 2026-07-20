import { getUsers, deleteUser } from "@/lib/iam/admin-actions";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>Users</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8e4df" }}>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Name</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Email</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Role ID</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Status</th>
            <th style={{ padding: "1rem", fontWeight: 500 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #e8e4df" }}>
              <td style={{ padding: "1rem" }}>{user.name}</td>
              <td style={{ padding: "1rem" }}>{user.email}</td>
              <td style={{ padding: "1rem" }}>{user.roleId}</td>
              <td style={{ padding: "1rem" }}>
                {user.isLocked ? "Locked" : user.isActive ? "Active" : "Inactive"}
              </td>
              <td style={{ padding: "1rem" }}>
                <form action={async () => {
                  "use server";
                  await deleteUser(user.id);
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
