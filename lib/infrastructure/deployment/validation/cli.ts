import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { DeploymentValidator } from '../validation/DeploymentValidator';
import { bootstrapPersistence } from '../../persistence/bootstrap';
import { DatabaseFactory } from '../../persistence/core/DatabaseFactory';

async function runValidationCLI() {
  console.log("🚀 Starting Enterprise Deployment Validation Pipeline...\n");

  try {
    const driver = DatabaseFactory.getDriver();
    await driver.connect();
    bootstrapPersistence();
    const results = await DeploymentValidator.executePipeline();
    let allPassed = true;

    results.forEach(res => {
      const icon = res.success ? "✅" : "❌";
      console.log(`${icon} [${res.stage}]: ${res.message}`);
      if (!res.success) allPassed = false;
    });

    if (allPassed) {
      console.log("\n🎉 Deployment Validation Passed. Ready for rollout.");
      process.exit(0);
    } else {
      console.error("\n💥 Deployment Validation Failed. Aborting deployment.");
      process.exit(1);
    }
  } catch (e: any) {
    console.error(`\n💥 Fatal Error during validation pipeline: ${e.message}`);
    process.exit(1);
  }
}

runValidationCLI();
