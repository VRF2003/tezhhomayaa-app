import { PersistenceProvider, getActiveProvider } from "./PersistenceProvider";
import { IDatabaseDriver } from "../drivers/IDatabaseDriver";
import { MemoryDriver } from "../drivers/MemoryDriver";
import { FirestoreDriver } from "../drivers/FirestoreDriver";

export class DatabaseFactory {
  private static instance: IDatabaseDriver | null = null;

  public static getDriver(): IDatabaseDriver {
    if (this.instance) {
      return this.instance;
    }

    const provider = getActiveProvider();

    switch (provider) {
      case PersistenceProvider.FIRESTORE:
        this.instance = new FirestoreDriver();
        break;
      case PersistenceProvider.MEMORY:
      default:
        this.instance = new MemoryDriver();
        break;
    }

    return this.instance;
  }

  public static resetForTesting() {
    if (this.instance) {
      this.instance.disconnect();
    }
    this.instance = null;
  }
}
