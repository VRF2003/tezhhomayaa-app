import { DatabaseFactory } from "../core/DatabaseFactory";
import { DomainTransaction } from "./DomainTransaction";

export class TransactionManager {
  public static async beginTransaction(): Promise<DomainTransaction> {
    const driver = DatabaseFactory.getDriver();
    const scope = await driver.startTransaction();
    return new DomainTransaction(driver, scope);
  }

  public static async commit(tx: DomainTransaction): Promise<void> {
    const driver = DatabaseFactory.getDriver();
    await driver.commitTransaction(tx.getScope());
  }

  public static async rollback(tx: DomainTransaction): Promise<void> {
    const driver = DatabaseFactory.getDriver();
    await driver.rollbackTransaction(tx.getScope());
  }
}
