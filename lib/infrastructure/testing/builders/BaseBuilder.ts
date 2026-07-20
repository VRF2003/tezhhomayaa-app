export abstract class BaseBuilder<T> {
  protected entity: Partial<T>;

  constructor() {
    this.entity = this.defaultDefaults();
  }

  protected abstract defaultDefaults(): Partial<T>;

  public with(overrides: Partial<T>): this {
    this.entity = { ...this.entity, ...overrides };
    return this;
  }

  public build(): T {
    return this.entity as T;
  }
}
