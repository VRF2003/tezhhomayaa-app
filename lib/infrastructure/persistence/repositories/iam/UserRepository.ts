import { IUserRepository } from "@/lib/iam/repositories/IUserRepository";
import { User } from "@/lib/iam/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";

export class UserRepository implements IUserRepository {
  private collection = "iam_users";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<User | null> {
    return this.driver.read(this.collection, id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.driver.query(this.collection, { email });
    return results.length > 0 ? (results[0] as User) : null;
  }

  async findAll(): Promise<User[]> {
    return this.driver.query(this.collection);
  }

  async create(user: User): Promise<void> {
    await this.driver.write(this.collection, user.id, user);
  }

  async update(user: User): Promise<void> {
    await this.driver.write(this.collection, user.id, user);
  }

  async delete(id: string): Promise<void> {
    await this.driver.delete(this.collection, id);
  }
}
