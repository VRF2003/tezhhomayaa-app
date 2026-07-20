export class RepositoryRegistry {
  private static mappings = new Map<string, any>();

  public static register(token: string, implementation: any) {
    this.mappings.set(token, implementation);
  }

  public static get(token: string): any {
    return this.mappings.get(token);
  }

  public static has(token: string): boolean {
    return this.mappings.has(token);
  }
}
