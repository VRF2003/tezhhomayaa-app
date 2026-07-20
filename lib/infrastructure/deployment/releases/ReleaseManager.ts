import { BuildMetadataGenerator, DeploymentManifest } from '../metadata/BuildMetadataGenerator';

export type ReleaseState = 'Draft' | 'Validated' | 'Deploying' | 'Active' | 'Deprecated' | 'Rolled Back' | 'Archived';

export interface Release {
  id: string;
  manifest: DeploymentManifest;
  state: ReleaseState;
  createdAt: string;
  deployedAt?: string;
  rolledBackAt?: string;
}

export class ReleaseManager {
  private static activeRelease: Release | null = null;
  private static history: Release[] = [];

  static createRelease(): Release {
    const manifest = BuildMetadataGenerator.getManifest();
    const release: Release = {
      id: manifest.releaseVersion,
      manifest,
      state: 'Draft',
      createdAt: new Date().toISOString()
    };
    this.history.push(release);
    return release;
  }

  static markValidated(releaseId: string): void {
    const release = this.history.find(r => r.id === releaseId);
    if (release && release.state === 'Draft') {
      release.state = 'Validated';
    }
  }

  static activateRelease(releaseId: string): void {
    const release = this.history.find(r => r.id === releaseId);
    if (release) {
      if (this.activeRelease) {
        this.activeRelease.state = 'Deprecated';
      }
      release.state = 'Active';
      release.deployedAt = new Date().toISOString();
      this.activeRelease = release;
    }
  }

  static getActiveRelease(): Release | null {
    if (!this.activeRelease) {
      // Auto-create on first access if not initialized
      const release = this.createRelease();
      this.markValidated(release.id);
      this.activateRelease(release.id);
    }
    return this.activeRelease;
  }

  static getHistory(): Release[] {
    return this.history;
  }
}
