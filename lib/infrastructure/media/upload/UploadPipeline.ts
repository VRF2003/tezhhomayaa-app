import { MediaRequest, MediaResponse, MediaAsset, AssetLifecycle } from "../types";
import { IMediaProvider } from "../core/IMediaProvider";
import { MediaValidator } from "../validators/MediaValidator";
import { MediaSecurityService } from "../security/MediaSecurityService";
import { InfrastructureEventBus } from "../../events/InfrastructureEventBus";

export class UploadPipeline {
  static async process(request: MediaRequest, provider: IMediaProvider): Promise<MediaResponse> {
    // 1. Validation
    MediaValidator.validate(request);

    // 2. Security Scan
    await MediaSecurityService.validateUpload(request);

    // 3. Provider Upload (Persist Original)
    const { storagePath, providerMetadata } = await provider.upload(request);

    // 4. Create Initial Asset Record (Sync Phase finishes here)
    const assetId = crypto.randomUUID();
    const asset: MediaAsset = {
      id: assetId,
      fileName: request.originalName,
      originalName: request.originalName,
      mediaType: "UNKNOWN", // To be updated by metadata extraction
      mimeType: request.mimeType,
      size: request.size,
      checksum: "pending",
      provider: provider.name,
      storagePath,
      publicUrl: "", // Available after CDN processing or provider direct link
      createdAt: new Date().toISOString(),
      metadata: providerMetadata,
      tags: [],
      collectionId: request.collectionId,
      folderId: request.folderId,
      version: 1,
      status: "PROCESSING" as AssetLifecycle
    };

    // 5. Trigger Async Processing Pipeline via InfrastructureEventBus
    await InfrastructureEventBus.publish("MediaAssetUploaded", { asset, request });

    return {
      assetId,
      status: "PROCESSING",
      message: "Media upload initiated and is currently processing asynchronously."
    };
  }

  static async delete(asset: MediaAsset, provider: IMediaProvider): Promise<void> {
    // Soft or hard delete depending on domain, for now we assume hard delete in provider.
    await provider.delete(asset.storagePath);
    
    // Notify to clean up variants and CDN cache
    await InfrastructureEventBus.publish("MediaAssetDeleted", { asset });
  }
}
