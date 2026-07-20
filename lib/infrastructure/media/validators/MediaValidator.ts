import { MediaRequest } from "../types";
import { MediaProfileRegistry } from "../profiles/MediaProfile";
import { UnsupportedMediaTypeError, MediaError } from "../errors/MediaError";

export class MediaValidator {
  static validate(request: MediaRequest): void {
    const profile = MediaProfileRegistry.getProfile(request.profileId || "default");

    if (!profile.allowedFormats.includes(request.mimeType)) {
      throw new UnsupportedMediaTypeError(request.mimeType);
    }

    if (request.size > profile.maxSize) {
      throw new MediaError(`File size ${request.size} exceeds maximum allowed size of ${profile.maxSize}`);
    }
  }
}
