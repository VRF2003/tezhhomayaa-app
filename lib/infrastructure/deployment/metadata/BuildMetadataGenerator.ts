import * as fs from 'fs';
import * as path from 'path';
import { EnvironmentResolver } from '../environment/EnvironmentResolver';

export interface BuildMetadata {
  version: string;
  commitHash: string;
  buildTimestamp: string;
  buildNumber: string;
}

export interface DeploymentManifest {
  build: BuildMetadata;
  releaseVersion: string;
  configVersion: string;
  migrationVersion: string;
  environment: string;
  enabledFeatures: string[];
}

export class BuildMetadataGenerator {
  static getMetadata(): BuildMetadata {
    try {
      // In a real environment, this file is written during the build phase by a CI pipeline
      const manifestPath = path.join(process.cwd(), 'deployment-manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest: DeploymentManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        return manifest.build;
      }
    } catch (e) {
      // Ignore
    }

    // Fallback for local development
    return {
      version: process.env.npm_package_version || "0.1.0",
      commitHash: process.env.GIT_COMMIT || "local-dev",
      buildTimestamp: new Date().toISOString(),
      buildNumber: process.env.BUILD_NUMBER || "local"
    };
  }

  static getManifest(): DeploymentManifest {
    const build = this.getMetadata();
    
    // Enrich with runtime configuration
    return {
      build,
      releaseVersion: `rel-${build.version}-${build.buildNumber}`,
      configVersion: "v1.0",
      migrationVersion: "003",
      environment: EnvironmentResolver.getCurrentEnvironment(),
      enabledFeatures: []
    };
  }
}
