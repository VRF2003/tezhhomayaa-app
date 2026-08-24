"use server";

import { cookies, headers } from "next/headers";
import { ConfigService } from "../infrastructure/deployment/configuration/ConfigService";
import { authenticationService } from "./server";
import { AuthenticationError } from "./errors/IamErrors";
import { Observability } from "@/lib/infrastructure/observability";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = headersList.get("user-agent") || "Unknown Browser";

  try {
    const { accessToken, refreshToken } = await authenticationService.login(
      email,
      password,
      ip,
      "Unknown Device", // Could be parsed from UA
      userAgent
    );

    const cookieStore = await cookies();
    
    cookieStore.set({
      name: "tz_access_token",
      value: accessToken.token,
      httpOnly: true,
      secure: ConfigService.get("NODE_ENV") === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    cookieStore.set({
      name: "tz_refresh_token",
      value: refreshToken.token,
      httpOnly: true,
      secure: ConfigService.get("NODE_ENV") === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/api/auth", // only send on refresh endpoints
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof AuthenticationError || error.name === "AuthenticationError") {
      return { success: false, error: error.message };
    }
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Login failed unexpectedly:", error);
    // Return actual error message temporarily to help debug if it continues failing
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("tz_access_token");
  cookieStore.delete("tz_refresh_token");
  // Optional: hit the authenticationService.logout to revoke session if we extract sessionId from token
}
