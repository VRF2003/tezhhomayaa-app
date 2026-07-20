import { SearchFilter } from "../types";

export class FilterBuilder {
  private filters: SearchFilter[] = [];

  eq(field: string, value: any): this {
    this.filters.push({ field, operator: "eq", value });
    return this;
  }

  neq(field: string, value: any): this {
    this.filters.push({ field, operator: "neq", value });
    return this;
  }

  gt(field: string, value: number): this {
    this.filters.push({ field, operator: "gt", value });
    return this;
  }

  lt(field: string, value: number): this {
    this.filters.push({ field, operator: "lt", value });
    return this;
  }

  in(field: string, value: any[]): this {
    this.filters.push({ field, operator: "in", value });
    return this;
  }

  contains(field: string, value: any): this {
    this.filters.push({ field, operator: "contains", value });
    return this;
  }

  build(): SearchFilter[] {
    return this.filters;
  }
}
