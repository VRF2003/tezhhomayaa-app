import { MediaRequest, MediaAsset } from "../types";

export interface IMediaProvider {
  /** Provider identifier (e.g. 'local', 's3', 'cloudinary') */
  readonly name: string;
  
  /** Connect to the provider */
  connect(): Promise<void>;
  
  /** Disconnect from the provider */
  disconnect(): Promise<void>;
  
  /** Health check */
  healthCheck(): Promise<boolean>;

  /** Upload a file and return provider-specific storage path/metadata */
  upload(request: MediaRequest): Promise<{ storagePath: string; providerMetadata: any }>;
  
  /** Delete a file by its storage path */
  delete(storagePath: string): Promise<void>;
  
  /** Check if file exists */
  exists(storagePath: string): Promise<boolean>;
  
  /** Get public URL for a storage path (if provider supports direct serving) */
  getPublicUrl(storagePath: string): string;

  /** Get storage usage metrics (in bytes) */
  getStorageUsage(): Promise<number>;
}
