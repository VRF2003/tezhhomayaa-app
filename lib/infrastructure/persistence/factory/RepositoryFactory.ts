import { RepositoryRegistry } from "../registry/RepositoryRegistry";
import { DatabaseFactory } from "../core/DatabaseFactory";
import { bootstrapPersistence } from "../bootstrap";

export class RepositoryFactory {
  public static create<T>(token: string): T {
    if (!RepositoryRegistry.has(token)) {
      // Lazy load the registry if not initialized
      bootstrapPersistence();
    }
    if (!RepositoryRegistry.has(token)) {
      throw new Error(`No repository registered for token: ${token}`);
    }
    const driver = DatabaseFactory.getDriver();
    const ImplClass = RepositoryRegistry.get(token);
    return new ImplClass(driver) as T;
  }
}
