import { InfrastructureEventBus } from "../../events/InfrastructureEventBus";
import { MediaAsset, MediaRequest } from "../types";
import { TransformationService } from "../transform/TransformationService";
import { OptimizationService } from "../optimization/OptimizationService";
import { VariantGenerator } from "../variants/VariantGenerator";
import { MetadataExtractor } from "../metadata/MetadataExtractor";
import { CDNService } from "../cdn/CDNService";
import { MediaMetrics } from "../metrics/MediaMetrics";

export class MediaEventSubscriber {
  static register() {
    InfrastructureEventBus.subscribe("MediaAssetUploaded", async (payload: { asset: MediaAsset, request: MediaRequest }) => {
      let { asset, request } = payload;
      const profileId = request.profileId || "default";

      try {
        const t0 = Date.now();
        asset = await MetadataExtractor.extract(asset, request.file);
        
        const t1 = Date.now();
        asset = await TransformationService.process(asset, profileId);
        
        const t2 = Date.now();
        asset = await OptimizationService.process(asset, profileId);
        
        const t3 = Date.now();
        await VariantGenerator.generate(asset, profileId);
        
        const t4 = Date.now();
        await CDNService.warmCache(asset);
        
        MediaMetrics.recordProcessing({
          metadataExtraction: t1 - t0,
          transformation: t2 - t1,
          optimization: t3 - t2,
          variants: t4 - t3
        });
      } catch (error) {
        console.error("Media processing failed asynchronously", error);
        MediaMetrics.recordFailure();
      }
    });

    InfrastructureEventBus.subscribe("MediaAssetDeleted", async (payload: { asset: MediaAsset }) => {
      await CDNService.invalidateCache(payload.asset);
      // Clean up variants from provider
    });
  }
}
