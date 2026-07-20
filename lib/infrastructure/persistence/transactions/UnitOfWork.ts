import { TransactionManager } from "./TransactionManager";
import { DomainTransaction } from "./DomainTransaction";

export class UnitOfWork {
  public static async execute<T>(work: (tx: DomainTransaction) => Promise<T>): Promise<T> {
    const tx = await TransactionManager.beginTransaction();
    try {
      const result = await work(tx);
      await TransactionManager.commit(tx);
      return result;
    } catch (error) {
      await TransactionManager.rollback(tx);
      throw error;
    }
  }
}
