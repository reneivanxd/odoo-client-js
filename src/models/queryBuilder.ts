import { IOdooConnection } from "../connections/odooConnection";
import { IOdooModel } from "./odooModel";
import { Domain } from "./odooModelDomain";

export interface IQueryBuilder<T> {
    select: (fields?: string[]) => IQueryBuilder<T>;
    where: (domain: Domain) => IQueryBuilder<T>;
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
    public static fromConnection<T = any>(
        odooConnection: IOdooConnection,
        modelName: string
    ): IQueryBuilder<T> {
        return new QueryBuilder<T>(odooConnection.getModel<T>(modelName));
    }

    public static fromModel<T = any>(
        odooModel: IOdooModel<T>
    ): IQueryBuilder<T> {
        return new QueryBuilder<T>(odooModel);
    }

    private model: IOdooModel<T>;
    private fields: string[];
    private domain: Domain;
    private offset?: number;
    private limit?: number;
    private order?: string;

    constructor(model: IOdooModel<T>, fields?: string[]) {
        this.model = model;
        this.fields = fields || model.fields || [];
        this.domain = [];
    }

    public select(fields?: string[]): IQueryBuilder<T> {
        this.fields = fields || [];
        return this;
    }

    public where(domain: Domain): IQueryBuilder<T> {
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
