export enum PersistenceProvider {
  MEMORY = "MEMORY",
  FIRESTORE = "FIRESTORE",
  POSTGRESQL = "POSTGRESQL",
}

export interface PersistenceConfig {
  activeProvider: PersistenceProvider;
  connectionString?: string;
  projectId?: string;
  maxConnections?: number;
}

export const getActiveProvider = (): PersistenceProvider => {
  const providerStr = process.env.PERSISTENCE_PROVIDER || "MEMORY";
  return PersistenceProvider[providerStr as keyof typeof PersistenceProvider] || PersistenceProvider.MEMORY;
};
