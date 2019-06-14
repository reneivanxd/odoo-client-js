import { IOdooModel } from "./odooModel";
import { Domain } from "./odooModelDomain";

export interface IQueryBuilder<T> {
  filter: (domain: Domain) => IQueryBuilder<T>;
  orderBy: (order: string) => IQueryBuilder<T>;
  skip: (offset: number) => IQueryBuilder<T>;
  take: (limit: number) => IQueryBuilder<T>;
  all: () => Promise<T[]>;
  first: () => Promise<T | null>;
  count: () => Promise<number>;
  findAll: (ids: number[]) => Promise<T[]>;
  find: (id: number) => Promise<T | null>;
}

export class QueryBuilder<T> implements IQueryBuilder<T> {
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

  public filter(domain: Domain): IQueryBuilder<T> {
    this.domain = domain;
    return this;
  }

  public orderBy(order: string): IQueryBuilder<T> {
    this.order = order;
    return this;
  }

  public skip(offset: number): IQueryBuilder<T> {
    this.offset = offset;
    return this;
  }

  public take(limit: number): IQueryBuilder<T> {
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

  public findAll(ids: number[]): Promise<T[]> {
    return this.model.read(ids, this.fields);
  }

  public async find(id: number): Promise<T | null> {
    const result: T[] = await this.findAll([id]);
    return result && result.length > 0 ? result[0] : null;
  }
}
