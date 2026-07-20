import { BaseBuilder } from './BaseBuilder';

export interface TestUser {
  id: string;
  email: string;
  role: string;
  displayName?: string;
}

export class UserBuilder extends BaseBuilder<TestUser> {
  protected defaultDefaults(): Partial<TestUser> {
    return {
      id: 'test-user-id',
      email: 'user@tezhhomayaa.com',
      role: 'USER',
      displayName: 'Test User',
    };
  }

  public asAdmin(): this {
    this.entity.role = 'ADMIN';
    return this;
  }
}
