import { MediaAsset } from "../types";
import { MediaProfileRegistry } from "../profiles/MediaProfile";

export class VariantGenerator {
  static async generate(asset: MediaAsset, profileId: string): Promise<void> {
    const profile = MediaProfileRegistry.getProfile(profileId);

    for (const variant of profile.variants) {
      // Generate the specific variant (thumbnail, small, medium, etc.)
      // Save it to the provider
      // Update asset metadata with variant URLs
    }
  }
}
