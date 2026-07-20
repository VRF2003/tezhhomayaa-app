import { MediaAsset } from "../types";
import { CDNService } from "../cdn/CDNService";

export class DeliveryService {
  static getDeliveryUrl(asset: MediaAsset, secure: boolean = false): string {
    if (secure) {
      return CDNService.generateSignedUrl(asset, 1000 * 60 * 60); // 1 hour expiration
    }
    
    return CDNService.generateVersionedUrl(asset);
  }
}
