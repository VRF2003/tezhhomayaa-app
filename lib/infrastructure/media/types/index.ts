export type AssetLifecycle = "UPLOADING" | "PROCESSING" | "OPTIMIZING" | "PUBLISHED" | "ARCHIVED" | "DELETED";

export interface MediaAsset {
  id: string;
  fileName: string;
  originalName: string;
  mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" | "3D_ASSET" | "UNKNOWN";
  mimeType: string;
  size: number; // bytes
  dimensions?: { width: number; height: number };
  checksum: string;
  provider: string;
  storagePath: string;
  publicUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  metadata: Record<string, any>;
  tags: string[];
  collectionId?: string; // Logical grouping
  folderId?: string; // Hierarchical grouping
  version: number;
  status: AssetLifecycle;
}

export interface MediaRequest {
  file: Buffer | ArrayBuffer | string; // Accept buffer, or base64
  originalName: string;
  mimeType: string;
  size: number;
  collectionId?: string;
  folderId?: string;
  profileId?: string;
  metadata?: Record<string, any>;
}

export interface MediaResponse {
  assetId: string;
  status: AssetLifecycle;
  publicUrl?: string; // might not be available immediately if async processing
  message?: string;
}
