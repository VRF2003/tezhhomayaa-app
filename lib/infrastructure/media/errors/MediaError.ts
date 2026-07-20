export class MediaError extends Error {
  constructor(message: string, public readonly code: string = "MEDIA_ERROR") {
    super(message);
    this.name = "MediaError";
  }
}

export class UnsupportedMediaTypeError extends MediaError {
  constructor(mimeType: string) {
    super(`Unsupported media type: ${mimeType}`, "UNSUPPORTED_MEDIA_TYPE");
    this.name = "UnsupportedMediaTypeError";
  }
}

export class UploadFailedError extends MediaError {
  constructor(reason: string) {
    super(`Upload failed: ${reason}`, "UPLOAD_FAILED");
    this.name = "UploadFailedError";
  }
}

export class MediaSecurityError extends MediaError {
  constructor(reason: string) {
    super(`Security validation failed: ${reason}`, "MEDIA_SECURITY_ERROR");
    this.name = "MediaSecurityError";
  }
}
