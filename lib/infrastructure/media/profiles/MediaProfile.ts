export interface MediaProfile {
  id: string;
  allowedFormats: string[];
  maxDimensions?: { width: number; height: number };
  maxSize: number; // bytes
  quality: number; // 1-100
  variants: VariantConfig[];
  compression: "LOSSY" | "LOSSLESS";
  visibilityDefaults: "PUBLIC" | "PRIVATE";
}

export interface VariantConfig {
  name: string; // e.g. "thumbnail", "small", "medium", "large"
  width: number;
  height: number;
  fit: "cover" | "contain" | "fill" | "inside" | "outside";
}

export class MediaProfileRegistry {
  private static profiles: Record<string, MediaProfile> = {
    "default": {
      id: "default",
      allowedFormats: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
      maxSize: 10 * 1024 * 1024, // 10MB
      quality: 85,
      compression: "LOSSY",
      visibilityDefaults: "PUBLIC",
      variants: [
        { name: "thumbnail", width: 150, height: 150, fit: "cover" },
        { name: "small", width: 480, height: 480, fit: "inside" },
        { name: "medium", width: 800, height: 800, fit: "inside" },
        { name: "large", width: 1200, height: 1200, fit: "inside" }
      ]
    },
    "secure_document": {
      id: "secure_document",
      allowedFormats: ["application/pdf"],
      maxSize: 50 * 1024 * 1024, // 50MB
      quality: 100,
      compression: "LOSSLESS",
      visibilityDefaults: "PRIVATE",
      variants: []
    }
  };

  static getProfile(id: string): MediaProfile {
    return this.profiles[id] || this.profiles["default"];
  }

  static registerProfile(profile: MediaProfile) {
    this.profiles[profile.id] = profile;
  }
}
