import { randomUUID } from "crypto";
import { Session } from "../core/types";
import { ISessionRepository } from "../repositories/ISessionRepository";
import { SessionError } from "../errors/IamErrors";

export class SessionService {
  constructor(private sessionRepo: ISessionRepository) {}

  async createSession(userId: string, device: string, browser: string, ip: string, location?: string): Promise<Session> {
    const now = new Date().toISOString();
    // 7 days default session expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const session: Session = {
      id: randomUUID(),
      userId,
      device,
      browser,
      ip,
      location: location || "",
      lastActivityAt: now,
      createdAt: now,
      expiresAt,
      revokedAt: null,
    };

    await this.sessionRepo.create(session);
    return session;
  }

  async validateSession(sessionId: string): Promise<Session> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      throw new SessionError("Session not found");
    }

    if (session.revokedAt) {
      throw new SessionError("Session has been revoked");
    }

    if (new Date(session.expiresAt) < new Date()) {
      throw new SessionError("Session has expired");
    }

    // Update last activity asynchronously
    const now = new Date().toISOString();
    session.lastActivityAt = now;
    await this.sessionRepo.update(session);

    return session;
  }

  async revokeSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepo.findById(sessionId);
    if (session) {
      session.revokedAt = new Date().toISOString();
      await this.sessionRepo.update(session);
    }
  }

  async forceLogoutUser(userId: string): Promise<void> {
    await this.sessionRepo.revokeAllForUser(userId);
  }

  async getActiveSessionsForUser(userId: string): Promise<Session[]> {
    const sessions = await this.sessionRepo.findByUserId(userId);
    const now = new Date();
    return sessions.filter(s => !s.revokedAt && new Date(s.expiresAt) > now);
  }
}
