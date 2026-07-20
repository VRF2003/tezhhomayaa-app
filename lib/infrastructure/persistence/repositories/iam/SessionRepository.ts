import { ISessionRepository } from "@/lib/iam";
import { Session } from "@/lib/iam/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class SessionRepository implements ISessionRepository {
  private collection = "iam_sessions";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<Session | null> {
    return this.driver.read(this.collection, id);
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.driver.query(this.collection, { userId });
  }

  async findAll(): Promise<Session[]> {
    return this.driver.query(this.collection);
  }

  async create(session: Session): Promise<void> {
    await this.driver.write(this.collection, session.id, session);
  }

  async update(session: Session): Promise<void> {
    await this.driver.write(this.collection, session.id, session);
  }

  async delete(id: string): Promise<void> {
    await this.driver.delete(this.collection, id);
  }
}
