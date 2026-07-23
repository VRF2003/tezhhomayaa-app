import { IDatabaseDriver } from "./IDatabaseDriver";
import fs from "fs";
import path from "path";

export class MemoryDriver implements IDatabaseDriver {
  private connected = false;
  private get dbPath() {
    return path.join(process.cwd(), ".local-db.json");
  }

  private loadData(): Record<string, Record<string, any>> {
    try {
      if (fs.existsSync(this.dbPath)) {
        return JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
      }
    } catch (e) {
      console.warn("Failed to read local DB, starting fresh", e);
    }
    return {};
  }

  private saveData(data: Record<string, Record<string, any>>) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to write to local DB", e);
    }
  }

  public async connect(): Promise<void> {
    this.connected = true;
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async healthCheck(): Promise<boolean> {
    return this.connected;
  }

  public async getLatency(): Promise<number> {
    return 1;
  }

  public getName(): string {
    return "MemoryDriver (File-Backed)";
  }

  public async read(collection: string, id: string): Promise<any> {
    const data = this.loadData();
    if (!data[collection]) return null;
    return data[collection][id] || null;
  }

  public async write(collection: string, id: string, payload: any): Promise<void> {
    const data = this.loadData();
    if (!data[collection]) {
      data[collection] = {};
    }
    data[collection][id] = payload;
    this.saveData(data);
  }

  public async delete(collection: string, id: string): Promise<void> {
    const data = this.loadData();
    if (data[collection]) {
      delete data[collection][id];
      this.saveData(data);
    }
  }

  public async query(collection: string, filters?: any): Promise<any[]> {
    const data = this.loadData();
    if (!data[collection]) return [];
    let results = Object.values(data[collection]);
    
    if (filters) {
      results = results.filter(item => {
        return Object.entries(filters).every(([key, value]) => item[key] === value);
      });
    }
    return results;
  }

  public async startTransaction(): Promise<any> {
    // In-memory transactions can be simulated by deep cloning state, 
    // but for simplicity, we return a mock transaction object.
    return { id: Math.random().toString(36).substring(7) };
  }

  public async commitTransaction(tx: any): Promise<void> {
    // No-op for simple memory driver
  }

  public async rollbackTransaction(tx: any): Promise<void> {
    // No-op for simple memory driver. A true robust memory driver would
    // restore the deep clone.
  }
}
