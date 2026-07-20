import { IDatabaseDriver } from "./IDatabaseDriver";

export class MemoryDriver implements IDatabaseDriver {
  private data: Record<string, Record<string, any>> = {};
  private connected = false;

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
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 0));
    return performance.now() - start;
  }

  public getName(): string {
    return "MemoryDriver";
  }

  public async read(collection: string, id: string): Promise<any> {
    if (!this.data[collection]) return null;
    return this.data[collection][id] || null;
  }

  public async write(collection: string, id: string, payload: any): Promise<void> {
    if (!this.data[collection]) {
      this.data[collection] = {};
    }
    this.data[collection][id] = payload;
  }

  public async delete(collection: string, id: string): Promise<void> {
    if (this.data[collection]) {
      delete this.data[collection][id];
    }
  }

  public async query(collection: string, filters?: any): Promise<any[]> {
    if (!this.data[collection]) return [];
    let results = Object.values(this.data[collection]);
    
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
