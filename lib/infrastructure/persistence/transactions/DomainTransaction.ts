import { IDatabaseDriver } from "../drivers/IDatabaseDriver";

export class DomainTransaction {
  constructor(private driver: IDatabaseDriver, private txScope: any) {}

  public getScope(): any {
    return this.txScope;
  }
}
