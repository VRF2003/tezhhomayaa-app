import { jwtVerify, SignJWT } from "jose";
import { AccessToken, RefreshToken } from "../core/types";
import { ConfigurationError, TokenError } from "../errors/IamErrors";

import { ConfigService } from "../../infrastructure/deployment/configuration/ConfigService";

export class TokenService {
  private static getSecretKey(): Uint8Array {
    const secret = ConfigService.get<string>("JWT_SECRET");
    if (!secret) {
      // Per Chapter 3.1 requirements, fail at startup (or when accessed) if secret is missing.
      throw new ConfigurationError("JWT_SECRET environment variable is missing. Application cannot start securely.");
    }
    return new TextEncoder().encode(secret);
  }

  static async generateAccessToken(userId: string, roleId: string, sessionId: string): Promise<AccessToken> {
    const secret = this.getSecretKey();
    const expiresIn = 60 * 60; // 1 hour
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const token = await new SignJWT({ userId, roleId, sessionId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(secret);

    return { token, expiresAt };
  }

  static async generateRefreshToken(userId: string, sessionId: string): Promise<RefreshToken> {
    const secret = this.getSecretKey();
    const expiresIn = 60 * 60 * 24 * 7; // 7 days
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const token = await new SignJWT({ userId, sessionId, type: "refresh" })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(secret);

    return { token, expiresAt };
  }

  static async verifyAccessToken(token: string): Promise<{ userId: string; roleId: string; sessionId: string }> {
    try {
      const secret = this.getSecretKey();
      const { payload } = await jwtVerify(token, secret);
      
      if (!payload.userId || !payload.roleId || !payload.sessionId) {
        throw new TokenError("Invalid access token payload structure");
      }

      return {
        userId: payload.userId as string,
        roleId: payload.roleId as string,
        sessionId: payload.sessionId as string,
      };
    } catch (e: any) {
      throw new TokenError(`Access token verification failed: ${e.message}`);
    }
  }

  static async verifyRefreshToken(token: string): Promise<{ userId: string; sessionId: string }> {
    try {
      const secret = this.getSecretKey();
      const { payload } = await jwtVerify(token, secret);
      
      if (!payload.userId || !payload.sessionId || payload.type !== "refresh") {
        throw new TokenError("Invalid refresh token payload structure");
      }

      return {
        userId: payload.userId as string,
        sessionId: payload.sessionId as string,
      };
    } catch (e: any) {
      throw new TokenError(`Refresh token verification failed: ${e.message}`);
    }
  }
}
