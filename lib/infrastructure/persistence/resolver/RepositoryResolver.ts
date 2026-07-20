import { RepositoryFactory } from "../factory/RepositoryFactory";

/**
 * Domain services should request repositories through RepositoryResolver 
 * instead of directly invoking RepositoryFactory.
 */
export class RepositoryResolver {
  public static resolve<T>(token: string): T {
    return RepositoryFactory.create<T>(token);
  }
}
