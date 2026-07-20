import { IMediaProvider } from "./IMediaProvider";
import { MediaRequest, MediaResponse, MediaAsset } from "../types";
import { UploadPipeline } from "../upload/UploadPipeline";
import { CDNService } from "../cdn/CDNService";

export class MediaService {
  private static provider: IMediaProvider;

  static initialize(provider: IMediaProvider) {
    this.provider = provider;
  }

  static getProvider(): IMediaProvider {
    if (!this.provider) {
      throw new Error("MediaService not initialized with a provider.");
    }
    return this.provider;
  }

  /**
   * Main entry point for domains to upload media.
   * Completely decouples business domains from the provider.
   */
  static async upload(request: MediaRequest): Promise<MediaResponse> {
    return UploadPipeline.process(request, this.getProvider());
  }

  /**
   * Retrieve a public URL for an asset, utilizing CDN abstractions.
   */
  static getAssetUrl(asset: MediaAsset): string {
    return CDNService.resolveUrl(asset);
  }

  /**
   * Secure deletion of an asset.
   */
  static async delete(asset: MediaAsset): Promise<void> {
    // Pipeline to handle CDN invalidation, removing variants, etc.
    return UploadPipeline.delete(asset, this.getProvider());
  }
}
