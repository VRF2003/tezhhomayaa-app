import { DatabaseFactory } from "./DatabaseFactory";

export class ConnectionManager {
  public static async connectAll(): Promise<void> {
    const driver = DatabaseFactory.getDriver();
    if (!driver.isConnected()) {
      await driver.connect();
    }
  }

  public static async disconnectAll(): Promise<void> {
    const driver = DatabaseFactory.getDriver();
    if (driver.isConnected()) {
      await driver.disconnect();
    }
  }

  public static async checkHealth(): Promise<boolean> {
    const driver = DatabaseFactory.getDriver();
    return driver.healthCheck();
  }
}
