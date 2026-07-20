import { EnvironmentResolver } from '../environment/EnvironmentResolver';

export interface ConfigProfile {
  CACHE_PROVIDER: string;
  DB_PROVIDER: string;
  LOG_LEVEL: string;
  ENABLE_FEATURES: string[];
}

export class ConfigService {
  private static cache = new Map<string, any>();
  private static isInitialized = false;

  private static defaultProfile: ConfigProfile = {
    CACHE_PROVIDER: "memory",
    DB_PROVIDER: "memory",
    LOG_LEVEL: "info",
    ENABLE_FEATURES: [],
  };

  static initialize() {
    if (this.isInitialized) return;
    
    // In a real implementation, this would pull from a JSON file, API, or env
    this.cache.set("CACHE_PROVIDER", process.env.CACHE_PROVIDER || this.defaultProfile.CACHE_PROVIDER);
    this.cache.set("DB_PROVIDER", process.env.DB_PROVIDER || this.defaultProfile.DB_PROVIDER);
    this.cache.set("LOG_LEVEL", process.env.LOG_LEVEL || (EnvironmentResolver.isDevelopment() ? 'debug' : 'info'));
    
    // We would validate the config against schema here
    this.isInitialized = true;
  }

  static get<T>(key: string, defaultValue?: T): T | undefined {
    if (!this.isInitialized) this.initialize();
    
    const value = this.cache.has(key) ? this.cache.get(key) : process.env[key];
    return value !== undefined ? (value as T) : defaultValue;
  }

  static getRequired<T>(key: string): T {
    if (!this.isInitialized) this.initialize();
    
    const value = this.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration Error: Missing required configuration key: ${key}`);
    }
    return value;
  }

  static clearCache() {
    this.cache.clear();
    this.isInitialized = false;
  }
}
