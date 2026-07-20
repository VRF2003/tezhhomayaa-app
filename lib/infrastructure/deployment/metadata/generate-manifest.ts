import * as fs from 'fs';
import * as path from 'path';

const manifest = {
  build: {
    version: process.env.npm_package_version || "0.1.0",
    commitHash: process.env.GIT_COMMIT || "local-dev",
    buildTimestamp: new Date().toISOString(),
    buildNumber: process.env.BUILD_NUMBER || "local"
  },
  releaseVersion: `rel-${process.env.npm_package_version || "0.1.0"}-${process.env.BUILD_NUMBER || "local"}`,
  configVersion: "v1.0",
  migrationVersion: "003",
  environment: process.env.NODE_ENV || "development",
  enabledFeatures: []
};

const manifestPath = path.join(process.cwd(), 'deployment-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ deployment-manifest.json generated successfully at ${manifestPath}`);
