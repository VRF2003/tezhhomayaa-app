import { ICacheProvider } from './ICacheProvider';
import { MemoryCacheProvider } from '../providers/MemoryCacheProvider';
import { ConfigService } from '../../deployment/configuration/ConfigService';

export class CacheResolver {
  private static providerInstance: ICacheProvider | null = null;

  static resolve(): ICacheProvider {
    if (this.providerInstance) {
      return this.providerInstance;
    }

    const providerType = ConfigService.get<string>("CACHE_PROVIDER") || "memory";

    switch (providerType) {
      case "memory":
        this.providerInstance = new MemoryCacheProvider();
        break;
      case "redis":
        throw new Error("Redis provider is currently just a skeleton.");
      case "cloudflare":
        throw new Error("Cloudflare KV provider is currently just a skeleton.");
      default:
        this.providerInstance = new MemoryCacheProvider();
    }

    return this.providerInstance;
  }
}
