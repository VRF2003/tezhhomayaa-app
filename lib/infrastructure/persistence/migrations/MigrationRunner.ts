export interface IMigration {
  version: number;
  name: string;
  up(): Promise<void>;
  down(): Promise<void>;
}

export class MigrationRunner {
  private static migrations: IMigration[] = [];

  public static register(migration: IMigration) {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  public static async runUp(targetVersion?: number): Promise<void> {
    for (const migration of this.migrations) {
      if (targetVersion && migration.version > targetVersion) break;
      await migration.up();
      // In a real system, we would log this to a _migrations collection
    }
  }

  public static async runDown(targetVersion: number): Promise<void> {
    const reversed = [...this.migrations].reverse();
    for (const migration of reversed) {
      if (migration.version <= targetVersion) break;
      await migration.down();
    }
  }
  
  public static getHistory(): any[] {
    // Return mock history for admin dashboard
    return this.migrations.map(m => ({
      version: m.version,
      name: m.name,
      status: "COMPLETED",
      executedAt: new Date().toISOString()
    }));
  }
}
