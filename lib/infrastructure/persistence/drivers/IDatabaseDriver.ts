export interface IDatabaseDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  healthCheck(): Promise<boolean>;
  getLatency(): Promise<number>;
  getName(): string;
  
  // Base CRUD operations (Generic across collections/tables)
  read(collection: string, id: string): Promise<any>;
  write(collection: string, id: string, data: any): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters?: any): Promise<any[]>;
  
  // Transactions
  startTransaction(): Promise<any>; // Returns a transaction scope/object
  commitTransaction(tx: any): Promise<void>;
  rollbackTransaction(tx: any): Promise<void>;
}
