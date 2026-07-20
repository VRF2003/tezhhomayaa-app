import { Session } from "../../core/types";
import { ISessionRepository } from "../ISessionRepository";

export class InMemorySessionRepository implements ISessionRepository {
  private sessions: Map<string, Session> = new Map();

  constructor(initialData: Session[] = []) {
    initialData.forEach(s => this.sessions.set(s.id, s));
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId);
  }

  async findAll(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async create(session: Session): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async update(session: Session): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const now = new Date().toISOString();
    for (const session of this.sessions.values()) {
      if (session.userId === userId && !session.revokedAt) {
        session.revokedAt = now;
      }
    }
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}
