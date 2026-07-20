export interface ISecretProvider {
  getSecret(key: string): Promise<string | undefined>;
  validate(keys: string[]): Promise<{ valid: boolean; missing: string[] }>;
  refresh(): Promise<void>;
  health(): Promise<{ status: string; provider: string }>;
}

export class EnvSecretProvider implements ISecretProvider {
  async getSecret(key: string): Promise<string | undefined> {
    return process.env[key];
  }

  async validate(keys: string[]): Promise<{ valid: boolean; missing: string[] }> {
    const missing = keys.filter(key => !process.env[key]);
    return {
      valid: missing.length === 0,
      missing
    };
  }

  async refresh(): Promise<void> {
    // Env secrets don't typically need dynamic refresh during runtime in Node.js
    // unless pulled from external .env files dynamically.
    return Promise.resolve();
  }

  async health(): Promise<{ status: string; provider: string }> {
    return {
      status: "Healthy",
      provider: "EnvSecretProvider"
    };
  }
}
