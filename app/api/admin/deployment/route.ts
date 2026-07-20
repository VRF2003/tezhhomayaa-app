import { NextResponse } from 'next/server';
import { ReleaseManager } from '@/lib/infrastructure/deployment/releases/ReleaseManager';
import { EnvironmentResolver } from '@/lib/infrastructure/deployment/environment/EnvironmentResolver';
import { DeploymentValidator } from '@/lib/infrastructure/deployment/validation/DeploymentValidator';
import { RollbackManager } from '@/lib/infrastructure/deployment/rollback/RollbackManager';
import { DeploymentAudit } from '@/lib/infrastructure/deployment/audit/DeploymentAudit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activeRelease = ReleaseManager.getActiveRelease();
    const history = ReleaseManager.getHistory();
    
    return NextResponse.json({
      environment: EnvironmentResolver.getCurrentEnvironment(),
      activeRelease,
      history,
      capabilities: {
        isProduction: EnvironmentResolver.isProduction(),
        isPreview: EnvironmentResolver.isPreview(),
        supportsDebug: EnvironmentResolver.supportsDebugFeatures(),
        isReadOnly: EnvironmentResolver.isReadOnly(),
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load deployment stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    if (action === 'validate') {
      const results = await DeploymentValidator.executePipeline();
      const success = results.every(r => r.success);
      return NextResponse.json({ success, results });
    }

    if (action === 'rollback') {
      const success = await RollbackManager.rollbackToPrevious();
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
