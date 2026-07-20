import { ArchitectureValidator, ArchitectureViolation } from '../validators/ArchitectureValidator';

export interface QualityReport {
  timestamp: string;
  architecture: {
    passed: boolean;
    violations: ArchitectureViolation[];
  };
  coverage: {
    passed: boolean;
    metrics?: any; // To be populated from coverage-v8 output
  };
  contracts: {
    passed: boolean;
  };
  score: number;
}

export class QualityGateManager {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  public runGates(): QualityReport {
    const tsConfigPath = `${this.projectRoot}/tsconfig.json`;
    const validator = new ArchitectureValidator(tsConfigPath);
    const violations = validator.validate();

    const report: QualityReport = {
      timestamp: new Date().toISOString(),
      architecture: {
        passed: violations.length === 0,
        violations,
      },
      coverage: {
        passed: true, // Placeholder until coverage parsing is integrated
      },
      contracts: {
        passed: true, // Placeholder until vitest output parsing is integrated
      },
      score: 100, // Initial score calculation
    };

    if (violations.length > 0) {
      report.score -= 50; // Deduct for architecture violations
    }

    return report;
  }
}
