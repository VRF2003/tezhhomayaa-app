import { IMediaProvider } from "../core/IMediaProvider";
import { MediaRequest } from "../types";

export class AzureBlobProvider implements IMediaProvider {
  readonly name = "azure-blob";

  async connect(): Promise<void> {
    throw new Error("Not implemented");
  }

  async disconnect(): Promise<void> {
    throw new Error("Not implemented");
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }

  async upload(request: MediaRequest): Promise<{ storagePath: string; providerMetadata: any }> {
    throw new Error("Not implemented");
  }

  async delete(storagePath: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async exists(storagePath: string): Promise<boolean> {
    throw new Error("Not implemented");
  }

  getPublicUrl(storagePath: string): string {
    throw new Error("Not implemented");
  }

  async getStorageUsage(): Promise<number> {
    throw new Error("Not implemented");
  }
}
