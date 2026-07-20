import { bootstrapPersistence } from '@/lib/infrastructure/persistence/bootstrap';
import { DatabaseFactory } from '@/lib/infrastructure/persistence/core/DatabaseFactory';
import { ConfigService } from '@/lib/infrastructure/deployment/configuration/ConfigService';
import { Observability } from '@/lib/infrastructure/observability';

let isInitialized = false;

export class PlatformInitializer {
  static async initialize() {
    if (isInitialized) return;
    isInitialized = true;

    // Initialize Config
    ConfigService.initialize();

    // Initialize DB
    const driver = DatabaseFactory.getDriver();
    await driver.connect();
    
    // Register Repositories
    bootstrapPersistence();

    Observability.getLogger("System").info("Log", "Enterprise Platform Bootstrapped Successfully.");
  }
}
