import { IMediaProvider } from "../core/IMediaProvider";
import { MediaRequest } from "../types";

export class LocalMediaProvider implements IMediaProvider {
  readonly name = "local";

  async connect(): Promise<void> {
    // Check local directories exist, etc.
  }

  async disconnect(): Promise<void> {
    // No-op for local
  }

  async healthCheck(): Promise<boolean> {
    return true; // Always healthy
  }

  async upload(request: MediaRequest): Promise<{ storagePath: string; providerMetadata: any }> {
    // In a real local provider, we'd fs.writeFile to a local path.
    const mockStoragePath = `/uploads/local/${crypto.randomUUID()}-${request.originalName}`;
    return {
      storagePath: mockStoragePath,
      providerMetadata: { size: request.size, type: "local_file" }
    };
  }

  async delete(storagePath: string): Promise<void> {
    // fs.unlink
  }

  async exists(storagePath: string): Promise<boolean> {
    return true; // Mock true
  }

  getPublicUrl(storagePath: string): string {
    return storagePath; // Serve directly via local Next.js public/ route
  }

  async getStorageUsage(): Promise<number> {
    return 1024 * 1024 * 50; // Mock 50 MB
  }
}
