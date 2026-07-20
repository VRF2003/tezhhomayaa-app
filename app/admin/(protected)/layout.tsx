import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { iamUserRepo, iamRoleRepo, iamSessionRepo } from "@/lib/iam/server";
import { IdentityProvider } from "@/lib/iam";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const userId = headersList.get("x-iam-user-id");
  const roleId = headersList.get("x-iam-role-id");
  const sessionId = headersList.get("x-iam-session-id");

  if (!userId || !roleId || !sessionId) {
    redirect("/admin");
  }

  // Fetch identity from repositories using the injected middleware headers
  const fullUser = await iamUserRepo.findById(userId);
  const role = await iamRoleRepo.findById(roleId);
  const session = await iamSessionRepo.findById(sessionId);

  if (!fullUser || !role || !session) {
    redirect("/admin");
  }

  const { passwordHash, ...safeUser } = fullUser;

  const initialState = {
    identity: {
      user: safeUser,
      role: role,
    },
    session: session,
    permissions: role.permissions,
    isAuthenticated: true,
  };

  return (
    <IdentityProvider initialState={initialState}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </IdentityProvider>
  );
}
