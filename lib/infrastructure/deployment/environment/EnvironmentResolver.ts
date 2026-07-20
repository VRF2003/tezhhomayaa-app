export type Environment = 'development' | 'testing' | 'staging' | 'production' | 'preview' | 'feature-branch';

export class EnvironmentResolver {
  static getCurrentEnvironment(): Environment {
    // Determine from underlying config or OS, falling back to 'development'
    const env = process.env.NODE_ENV || 'development';
    return env as Environment;
  }

  static isProduction(): boolean {
    return this.getCurrentEnvironment() === 'production';
  }

  static isDevelopment(): boolean {
    return this.getCurrentEnvironment() === 'development';
  }

  static isPreview(): boolean {
    return ['preview', 'feature-branch'].includes(this.getCurrentEnvironment());
  }

  static supportsDebugFeatures(): boolean {
    return this.isDevelopment() || this.isPreview() || this.getCurrentEnvironment() === 'staging';
  }

  static isReadOnly(): boolean {
    // Preview environments might be explicitly set to read-only
    return process.env.IS_READ_ONLY === 'true';
  }
}
