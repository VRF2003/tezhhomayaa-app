export class ContentResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentResolutionError";
  }
}
