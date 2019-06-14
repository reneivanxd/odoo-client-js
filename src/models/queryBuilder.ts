import { IOdooModel } from "./odooModel";
import { Domain } from "./odooModelDomain";

export class QueryBuilder<T> {
  private model: IOdooModel<T>;
  private fields: string[];
  private domain: Domain;
  private offset?: number;
  private limit?: number;
  private order?: string;

  constructor(model: IOdooModel<T>, fields?: string[]) {
    this.model = model;
    this.fields = fields || [];
    this.domain = [];
  }

  public filter(domain: Domain): QueryBuilder<T> {
    this.domain = domain;
    return this;
  }

  public orderBy(order: string): QueryBuilder<T> {
    this.order = order;
    return this;
  }

  public skip(offset: number): QueryBuilder<T> {
    this.offset = offset;
    return this;
  }

  public take(limit: number): QueryBuilder<T> {
    this.limit = limit;
    return this;
  }

  public all(): Promise<T[]> {
    return this.model.searchRead(
      this.domain,
      this.fields,
      this.order,
      this.offset,
      this.limit
    );
  }

  public async first(): Promise<T | null> {
    const result: T[] = await this.skip(0)
      .take(1)
      .all();
    return result && result.length > 0 ? result[0] : null;
  }

  public count(): Promise<number> {
    return this.model.searchCount(this.domain);
  }
}
