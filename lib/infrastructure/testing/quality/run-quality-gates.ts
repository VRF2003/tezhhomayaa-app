import { QualityGateManager } from './QualityGateManager';
import fs from 'fs';
import path from 'path';

// Usage: node run-quality-gates.js
const projectRoot = process.cwd();
const manager = new QualityGateManager(projectRoot);
const report = manager.runGates();

const outputDir = path.join(projectRoot, 'lib/infrastructure/testing/coverage-reports');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'quality-report.json'),
  JSON.stringify(report, null, 2)
);

if (report.architecture.passed) {
  console.log("✅ Architecture validation passed.");
} else {
  console.error(`❌ Architecture validation failed with ${report.architecture.violations.length} violations.`);
  report.architecture.violations.forEach(v => {
    console.error(`  - [${v.rule}] ${v.file}:${v.line || '?'}`);
    console.error(`    ${v.message}`);
  });
  process.exit(1);
}
