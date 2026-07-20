import { Session } from "../core/types";

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  findAll(): Promise<Session[]>;
  create(session: Session): Promise<void>;
  update(session: Session): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
