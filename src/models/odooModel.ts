import { IOdooObjectService } from "../services/odooObjectService";

export type Domain = Array<
  Array<[string, string, string | number | boolean | null]>
>;

export interface IFieldsInfo {
  [key: string]: { [key: string]: any };
}

export interface IOdooModel<T> {
  name: string;
  service: IOdooObjectService;
  fields: string[];
  search: (
    domain: Domain,
    offset?: number,
    limit?: number
  ) => Promise<number[]>;
  read: (id: number[], fields?: string[]) => Promise<T[]>;
  searchRead: (
    domain: Domain,
    fields?: string[],
    offset?: number,
    limit?: number
  ) => Promise<T[]>;
  searchCount: (domain: Domain) => Promise<number>;
  getFields: (attributes?: string[]) => Promise<IFieldsInfo>;
}

export class OdooModel<T = any> implements IOdooModel<T> {
  public name: string;
  public service: IOdooObjectService;
  public fields: string[];

  constructor(name: string, service: IOdooObjectService) {
    this.name = name;
    this.service = service;
    this.fields = [];
  }

  public search(
    domain: Domain,
    offset?: number,
    limit?: number
  ): Promise<number[]> {
    return this.service.execute_kw<number[]>(this.name, "search", domain, {
      offset,
      limit
    });
  }

  public read(id: number[], fields?: string[]): Promise<T[]> {
    return this.service.execute_kw<T[]>(this.name, "read", [id], {
      fields: fields || this.fields || []
    });
  }

  public searchRead(
    domain: Domain,
    fields?: string[],
    offset?: number,
    limit?: number
  ): Promise<T[]> {
    return this.service.execute_kw<T[]>(this.name, "search_read", domain, {
      fields: fields || this.fields || [],
      offset,
      limit
    });
  }

  public searchCount(domain: Domain): Promise<number> {
    return this.service.execute_kw<number>(this.name, "search_count", domain);
  }

  public getFields(attributes?: string[]): Promise<IFieldsInfo> {
    return this.service.execute_kw<IFieldsInfo>(this.name, "fields_get", [], {
      attributes: attributes || []
    });
  }
}
